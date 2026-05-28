const http = require("http");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = __dirname;
const ENV_FILE_CANDIDATES = [".env.local", ".env"];

loadEnvFiles();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 3000);
const DEFAULT_OPENAI_BASE_URL = "https://codex.ai02.cn";
const DEFAULT_OPENAI_MODEL = "gpt-5.4";
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_MESSAGE_CHARS = 600;
const MAX_REQUEST_BODY_BYTES = 12 * 1024 * 1024;
const MAX_ATTACHMENT_COUNT = 4;
const MAX_ATTACHMENT_NAME_CHARS = 120;
const MAX_TEXT_ATTACHMENT_CHARS = 12000;
const API_BASE_URL = process.env.OPENAI_BASE_URL || DEFAULT_OPENAI_BASE_URL;
const MODEL_NAME = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

const SYSTEM_PROMPT = `
你是“时间织梦簿”里的守星人。你的职责是把用户的目标整理成能立刻开始执行的计划。

必须遵守：
1. 如果用户信息足够，就优先给 draft，不要过度追问。
2. 只有在目标过于模糊、缺少关键约束且无法稳定拆解时，才返回 ask。
3. tasks 必须是 4 到 7 条，中文，具体、可执行、像看板任务，不要空话。
4. 语气温柔、清晰、有人味，但不要鸡汤，不要像客服。
5. deadline 如果能从上下文明确推断，就给具体日期；不能稳定判断时写“待确认”。
6. reply 要简洁，长度控制在 2 到 4 句。
`;

const PLANNER_RESPONSE_SCHEMA = {
  name: "planner_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      mode: {
        type: "string",
        enum: ["ask", "draft"]
      },
      reply: {
        type: "string"
      },
      draft: {
        anyOf: [
          {
            type: "null"
          },
          {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              deadline: { type: "string" },
              rationale: { type: "string" },
              tasks: {
                type: "array",
                items: { type: "string" },
                minItems: 4,
                maxItems: 7
              }
            },
            required: ["title", "deadline", "rationale", "tasks"]
          }
        ]
      }
    },
    required: ["mode", "reply", "draft"]
  }
};

const PLANNER_RUNTIME_PROMPT = `
你是“时间织梦簿”里的守星人，负责把用户的长期目标、学习任务和比赛项目整理成稳定、可执行、可追踪的计划。

你必须遵守以下固定流程：
1. 先做简短问诊，再决定是否出计划。除非用户已经一次性提供足够信息，否则第一轮优先补齐信息，不要直接生成完整计划。
2. 判断是否足够出计划时，至少检查以下 5 类信息中的 4 类：目标与最终交付物、截止时间或时间窗口、当前进度或基础、每天或每周可投入时长、专注力或作息或资源限制。
3. 如果信息不足，返回 mode=ask，并提出 3 到 5 个高价值问题。问题必须具体、易回答、能直接帮助后续拆解，优先追问缺失项。
4. 如果信息足够，返回 mode=draft。先给 2 到 4 句短回复，再给结构化草案。
5. 面对相似输入，尽量沿用一致的拆解框架。默认优先按“明确交付物 -> 整理资料与约束 -> 完成首版 -> 校验修订 -> 收尾提交或复盘”的顺序组织任务，再按实际情况调整。
6. tasks 必须 4 到 7 条，使用中文，写成“动词 + 对象 + 结果或产出”的形式，粒度要能直接进入看板执行。
7. deadline 能明确就写具体日期或时间点，不能稳定判断时写“待确认”。
8. tips 提供 1 到 3 条短建议，优先围绕时间分配、专注管理、风险提醒和空档时间利用，不要鸡汤。
9. reply 语气温和、清楚、有陪伴感，但不要客服腔，不要长篇安慰。
10. 如果用户正在补充信息，不要重复追问已经明确的内容；优先消化新答案，再判断是否可以进入 draft。
11. 当前产品场景以大学生的长期目标、课程任务、考试复习、比赛项目为主。输出时要尽量体现长期目标可拆解、临近 DDL 风险提醒、今日行动建议和后续动态调整。
12. 注意隐私边界，不主动索取过细的个人敏感信息。
`;

const PLANNER_RUNTIME_SCHEMA = {
  name: "planner_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      mode: {
        type: "string",
        enum: ["ask", "draft"]
      },
      reply: {
        type: "string"
      },
      questions: {
        anyOf: [
          {
            type: "null"
          },
          {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 5
          }
        ]
      },
      draft: {
        anyOf: [
          {
            type: "null"
          },
          {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              deadline: { type: "string" },
              rationale: { type: "string" },
              tasks: {
                type: "array",
                items: { type: "string" },
                minItems: 4,
                maxItems: 7
              },
              tips: {
                type: "array",
                items: { type: "string" },
                minItems: 1,
                maxItems: 3
              }
            },
            required: ["title", "deadline", "rationale", "tasks", "tips"]
          }
        ]
      }
    },
    required: ["mode", "reply", "questions", "draft"]
  }
};

const LEARNING_EVIDENCE_PROMPT = `
For learning, exam prep, and skill-building, prefer evidence-based methods:
1. Use retrieval practice, spaced review, interleaving, and worked examples when appropriate.
2. For plans longer than one week, include explicit review checkpoints and a weekly review rhythm.
3. For habit goals, include a fixed cue, a tiny minimum action, and an if-then fallback for distraction or low-energy days.
4. Do not recommend rereading, highlighting, or cramming as the main strategy unless the user explicitly asks for them.`;

function loadEnvFiles() {
  ENV_FILE_CANDIDATES.forEach((filename) => {
    const fullPath = path.join(ROOT_DIR, filename);
    if (!fs.existsSync(fullPath)) {
      return;
    }

    const content = fs.readFileSync(fullPath, "utf8");
    const shouldOverrideExisting = filename === ".env.local";
    parseEnvFile(content).forEach(([key, value]) => {
      if (shouldOverrideExisting || !(key in process.env)) {
        process.env[key] = value;
      }
    });
  });
}

function parseEnvFile(content) {
  return content
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        return null;
      }

      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      return key ? [key, value] : null;
    })
    .filter(Boolean);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8"
  });
  response.end(message);
}

function parseRequestBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > MAX_REQUEST_BODY_BYTES) {
        reject(new Error("Request body too large."));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(new Error("Invalid JSON body."));
      }
    });

    request.on("error", reject);
  });
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((message) => message && typeof message.text === "string")
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.text.trim().slice(0, MAX_HISTORY_MESSAGE_CHARS)
    }))
    .filter((message) => message.content);
}

function normalizeAttachmentName(name, fallbackName) {
  const normalized = String(name || fallbackName || "attachment")
    .trim()
    .replace(/\s+/g, " ");
  return normalized.slice(0, MAX_ATTACHMENT_NAME_CHARS) || "attachment";
}

function normalizeTextAttachment(attachment) {
  const text = typeof attachment?.text === "string" ? attachment.text.trim() : "";
  if (!text) {
    return null;
  }

  return {
    kind: "text",
    name: normalizeAttachmentName(attachment?.name, "notes.txt"),
    mimeType: String(attachment?.mimeType || "text/plain").trim() || "text/plain",
    text: text.slice(0, MAX_TEXT_ATTACHMENT_CHARS)
  };
}

function normalizeImageAttachment(attachment) {
  const dataUrl = typeof attachment?.dataUrl === "string" ? attachment.dataUrl.trim() : "";
  if (!/^data:image\/[a-zA-Z0-9.+-]+;base64,/u.test(dataUrl)) {
    return null;
  }

  return {
    kind: "image",
    name: normalizeAttachmentName(attachment?.name, "image"),
    mimeType: String(attachment?.mimeType || "").trim() || "image/*",
    dataUrl
  };
}

function normalizePdfAttachment(attachment) {
  const fileData = typeof attachment?.fileData === "string" ? attachment.fileData.trim() : "";
  if (!/^data:application\/pdf;base64,/iu.test(fileData)) {
    return null;
  }

  return {
    kind: "pdf",
    name: normalizeAttachmentName(attachment?.name, "document.pdf"),
    mimeType: "application/pdf",
    fileData
  };
}

function normalizeDocxAttachment(attachment) {
  const fileData = typeof attachment?.fileData === "string" ? attachment.fileData.trim() : "";
  if (!/^data:application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document;base64,/iu.test(fileData)) {
    return null;
  }

  return {
    kind: "docx",
    name: normalizeAttachmentName(attachment?.name, "document.docx"),
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileData
  };
}

function normalizeAttachments(attachments) {
  if (!Array.isArray(attachments)) {
    return [];
  }

  return attachments
    .slice(0, MAX_ATTACHMENT_COUNT)
    .map((attachment) => {
      if (!attachment || typeof attachment !== "object") {
        return null;
      }

      if (attachment.kind === "image") {
        return normalizeImageAttachment(attachment);
      }

      if (attachment.kind === "pdf") {
        return normalizePdfAttachment(attachment);
      }

      if (attachment.kind === "docx") {
        return normalizeDocxAttachment(attachment);
      }

      if (attachment.kind === "text") {
        return normalizeTextAttachment(attachment);
      }

      return null;
    })
    .filter(Boolean);
}

function legacyBuildAttachmentSummaryV1(attachments) {
  if (!attachments.length) {
    return "";
  }

  return attachments
    .map((attachment, index) => {
      if (attachment.kind === "image") {
        return `${index + 1}. 图片《${attachment.name}》`;
      }

      if (attachment.kind === "pdf") {
        return `${index + 1}. PDF《${attachment.name}》`;
      }

      return `${index + 1}. 文本文件《${attachment.name}》`;
    })
    .join("\n");
}

function buildMessageContent(prompt, attachments) {
  const normalizedPrompt = String(prompt || "").trim();
  const summary = buildAttachmentSummary(attachments);
  const content = [];

  if (normalizedPrompt || summary) {
    content.push({
      type: "input_text",
      text: normalizedPrompt && summary
        ? `${normalizedPrompt}\n\n附件概览：\n${summary}`
        : normalizedPrompt || `我上传了下面这些补充材料，请结合它们帮我整理计划。\n${summary}`
    });
  }

  attachments.forEach((attachment) => {
    if (attachment.kind === "image") {
      content.push({
        type: "input_image",
        image_url: attachment.dataUrl,
        detail: "auto"
      });
      return;
    }

    if (attachment.kind === "pdf" || attachment.kind === "docx") {
      content.push({
        type: "input_file",
        filename: attachment.name,
        file_data: attachment.fileData
      });
      return;
    }

    content.push({
      type: "input_text",
      text: `下面是文件《${attachment.name}》的内容，请结合它和用户需求一起分析：\n${attachment.text}`
    });
  });

  if (content.length === 1 && content[0].type === "input_text") {
    return content[0].text;
  }

  return content;
}

function normalizeDraftPayload(payload) {
  const mode = payload?.mode === "ask" ? "ask" : "draft";
  const reply = typeof payload?.reply === "string" ? payload.reply.trim() : "";
  const draft = payload?.draft && typeof payload.draft === "object" ? payload.draft : null;

  if (mode === "ask") {
    return {
      mode,
      reply: reply || "我还想先确认一两个关键点，再帮你把计划拆稳。",
      draft: null
    };
  }

  const tasks = Array.isArray(draft?.tasks)
    ? draft.tasks.map((task) => String(task).trim()).filter(Boolean).slice(0, 7)
    : [];

  if (!tasks.length) {
    throw new Error("Model response missing actionable tasks.");
  }

  return {
    mode: "draft",
    reply: reply || "我先为你整理了一版可以直接推进的草案，你看看是否顺手。",
    draft: {
      title: String(draft?.title || "待整理目标").trim(),
      deadline: String(draft?.deadline || "待确认").trim(),
      rationale: String(draft?.rationale || "我先按能尽快开始执行的顺序做了拆解。").trim(),
      tasks
    }
  };
}

function normalizePlannerPayload(payload) {
  const mode = payload?.mode === "ask" ? "ask" : "draft";
  const reply = typeof payload?.reply === "string" ? payload.reply.trim() : "";
  const draft = payload?.draft && typeof payload.draft === "object" ? payload.draft : null;
  const questions = Array.isArray(payload?.questions)
    ? payload.questions.map((question) => String(question).trim()).filter(Boolean).slice(0, 5)
    : [];

  if (mode === "ask") {
    const combinedReply = questions.length
      ? `${reply || "为了给你更合适的计划，我先补几个关键问题："}\n\n${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}`
      : reply || "为了给你更合适的计划，我先补几个关键问题。";

    return {
      mode,
      reply: combinedReply,
      questions,
      draft: null
    };
  }

  const tasks = Array.isArray(draft?.tasks)
    ? draft.tasks.map((task) => String(task).trim()).filter(Boolean).slice(0, 7)
    : [];
  const tips = Array.isArray(draft?.tips)
    ? draft.tips.map((tip) => String(tip).trim()).filter(Boolean).slice(0, 3)
    : [];

  if (!tasks.length) {
    throw new Error("Model response missing actionable tasks.");
  }

  return {
    mode: "draft",
    reply: reply || "我先为你整理了一版可以直接推进的草案，你先看看顺不顺手。",
    questions: null,
    draft: {
      title: String(draft?.title || "待整理目标").trim(),
      deadline: String(draft?.deadline || "待确认").trim(),
      rationale: String(draft?.rationale || "我先按能尽快开始执行的顺序做了拆解。").trim(),
      tasks,
      tips: tips.length ? tips : ["先固定每天能投入的时间，再决定每项任务的粒度。"]
    }
  };
}

function extractLatestUserPrompt(body) {
  if (typeof body?.prompt === "string" && body.prompt.trim()) {
    return body.prompt.trim();
  }

  const history = Array.isArray(body?.history) ? body.history : [];
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const message = history[index];
    if (message?.role === "user" && typeof message.text === "string" && message.text.trim()) {
      return message.text.trim();
    }
  }

  return "";
}

function isGreetingOnly(text) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return /^(?:你好|您好|嗨|hi|hello|哈喽|在吗|有人吗|hello there)[!！。.?？~～ ]*$/u.test(normalized);
}

function buildGreetingPlannerResponse() {
  return {
    mode: "ask",
    reply: "我在。你直接告诉我你现在想完成什么，我会先判断信息够不够；如果不够，我先追问关键细节，再给你计划。",
    questions: [
      "你现在最想解决的是考试复习、课程作业、编程项目，还是长期提升？",
      "这件事最晚什么时候要推进到什么程度？",
      "你现在大概做到哪一步了？"
    ],
    draft: null,
    provider: "local-guard",
    model: "guided-greeting",
    usage: null
  };
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => String(text || "").includes(keyword));
}

function hasQuestionFragment(questions, fragments) {
  return questions.some((question) => fragments.some((fragment) => question.includes(fragment)));
}

function upsertPriorityQuestion(questions, question, coverageFragments) {
  if (hasQuestionFragment(questions, coverageFragments)) {
    return questions;
  }

  if (questions.length >= 5) {
    questions[questions.length - 1] = question;
    return questions;
  }

  questions.push(question);
  return questions;
}

function enforceAskQuestionCoverage(result, body) {
  if (result?.mode !== "ask") {
    return result;
  }

  const prompt = extractLatestUserPrompt(body);
  if (/(?:\u82f1\u8bed|\u56db\u7ea7|\u516d\u7ea7|\u96c5\u601d|\u6258\u798f)/u.test(prompt) && /(?:\u8003\u8bd5|\u590d\u4e60|\u5907\u8003)/u.test(prompt)) {
    const questions = [
      "这次英语考试具体是哪一种？比如四级、六级、雅思、托福，或者学校自己的课程考试。",
      "你的考试时间或目标出分时间是什么时候？",
      "你现在最薄弱的是哪个模块？比如听力、阅读、写作、翻译，还是词汇和语法。",
      "你目前的基础大概在哪个水平？比如最近一次分数、做题正确率，或者你自己的主观判断。",
      "你接下来每天或每周大概能拿出多少时间复习？更适合整块专注，还是碎片时间推进。"
    ];

    return {
      ...result,
      questions,
      reply: `我先把你的英语备考情况摸清，再给你出更贴合的计划。\n\n${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}`
    };
  }

  const questions = Array.isArray(result.questions) ? [...result.questions] : [];

  if (hasAny(prompt.toLowerCase(), ["demo", "app", "pwa", "网页", "网站", "比赛", "项目"])) {
    upsertPriorityQuestion(
      questions,
      "这次最终要交付什么？是可运行页面、演示原型、答辩 PPT，还是项目说明文档。",
      ["交付", "演示", "答辩", "PPT", "原型", "成果"]
    );
  }

  if (!questions.length) {
    return result;
  }

  return {
    ...result,
    questions,
    reply: `${result.reply.split("\n\n")[0]}\n\n${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}`
  };
}

function buildMessages({ history, prompt, refine, currentDraft, attachments }) {
  const messages = [];
  const normalizedHistory = normalizeHistory(history).slice(-MAX_HISTORY_MESSAGES);
  const normalizedAttachments = normalizeAttachments(attachments);

  if (refine && currentDraft) {
    messages.push({
      role: "developer",
      content: [
        "当前用户已经有一版草案，请在不改变目标方向的前提下，把计划进一步细化。",
        "你可以重写标题、截止时间、拆解理由和任务列表，但任务仍然必须适合直接进入看板。",
        `当前草案：${JSON.stringify(currentDraft)}`
      ].join("\n")
    });
  }

  messages.push(...normalizedHistory);

  if (prompt && (!normalizedHistory.length || normalizedHistory[normalizedHistory.length - 1].content !== prompt.trim())) {
    messages.push({ role: "user", content: buildMessageContent(prompt.trim(), normalizedAttachments) });
  } else if (!prompt && normalizedAttachments.length) {
    messages.push({
      role: "user",
      content: buildMessageContent("", normalizedAttachments)
    });
  }

  if (refine && !prompt) {
    messages.push({
      role: "user",
      content: "请把当前这版草案再细化一层，尽量拆到可以直接执行和插入看板的粒度。"
    });
  }

  return messages;
}

function readWindowsUserEnv(name) {
  if (process.platform !== "win32") {
    return "";
  }

  try {
    return execFileSync("powershell", [
      "-NoProfile",
      "-Command",
      `[System.Environment]::GetEnvironmentVariable('${name}','User')`
    ], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch (error) {
    return "";
  }
}

function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY || readWindowsUserEnv("OPENAI_API_KEY");
  const baseUrl = process.env.OPENAI_BASE_URL || readWindowsUserEnv("OPENAI_BASE_URL") || DEFAULT_OPENAI_BASE_URL;
  const model = process.env.OPENAI_MODEL || readWindowsUserEnv("OPENAI_MODEL") || DEFAULT_OPENAI_MODEL;

  return {
    apiKey,
    apiKeyConfigured: Boolean(apiKey),
    baseUrl,
    model
  };
}

function extractOpenAIOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const outputItems = Array.isArray(payload?.output) ? payload.output : [];
  const textParts = [];

  outputItems.forEach((item) => {
    if (item?.type !== "message" || !Array.isArray(item.content)) {
      return;
    }

    item.content.forEach((contentItem) => {
      if (contentItem?.type === "output_text" && typeof contentItem.text === "string") {
        textParts.push(contentItem.text);
      }
    });
  });

  return textParts.join("\n").trim();
}

function tryParseBalancedJsonFragment(content, startIndex) {
  const opening = content[startIndex];
  const closing = opening === "{" ? "}" : opening === "[" ? "]" : "";
  if (!closing) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < content.length; index += 1) {
    const char = content[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === opening) {
      depth += 1;
      continue;
    }

    if (char === closing) {
      depth -= 1;
      if (depth === 0) {
        const fragment = content.slice(startIndex, index + 1);
        return JSON.parse(fragment);
      }
    }
  }

  return null;
}

function parseModelJson(content) {
  const trimmed = String(content || "").trim();
  if (!trimmed) {
    throw new Error("Model response did not contain JSON.");
  }

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const codeFenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/iu);
    if (codeFenceMatch?.[1]) {
      try {
        return JSON.parse(codeFenceMatch[1].trim());
      } catch (nestedError) {
        // Fall through to balanced-fragment extraction below.
      }
    }

    for (let index = 0; index < trimmed.length; index += 1) {
      const char = trimmed[index];
      if (char !== "{" && char !== "[") {
        continue;
      }

      try {
        const parsed = tryParseBalancedJsonFragment(trimmed, index);
        if (parsed !== null) {
          return parsed;
        }
      } catch (nestedError) {
        // Keep scanning in case the first JSON-looking fragment is invalid.
      }
    }

    throw error;
  }
}

function safeParseJsonText(content) {
  const trimmed = String(content || "").trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    return null;
  }
}

async function readResponsePayload(response) {
  const rawText = await response.text();
  return {
    payload: safeParseJsonText(rawText) || {},
    rawText,
    contentType: String(response.headers.get("content-type") || "")
  };
}

function summarizeRawUpstreamText(rawText) {
  const compact = String(rawText || "").replace(/\s+/gu, " ").trim();
  return compact ? compact.slice(0, 180) : "";
}

function buildUpstreamErrorMessage(response, payload, rawText) {
  const explicitMessage = String(payload?.error?.message || payload?.message || "").trim();
  if (explicitMessage) {
    return explicitMessage;
  }

  const summary = summarizeRawUpstreamText(rawText);
  if (summary) {
    return `Upstream returned non-JSON or incompatible content (HTTP ${response.status}): ${summary}`;
  }

  return `OpenAI-compatible API request failed with status ${response.status}.`;
}

function buildPlannerFallbackNotice(error) {
  const message = error instanceof Error ? error.message : "";
  if (/invalid character|non-json|incompatible content|unexpected token|json/iu.test(message)) {
    return "真实模型连接暂时异常，我先用本地规则继续，避免流程中断。";
  }

  return "真实模型暂时不可用，我先用本地规则继续，避免流程中断。";
}

function maskSecret(secret) {
  const value = String(secret || "").trim();
  if (!value) {
    return "";
  }

  if (value.length <= 10) {
    return `${value.slice(0, 2)}***${value.slice(-2)}`;
  }

  return `${value.slice(0, 6)}***${value.slice(-4)}`;
}

function buildPlannerConversationText(body) {
  const history = Array.isArray(body?.history) ? body.history : [];
  const historyText = history
    .filter((message) => message?.role === "user")
    .map((message) => String(message?.text || ""))
    .filter(Boolean)
    .join("\n");
  const prompt = extractLatestUserPrompt(body);
  return `${historyText}\n${prompt}`.trim();
}

function countCategoryMatches(text, patterns) {
  return patterns.reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}

function detectPlannerCategory(text) {
  const normalized = String(text || "").toLowerCase();
  const explicitProgrammingProject =
    /(?:c\+\+|cpp|python|java|javascript|typescript|qt|mfc|stl|代码|程序|软件|开发|实现|编程|游戏)/u.test(normalized)
    && /(?:项目|工程|程序|软件|游戏|功能|模块|开发|实现|完成)/u.test(normalized);

  if (explicitProgrammingProject) {
    return "project";
  }

  const explicitExamSignal = /(?:四级|六级|雅思|托福|cet|考研|期末|模考|月考|周考|备考|复习|冲刺|考试|考)/u.test(normalized);
  const explicitExamSubject = /(?:英语|数学|高数|线代|线性代数|概率|概率论|政治|行测|申论|专业课|物理|化学)/u.test(normalized);
  if (explicitExamSignal && explicitExamSubject) {
    return "exam";
  }

  const scores = {
    exam: countCategoryMatches(normalized, [
      /(?:\u8003\u8bd5|\u590d\u4e60|\u5907\u8003|\u671f\u672b|\u56db\u7ea7|\u516d\u7ea7|\u96c5\u601d|\u6258\u798f|cet|\u8003)/u,
      /(?:\u82f1\u8bed|\u6570\u5b66|\u9ad8\u6570|\u7ebf\u4ee3|\u7ebf\u6027\u4ee3\u6570|\u6982\u7387|\u6982\u7387\u8bba)/u
    ]),
    project: countCategoryMatches(normalized, [
      /(?:项目|工程|程序|软件|游戏)/u,
      /(?:c\+\+|cpp|python|java|javascript|typescript|qt|mfc|stl|代码|开发|实现|编程)/u,
      /(?:功能|模块|界面|窗口|类|对象|碰撞|地图|关卡|演示)/u
    ]),
    demo: countCategoryMatches(normalized, [
      /(?:demo|app|pwa)/u,
      /(?:\u7f51\u9875|\u7f51\u7ad9|\u539f\u578b|\u7b54\u8fa9)/u,
      /(?:\u6bd4\u8d5b|\u9879\u76ee)/u
    ]),
    coursework: countCategoryMatches(normalized, [
      /(?:\u4f5c\u4e1a|\u8bfe\u7a0b)/u,
      /(?:\u8bba\u6587|\u62a5\u544a|\u5b9e\u9a8c\u62a5\u544a)/u,
      /(?:ppt|pre|\u6c47\u62a5|\u8bc4\u5206\u6807\u51c6|\u9898\u76ee)/u
    ]),
    longterm: countCategoryMatches(normalized, [
      /(?:\u957f\u671f|\u8fd9\u5b66\u671f|\u8fd9\u4e2a\u5b66\u671f)/u,
      /(?:\u4e60\u60ef|\u517b\u6210|\u575a\u6301)/u,
      /(?:\u76ee\u6807|\u8ba1\u5212|\u63d0\u5347)/u,
      /(?:\u6bcf\u5929|\u5b66\u4e60)/u
    ])
  };

  const ranked = Object.entries(scores).sort((left, right) => right[1] - left[1]);
  return ranked[0][1] > 0 ? ranked[0][0] : "general";
}

function detectExamSubject(text) {
  const normalized = String(text || "");
  if (/(?:\u82f1\u8bed|\u56db\u7ea7|\u516d\u7ea7|\u96c5\u601d|\u6258\u798f)/u.test(normalized)) {
    return "english";
  }
  if (/(?:\u6570\u5b66|\u9ad8\u6570|\u7ebf\u6027\u4ee3\u6570|\u7ebf\u4ee3|\u6982\u7387|\u6982\u7387\u8bba)/u.test(normalized)) {
    return "math";
  }
  return "general";
}

function detectLearningDomain(text) {
  const normalized = String(text || "").toLowerCase();
  if (/(?:\u82f1\u8bed|\u56db\u7ea7|\u516d\u7ea7|\u96c5\u601d|\u6258\u798f)/u.test(normalized)) {
    return "english";
  }
  if (/(?:\u7f16\u7a0b|coding|code|javascript|typescript|python|java|c\+\+|c#|react|node|sql|\u524d\u7aef|\u540e\u7aef|\u7b97\u6cd5)/u.test(normalized)) {
    return "programming";
  }
  if (/(?:\u6570\u5b66|\u9ad8\u6570|\u7ebf\u4ee3|\u7ebf\u6027\u4ee3\u6570|\u6982\u7387|\u6982\u7387\u8bba)/u.test(normalized)) {
    return "math";
  }
  return "general";
}

function detectProjectDomain(text) {
  const normalized = String(text || "").toLowerCase();
  const programmingSignal = /(?:c\+\+|cpp|python|java|javascript|typescript|qt|mfc|stl|代码|程序|软件|开发|实现|编程|类|对象|函数|模块)/u.test(normalized);
  const gameSignal = /(?:游戏|植物大战僵尸|贪吃蛇|俄罗斯方块|塔防|僵尸|植物|关卡|碰撞|地图)/u.test(normalized);

  if (programmingSignal && gameSignal) {
    return "game";
  }

  if (programmingSignal) {
    return "programming";
  }

  return "general";
}

function hasExplicitTimeBudget(text) {
  const normalized = String(text || "");
  return /(?:(?:\d+|[\u4e00\u4e8c\u4e24\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u534a\u51e0])\s*(?:\u4e2a)?(?:\u5c0f\u65f6|\u5206\u949f|\u5206|\u6b21|h\b|hour|hours|min|mins|minute|minutes)|\u534a\u5c0f\u65f6|\u534a\u5929|\u4e00\u5c0f\u65f6|\u4e24\u5c0f\u65f6|\u4e00\u6574\u665a|\u6bcf\u5468\s*(?:\d+|[\u4e00\u4e8c\u4e24\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341])\s*\u6b21)/iu.test(normalized);
}

function hasPreferredStudySlot(text) {
  const normalized = String(text || "");
  return /(?:\u65e9\u4e0a|\u4e0a\u5348|\u4e2d\u5348|\u4e0b\u5348|\u508d\u665a|\u665a\u4e0a|\u7761\u524d|\u5348\u4f11|\u5468\u672b|\u901a\u52e4).{0,10}(?:\u5b66|\u590d\u4e60|\u80cc|\u505a|\u7ec3|\u5b89\u6392|\u5f00\u59cb|\u63a8\u8fdb|\u6295\u5165|\u7a7a\u51fa|\u56fa\u5b9a|\u9002\u5408|\u6548\u7387)/u.test(normalized)
    || /(?:\u56fa\u5b9a|\u901a\u5e38|\u4e00\u822c|\u4e60\u60ef).{0,10}(?:\u65e9\u4e0a|\u4e0a\u5348|\u4e2d\u5348|\u4e0b\u5348|\u508d\u665a|\u665a\u4e0a|\u7761\u524d|\u5468\u672b)/u.test(normalized);
}

function hasMinimumAction(text) {
  const normalized = String(text || "");
  return /(?:\u4fdd\u5e95|\u6700\u4f4e|\u81f3\u5c11|\u54ea\u6015|\u5c31\u7b97).{0,12}(?:\d+|[\u4e00\u4e8c\u4e24\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u534a])\s*(?:\u4e2a)?(?:\u5206\u949f|\u5c0f\u65f6|\u9875|\u7bc7|\u9053|\u7ec4|\u8f6e|\u4e2a|\u5355\u8bcd)/u.test(normalized);
}

function hasRelativeDeadlinePhrase(text) {
  const normalized = String(text || "");
  return /(?:(?:\d+|[\u4e00\u4e8c\u4e24\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u534a\u51e0])\s*(?:\u5929|\u5468|\u4e2a?\u6708)|\u4eca\u5929|\u660e\u5929|\u540e\u5929|\u8fd9\u5468|\u4e0b\u5468(?:[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u65e5\u5929])?|\u672c\u5468|\u8fd9\u4e2a\u6708|\u4e0b\u4e2a?\u6708|\u6708\u5e95|\u671f\u672b|\u4e4b\u524d)/u.test(normalized);
}

function parseChineseNumberToken(token) {
  const normalized = String(token || "").trim();
  if (!normalized) {
    return null;
  }

  if (/^\d+$/u.test(normalized)) {
    return Number(normalized);
  }

  const map = {
    "一": 1,
    "二": 2,
    "两": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 7,
    "八": 8,
    "九": 9,
    "十": 10
  };

  if (normalized === "半") {
    return 0.5;
  }

  if (normalized === "几") {
    return 3;
  }

  if (map[normalized]) {
    return map[normalized];
  }

  if (normalized.length === 2 && normalized.startsWith("十") && map[normalized[1]]) {
    return 10 + map[normalized[1]];
  }

  if (normalized.length === 2 && normalized.endsWith("十") && map[normalized[0]]) {
    return map[normalized[0]] * 10;
  }

  if (normalized.length === 3 && normalized[1] === "十" && map[normalized[0]] && map[normalized[2]]) {
    return map[normalized[0]] * 10 + map[normalized[2]];
  }

  return null;
}

function formatDateLabel(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inferRelativeDeadline(text) {
  const normalized = String(text || "");
  const now = new Date();
  const target = new Date(now);
  const weekdayMap = {
    "\u4e00": 1,
    "\u4e8c": 2,
    "\u4e09": 3,
    "\u56db": 4,
    "\u4e94": 5,
    "\u516d": 6,
    "\u65e5": 0,
    "\u5929": 0
  };

  if (/\u4eca\u5929/u.test(normalized)) {
    return formatDateLabel(target);
  }

  if (/\u660e\u5929/u.test(normalized)) {
    target.setDate(target.getDate() + 1);
    return formatDateLabel(target);
  }

  const dayMatch = normalized.match(/(\d+)\s*\u5929(?:\u540e|\u5185)?/u);
  if (dayMatch) {
    target.setDate(target.getDate() + Number(dayMatch[1]));
    return formatDateLabel(target);
  }

  const weekMatch = normalized.match(/(\d+)\s*\u5468(?:\u540e|\u5185)?/u);
  if (weekMatch) {
    target.setDate(target.getDate() + Number(weekMatch[1]) * 7);
    return formatDateLabel(target);
  }

  const chineseDayMatch = normalized.match(/([\u4e00\u4e8c\u4e24\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u534a\u51e0]+)\s*\u5929(?:\u540e|\u5185)?/u);
  if (chineseDayMatch) {
    const days = parseChineseNumberToken(chineseDayMatch[1]);
    if (typeof days === "number") {
      target.setDate(target.getDate() + Math.max(1, Math.round(days)));
      return formatDateLabel(target);
    }
  }

  const chineseWeekMatch = normalized.match(/([\u4e00\u4e8c\u4e24\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u534a\u51e0]+)\s*\u5468(?:\u540e|\u5185)?/u);
  if (chineseWeekMatch) {
    const weeks = parseChineseNumberToken(chineseWeekMatch[1]);
    if (typeof weeks === "number") {
      target.setDate(target.getDate() + Math.max(1, Math.round(weeks * 7)));
      return formatDateLabel(target);
    }
  }

  const nextWeekdayMatch = normalized.match(/\u4e0b\u5468([一二三四五六日天])/u);
  if (nextWeekdayMatch) {
    const currentWeekday = now.getDay();
    const targetWeekday = weekdayMap[nextWeekdayMatch[1]];
    const offset = ((targetWeekday - currentWeekday + 7) % 7) + 7;
    target.setDate(target.getDate() + offset);
    return formatDateLabel(target);
  }

  const weekdayMatch = normalized.match(/(?:\u5468|\u661f\u671f)([一二三四五六日天])/u);
  if (weekdayMatch) {
    const currentWeekday = now.getDay();
    const targetWeekday = weekdayMap[weekdayMatch[1]];
    let offset = (targetWeekday - currentWeekday + 7) % 7;
    if (offset === 0) {
      offset = 7;
    }
    target.setDate(target.getDate() + offset);
    return formatDateLabel(target);
  }

  if (/\u4e0b\u4e2a?\u6708/u.test(normalized)) {
    return "\u4e0b\u4e2a\u6708";
  }

  if (/\u4e0b\u5468/u.test(normalized)) {
    return "\u4e0b\u5468";
  }

  if (/\u671f\u672b/u.test(normalized)) {
    return "\u671f\u672b\u524d";
  }

  return "\u5f85\u786e\u8ba4";
}

function getSpacedReviewTask() {
  return "安排间隔回看节点，按“当天整理 -> 1天后回忆 -> 3天后回忆 -> 7天后回看”的节奏复盘重点内容。";
}

function getActiveRecallTask() {
  return "把薄弱点改成主动回忆练习，先合上资料口述、默写或复述，再对照答案修正。";
}

function getInterleavingTask() {
  return "把两到三类题型或知识点交错练习，并把错误原因归到同一份清单里。";
}

function getWrongQuestionReviewTask() {
  return "把错题按“概念不清 / 审题偏差 / 计算或表达失误”分类，优先回补会反复出现的错误。";
}

function getTimedMockTask() {
  return "按正式考试时间做一次限时模考或整卷训练，再根据结果调整答题顺序和时间分配。";
}

function getCheckinReviewTask() {
  return "保留每日打卡和每周短复盘，记录完成度、掉链子原因和下周只改的一件事。";
}

function getHabitCueTask() {
  return "固定一个稳定触发器和最小动作，例如晚饭后先学 10 分钟，用最小起步动作保证不断线。";
}

function getIfThenTask() {
  return "提前写好“如果……就……”应对方案，例如如果想刷短视频，就先把手机放远并完成 10 分钟保底任务。";
}

function getLongtermPracticeTask(domain) {
  if (domain === "english") {
    return "围绕最弱模块做小剂量高频练习，把单词、句型和题感放进同一轮学习节奏里。";
  }

  if (domain === "programming") {
    return "围绕最想补的模块做小输出，例如一题、一段功能或一个微项目，避免只看不写。";
  }

  if (domain === "math") {
    return "围绕最不稳的章节做例题复盘和变式练习，把公式、判断条件和易错点放在一起回看。";
  }

  return "围绕当前最想先突破的一块安排稳定练习，并把关键输出留痕到同一份记录里便于复盘。";
}

function getMaxQuestionCount(category) {
  if (category === "exam" || category === "longterm" || category === "demo" || category === "project") {
    return 5;
  }

  return 4;
}

function extractPlannerSignals(text) {
  const normalized = String(text || "");
  return {
    deliverableKnown: /(?:\u4ea4\u4ed8|\u63d0\u4ea4|\u7f51\u9875|\u7f51\u7ad9|\u9875\u9762|\u539f\u578b|PPT|ppt|\u7b54\u8fa9|\u62a5\u544a|\u8bba\u6587|\u4ee3\u7801|demo|Demo|\u6210\u679c|\u5206\u6570|\u901a\u8fc7|\u575a\u6301|\u4e60\u60ef|\d+\s*\u5929)/u.test(normalized),
    specificDeliverableKnown: /(?:\u7f51\u9875|\u7f51\u7ad9|\u9875\u9762|\u539f\u578b|PPT|ppt|\u7b54\u8fa9|\u62a5\u544a|\u8bba\u6587|\u4ee3\u7801|\u8bf4\u660e\u6587\u6863|\u6f14\u793a)/u.test(normalized),
    deadlineKnown: /(?:\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}日?|(?:\d+)\s*(?:天|周|个月|月)|今天|明天|后天|这周|下周(?:[一二三四五六日天])?|(?:周|星期)[一二三四五六日天]|本月|这个月|期末|月底|暑假前|开学前|之前|前)/u.test(normalized) || hasRelativeDeadlinePhrase(normalized),
    progressKnown: /(?:\u521a\u5f00\u59cb|\u8fd8\u6ca1\u5f00\u59cb|\u505a\u5230|\u505a\u5b8c|\u5b8c\u6210\u4e86|\u5df2\u7ecf|\u4e00\u534a|\u521d\u7a3f|\u8349\u56fe|\u63d0\u7eb2|\u7b14\u8bb0|\u8d44\u6599|\u57fa\u7840|\u6c34\u5e73|\u8fdb\u5ea6|\u6b63\u786e\u7387|\u6a21\u62df|\d+\s*\u5206|\u4e09\u5929\u6253\u9c7c|\u65ad\u65ad\u7eed\u7eed|\u575a\u6301)/u.test(normalized),
    timeBudgetKnown: hasExplicitTimeBudget(normalized),
    studySlotKnown: hasPreferredStudySlot(normalized),
    minimumActionKnown: hasMinimumAction(normalized),
    goalKnown: /(?:\u76ee\u6807|\u53ca\u683c|\u8fc7\u7ebf|\u4fdd\u8fc7|\u51b2|\d+\s*\u5206)/u.test(normalized),
    constraintsKnown: /(?:\u9650\u5236|\u6253\u65ad|\u4e13\u6ce8|\u4f5c\u606f|\u8bfe\u591a|\u8bfe\u7a0b\u591a|\u767d\u5929\u8bfe\u591a|\u793e\u56e2|\u5b9e\u4e60|\u961f\u53cb|\u8bbe\u5907|\u6548\u7387|\u788e\u7247|\u77ed\u89c6\u9891|\u53ea\u80fd|\u6ca1\u6cd5|\u4e0d\u65b9\u4fbf|\u5361\u70b9)/u.test(normalized),
    weakAreaKnown: /(?:\u542c\u529b|\u9605\u8bfb|\u5199\u4f5c|\u7ffb\u8bd1|\u53e3\u8bed|\u8bcd\u6c47|\u8bed\u6cd5|\u8584\u5f31|\u5f31\u9879|\u6a21\u5757|\u51fd\u6570|\u6781\u9650|\u5bfc\u6570|\u79ef\u5206|\u7ebf\u4ee3|\u7ebf\u6027\u4ee3\u6570|\u6982\u7387|\u8bc1\u660e\u9898|\u8ba1\u7b97\u9898)/u.test(normalized),
    examTypeKnown: /(?:\u56db\u7ea7|\u516d\u7ea7|\u96c5\u601d|\u6258\u798f|\u8003\u7814|\u653f\u6cbb|\u884c\u6d4b|\u7533\u8bba|\u4e13\u4e1a\u8bfe|\u8bfe\u7a0b\u8003\u8bd5|\u671f\u672b\u8003\u8bd5|\u82f1\u8bed\u8003\u8bd5|\u6570\u5b66|\u9ad8\u6570|\u7ebf\u4ee3|\u7ebf\u6027\u4ee3\u6570|\u6982\u7387|\u7269\u7406|\u5316\u5b66)/u.test(normalized),
    materialKnown: /(?:\u8981\u6c42|\u9898\u76ee|\u6750\u6599|\u8bfe\u7a0b\u5927\u7eb2|\u8bc4\u5206\u6807\u51c6|\u8001\u5e08\u8981\u6c42|\u53c2\u8003\u8d44\u6599|\u9898\u5e93)/u.test(normalized),
    teamKnown: /(?:\u961f\u53cb|\u5206\u5de5|\u5408\u4f5c|\u7ec4\u5458|\u4e00\u4e2a\u4eba\u505a|\u81ea\u5df1\u505a|\u5355\u72ec\u505a|\u72ec\u81ea\u505a)/u.test(normalized),
    projectKnown: /(?:\u9879\u76ee|\u5de5\u7a0b|\u7a0b\u5e8f|\u8f6f\u4ef6|\u4ee3\u7801|\u5f00\u53d1|\u5b9e\u73b0|\u6e38\u620f|c\+\+|cpp|python|java|qt|mfc|stl)/u.test(normalized),
    projectScopeKnown: /(?:\u529f\u80fd|\u6a21\u5757|\u9a8c\u6536|\u6838\u5fc3\u73a9\u6cd5|\u7a97\u53e3|\u754c\u9762|\u8d44\u6e90\u52a0\u8f7d|\u5730\u56fe|\u5173\u5361|\u78b0\u649e|\u690d\u7269|\u50f5\u5c38|\u653e\u7f6e|\u653b\u51fb|\u51b7\u5374|\u751f\u6210)/u.test(normalized)
  };
}

function shouldUseGuidedQuestioning(category, signals) {
  if (category === "exam") {
    return !(signals.examTypeKnown && signals.deadlineKnown && signals.weakAreaKnown && signals.progressKnown && signals.timeBudgetKnown);
  }

  if (category === "project") {
    return !(signals.projectKnown && signals.deadlineKnown && signals.progressKnown && signals.timeBudgetKnown && signals.projectScopeKnown);
  }

  if (category === "demo") {
    return !(signals.deliverableKnown && signals.deadlineKnown && signals.progressKnown && signals.timeBudgetKnown && signals.constraintsKnown);
  }

  if (category === "coursework") {
    return !(signals.deliverableKnown && signals.deadlineKnown && signals.progressKnown && signals.materialKnown && signals.timeBudgetKnown);
  }

  if (category === "longterm") {
    return !(signals.deliverableKnown && signals.progressKnown && signals.timeBudgetKnown && signals.constraintsKnown && signals.studySlotKnown);
  }

  return !(signals.deliverableKnown && signals.deadlineKnown && signals.progressKnown && signals.timeBudgetKnown);
}

function buildGuidedQuestions(category, signals, conversationText) {
  const maxQuestions = getMaxQuestionCount(category);
  const questions = [];
  const push = (question) => {
    if (questions.length < maxQuestions) {
      questions.push(question);
    }
  };

  if (category === "exam") {
    const subject = detectExamSubject(conversationText);
    if (!signals.examTypeKnown) {
      push("这次具体考哪一门或哪一类？比如英语四级、高数期末、线代期中，或者学校课程考试。");
    }
    if (!signals.deadlineKnown) {
      push("你的考试时间或目标出分时间是什么时候？");
    }
    if (!signals.weakAreaKnown && subject === "english") {
      push("你现在最薄弱的是哪个模块？比如听力、阅读、写作、翻译，还是词汇和语法。");
    }
    if (!signals.weakAreaKnown && subject === "math") {
      push("你现在最不稳的是哪几块？比如函数、极限、导数、积分、线代、概率，或者证明题和计算题。");
    }
    if (!signals.weakAreaKnown && subject === "general") {
      push("你现在最薄弱的是哪一部分？可以直接说章节、题型，或者最容易失分的模块。");
    }
    if (!signals.progressKnown && questions.length < maxQuestions) {
      push("你目前的基础大概在哪个水平？比如最近一次分数、做题正确率，或者你自己的主观判断。");
    }
    if (!signals.timeBudgetKnown && questions.length < maxQuestions) {
      push("你接下来每天或每周大概能拿出多少时间复习？更适合整块专注，还是碎片时间推进。");
    }
    return questions;
  }

  if (category === "project") {
    const domain = detectProjectDomain(conversationText);
    if (!signals.projectScopeKnown) {
      push(domain === "game"
        ? "这次你准备先做成什么最小可玩版本？比如先只做放置植物、僵尸前进、攻击判定和胜负条件这一条主链。"
        : "这次项目最晚要做出什么最小可运行结果？可以直接说核心功能清单，不要只说“完成项目”。");
    }
    if (!signals.deadlineKnown) {
      push("最终截止时间是什么时候？如果你说的一周是总时长，也告诉我从哪天开始算。");
    }
    if (!signals.progressKnown) {
      push(domain === "game"
        ? "你现在做到哪一步了？比如只有想法、刚建工程、能开窗口、已有人物/地图，还是已经接上一部分玩法。"
        : "你现在做到哪一步了？比如刚建工程、类和模块刚起好、能跑通一部分功能，还是还停留在设计阶段。");
    }
    if (!signals.timeBudgetKnown) {
      push("这一周里你每天大概能稳定投入多少时间？是晚上整块时间，还是只能碎片推进。");
    }
    if (!signals.constraintsKnown) {
      push("你现在最大的卡点是什么？比如面向对象设计、图形界面、资源加载、碰撞逻辑、调试，还是时间不够。");
    }
    if (!signals.teamKnown && questions.length < maxQuestions) {
      push("这是你一个人做，还是有同学分工？如果是你自己做，你最想优先保住哪部分功能。");
    }
    return questions;
  }

  if (category === "project") {
    const domain = detectProjectDomain(conversationText);
    if (!signals.projectScopeKnown) {
      push(domain === "game"
        ? "这次你准备先做成什么最小可玩版本？比如先只做放置植物、僵尸前进、攻击判定和胜负条件这一条主链。"
        : "这次项目最晚要做出什么最小可运行结果？可以直接说核心功能清单，不要只说“完成项目”。");
    }
    if (!signals.deadlineKnown) {
      push("最终截止时间是什么时候？如果你说的一周是总时长，也告诉我从哪天开始算。");
    }
    if (!signals.progressKnown) {
      push(domain === "game"
        ? "你现在做到哪一步了？比如只有想法、刚建工程、能开窗口、已有人物/地图，还是已经接上一部分玩法。"
        : "你现在做到哪一步了？比如刚建工程、类和模块刚起好、能跑通一部分功能，还是还停留在设计阶段。");
    }
    if (!signals.timeBudgetKnown) {
      push("这一周里你每天大概能稳定投入多少时间？是晚上整块时间，还是只能碎片推进。");
    }
    if (!signals.constraintsKnown) {
      push("你现在最大的卡点是什么？比如面向对象设计、图形界面、资源加载、碰撞逻辑、调试，还是时间不够。");
    }
    if (!signals.teamKnown && questions.length < maxQuestions) {
      push("这是你一个人做，还是有同学分工？如果是你自己做，你最想优先保住哪部分功能。");
    }
    return questions;
  }

  if (category === "project") {
    const domain = detectProjectDomain(conversationText);
    if (!signals.projectScopeKnown) {
      push(domain === "game"
        ? "这次你准备先做成什么最小可玩版本？比如先只做放置植物、僵尸前进、攻击判定和胜负条件这一条主链。"
        : "这次项目最晚要做出什么最小可运行结果？可以直接说核心功能清单，不要只说“完成项目”。");
    }
    if (!signals.deadlineKnown) {
      push("最终截止时间是什么时候？如果你说的一周是总时长，也告诉我从哪天开始算。");
    }
    if (!signals.progressKnown) {
      push(domain === "game"
        ? "你现在做到哪一步了？比如只有想法、刚建工程、能开窗口、已有人物/地图，还是已经接上一部分玩法。"
        : "你现在做到哪一步了？比如刚建工程、类和模块刚起好、能跑通一部分功能，还是还停留在设计阶段。");
    }
    if (!signals.timeBudgetKnown) {
      push("这一周里你每天大概能稳定投入多少时间？是晚上整块时间，还是只能碎片推进。");
    }
    if (!signals.constraintsKnown) {
      push("你现在最大的卡点是什么？比如面向对象设计、图形界面、资源加载、碰撞逻辑、调试，还是时间不够。");
    }
    if (!signals.teamKnown && questions.length < maxQuestions) {
      push("这是你一个人做，还是有同学分工？如果是你自己做，你最想优先保住哪部分功能。");
    }
    return questions;
  }

  if (category === "demo") {
    if (!signals.specificDeliverableKnown) {
      push("这次最终要交付什么？是可运行页面、演示原型、答辩 PPT，还是项目说明文档。");
    }
    if (!signals.progressKnown) {
      push("你现在做到哪一步了？比如已有草图、部分前端、数据流程，还是只是想法阶段。");
    }
    if (!signals.timeBudgetKnown) {
      push("从现在到截止前，你每天或每周大概能稳定投入多少时间？");
    }
    if (!signals.teamKnown && questions.length < maxQuestions) {
      push("这是你一个人推进，还是有队友分工？如果有分工，你主要负责哪一块。");
    }
    if (!signals.constraintsKnown && questions.length < maxQuestions) {
      push("现在最大的限制是什么？比如课程多、时间碎、容易被打断，还是技术上有卡点。");
    }
    return questions;
  }

  if (category === "coursework") {
    if (!signals.deliverableKnown) {
      push("这次要交付什么？比如论文、报告、PPT、代码，或者课堂展示。");
    }
    if (!signals.deadlineKnown) {
      push("老师给的截止时间或汇报时间是什么时候？");
    }
    if (!signals.materialKnown) {
      push("老师的要求、评分标准或题目材料你现在手里有了吗？缺哪一部分。");
    }
    if (!signals.progressKnown && questions.length < maxQuestions) {
      push("你现在做到哪一步了？比如刚开始、已列提纲、查过资料，还是已经有初稿。");
    }
    if (!signals.timeBudgetKnown && questions.length < maxQuestions) {
      push("你接下来每天或每周大概能拿出多少时间推进这项作业？");
    }
    return questions;
  }

  if (category === "longterm") {
    if (!signals.deliverableKnown) {
      push("你希望先看到什么阶段性结果？比如一周内形成习惯、一个月完成首轮，还是先稳住某个指标。");
    }
    if (!signals.progressKnown) {
      push("你现在的状态大概怎样？已经开始过、断断续续推进，还是还没真正动起来。");
    }
    if (!signals.timeBudgetKnown) {
      push("你每天或每周大概能稳定拿出多少时间？比如每天 20 分钟、工作日晚上 1 小时，或周末 2 小时。");
    }
    if (!signals.studySlotKnown && questions.length < maxQuestions) {
      push("你最容易固定下来的学习时段是什么时候？比如早上、晚饭后、睡前，还是周末整块时间。");
    }
    if (!signals.constraintsKnown && questions.length < maxQuestions) {
      push("你现在最容易被什么打断？比如作息不稳、课程挤占、拖延，还是专注时间太短。");
    }
    if (!signals.minimumActionKnown && signals.timeBudgetKnown && questions.length < maxQuestions) {
      push("如果哪天状态差，你愿意保底完成什么最小动作？比如背 10 个单词、做 1 篇阅读，或听 10 分钟。");
    }
    return questions;
  }

  if (!signals.deliverableKnown) {
    push("这件事最后要做到什么程度才算完成？最好直接说一个看得见的结果。");
  }
  if (!signals.deadlineKnown) {
    push("这件事最晚什么时候要完成？如果没有精确日期，也可以告诉我是这周、这个月，还是本学期内。");
  }
  if (!signals.progressKnown) {
    push("你现在做到哪一步了？比如刚开始、已经收集资料、做了一半，还是已经有初稿/代码/笔记。");
  }
  if (!signals.timeBudgetKnown && questions.length < maxQuestions) {
    push("你接下来每天或每周大概能稳定投入多少时间？更适合整块专注，还是碎片时间推进。");
  }
  if (!signals.constraintsKnown && questions.length < maxQuestions) {
    push("有没有需要我一起考虑的限制？比如时间碎、资源少、容易分心，或者必须和别人配合。");
  }
  return questions;
}

function buildGuidedQuestionsV2(category, signals, conversationText) {
  if (category !== "longterm") {
    return buildGuidedQuestions(category, signals, conversationText);
  }

  const maxQuestions = getMaxQuestionCount(category);
  const questions = [];
  const push = (question) => {
    if (questions.length < maxQuestions) {
      questions.push(question);
    }
  };
  const domain = detectLearningDomain(conversationText);

  if (!signals.deliverableKnown) {
    push("你希望先看到什么阶段性结果？比如一周内形成习惯、一个月完成首轮，还是先稳住某个指标。");
  }
  if (!signals.progressKnown) {
    push("你现在的状态大概怎样？已经开始过、断断续续推进，还是还没真正动起来。");
  }
  if (!signals.weakAreaKnown && questions.length < maxQuestions && domain === "english") {
    push("如果这是长期学英语，你现在最弱的是哪一块？比如听力、阅读、写作、口语、词汇还是语法。");
  }
  if (!signals.weakAreaKnown && questions.length < maxQuestions && domain === "programming") {
    push("如果这是长期提编程，你现在最想先补哪一块？比如语法基础、算法、前端、后端、调试，还是项目实战。");
  }
  if (!signals.weakAreaKnown && questions.length < maxQuestions && domain === "math") {
    push("如果这是长期补数学，你现在最不稳的是哪一块？比如函数、极限、导数、积分、线代或概率。");
  }
  if (!signals.weakAreaKnown && questions.length < maxQuestions && domain === "general") {
    push("你最想先突破的是哪一块？可以直接说模块、题型，或者最容易卡住的环节。");
  }
  if (!signals.timeBudgetKnown && questions.length < maxQuestions) {
    push("你每天或每周大概能稳定拿出多少时间？比如每天 20 分钟、工作日晚上 1 小时，或周末 2 小时。");
  }
  if (!signals.studySlotKnown && questions.length < maxQuestions) {
    push("你最容易固定下来的学习时段是什么时候？比如早上、晚饭后、睡前，还是周末整块时间。");
  }
  if (!signals.constraintsKnown && questions.length < maxQuestions) {
    push("你现在最容易被什么打断？比如作息不稳、课程挤占、拖延，还是专注时间太短。");
  }
  if (!signals.minimumActionKnown && signals.timeBudgetKnown && questions.length < maxQuestions) {
    push("如果哪天状态差，你愿意保底完成什么最小动作？比如背 10 个词、做 1 题，或学 10 分钟。");
  }

  return questions;
}

function buildGuidedQuestionsV3(category, signals, conversationText) {
  const maxQuestions = getMaxQuestionCount(category);
  const questions = [];
  const push = (question) => {
    if (questions.length < maxQuestions) {
      questions.push(question);
    }
  };

  if (category === "exam") {
    const subject = detectExamSubject(conversationText);
    if (!signals.examTypeKnown) {
      push("这次具体考哪一门或哪一类？比如英语四级、考研政治、高数期末，或者学校课程考试。");
    }
    if (!signals.deadlineKnown) {
      push("你的考试时间是什么时候？如果只是下周或下个月，也尽量告诉我具体到周几。");
    }
    if (!signals.weakAreaKnown && subject === "english") {
      push("你现在最弱的是哪一块？比如听力、阅读、写作、翻译、词汇还是语法。");
    }
    if (!signals.weakAreaKnown && subject === "math") {
      push("你现在最不稳的是哪几块？比如函数、极限、导数、积分、线代、概率，或者证明题和计算题。");
    }
    if (!signals.weakAreaKnown && subject === "general") {
      push("你现在最薄弱的是哪一部分？可以直接说章节、题型，或者最容易失分的模块。");
    }
    if (!signals.progressKnown) {
      push("你目前的基础大概在哪个水平？比如最近一次分数、做题正确率，或者你自己的主观判断。");
    }
    if (!signals.timeBudgetKnown) {
      push("你接下来每天或每周大概能拿出多少时间复习？更适合整块专注，还是碎片时间推进。");
    }
    if (!signals.goalKnown) {
      push("你这次更想达到什么结果？比如先过线、冲更高分，还是把某个模块明显提上来。");
    }
    if (!signals.materialKnown) {
      push("你手里现在有真题、题库、老师划的范围或自己的错题本吗？缺哪一类资料。");
    }
    return questions;
  }

  if (category === "project") {
    const domain = detectProjectDomain(conversationText);
    if (!signals.projectScopeKnown) {
      push(domain === "game"
        ? "这次你准备先做成什么最小可玩版本？比如先只做放置植物、僵尸前进、攻击判定和胜负条件这一条主链。"
        : "这次项目最晚要做出什么最小可运行结果？可以直接说核心功能清单，不要只说“完成项目”。");
    }
    if (!signals.deadlineKnown) {
      push("最终截止时间是什么时候？如果你说的一周是总时长，也告诉我从哪天开始算。");
    }
    if (!signals.progressKnown) {
      push(domain === "game"
        ? "你现在做到哪一步了？比如只有想法、刚建工程、能开窗口、已有人物/地图，还是已经接上一部分玩法。"
        : "你现在做到哪一步了？比如刚建工程、类和模块刚起好、能跑通一部分功能，还是还停留在设计阶段。");
    }
    if (!signals.timeBudgetKnown) {
      push("这一周里你每天大概能稳定投入多少时间？是晚上整块时间，还是只能碎片推进。");
    }
    if (!signals.constraintsKnown) {
      push("你现在最大的卡点是什么？比如面向对象设计、图形界面、资源加载、碰撞逻辑、调试，还是时间不够。");
    }
    if (!signals.teamKnown && questions.length < maxQuestions) {
      push("这是你一个人做，还是有同学分工？如果是你自己做，你最想优先保住哪部分功能。");
    }
    return questions;
  }

  if (category === "demo") {
    if (!signals.specificDeliverableKnown) {
      push("这次最终要交付什么？是可运行页面、演示原型、答辩 PPT，还是项目说明文档。");
    }
    if (!signals.deadlineKnown) {
      push("最终截止时间是什么时候？如果你知道中间彩排或答辩时间，也一起告诉我。");
    }
    if (!signals.progressKnown) {
      push("你现在做到哪一步了？比如已有草图、部分前端、数据流程，还是只是想法阶段。");
    }
    if (!signals.timeBudgetKnown) {
      push("从现在到截止前，你每天或每周大概能稳定投入多少时间？");
    }
    if (!signals.teamKnown) {
      push("这是你一个人推进，还是有队友分工？如果有分工，你主要负责哪一块。");
    }
    if (!signals.constraintsKnown) {
      push("现在最大的限制是什么？比如课程多、时间碎、容易被打断，还是技术上有卡点。");
    }
    if (!signals.materialKnown) {
      push("这次评审最看重什么，或者你必须展示哪几个关键功能/亮点？");
    }
    return questions;
  }

  if (category === "coursework") {
    if (!signals.deliverableKnown) {
      push("这次要交什么？比如论文、报告、PPT、代码，或者课堂展示。");
    }
    if (!signals.deadlineKnown) {
      push("老师给的截止时间或汇报时间是什么时候？");
    }
    if (!signals.materialKnown) {
      push("老师的要求、评分标准、题目材料或字数格式要求，你现在手里有了吗？缺哪一部分。");
    }
    if (!signals.progressKnown) {
      push("你现在做到哪一步了？比如刚开始、已列提纲、查过资料，还是已经有初稿。");
    }
    if (!signals.timeBudgetKnown) {
      push("你接下来每天或每周大概能拿出多少时间推进这项作业？");
    }
    if (!signals.constraintsKnown) {
      push("你现在最容易卡在哪一环？比如选题、找资料、写正文、代码实现，还是格式和排版。");
    }
    return questions;
  }

  if (category === "longterm") {
    const domain = detectLearningDomain(conversationText);
    if (!signals.deliverableKnown) {
      push("你希望先看到什么阶段性结果？比如一周内形成习惯、一个月完成首轮，还是先稳住某个指标。");
    }
    if (!signals.progressKnown) {
      push("你现在的状态大概怎样？已经开始过、断断续续推进，还是还没真正动起来。");
    }
    if (!signals.weakAreaKnown && domain === "english") {
      push("如果这是长期学英语，你现在最弱的是哪一块？比如听力、阅读、写作、口语、词汇还是语法。");
    }
    if (!signals.weakAreaKnown && domain === "programming") {
      push("如果这是长期提编程，你现在最想先补哪一块？比如语法基础、算法、前端、后端、调试，还是项目实战。");
    }
    if (!signals.weakAreaKnown && domain === "math") {
      push("如果这是长期补数学，你现在最不稳的是哪一块？比如函数、极限、导数、积分、线代或概率。");
    }
    if (!signals.weakAreaKnown && domain === "general") {
      push("你最想先突破的是哪一块？可以直接说模块、题型，或者最容易卡住的环节。");
    }
    if (!signals.timeBudgetKnown) {
      push("你每天或每周大概能稳定拿出多少时间？比如每天 20 分钟、工作日晚上 1 小时，或周末 2 小时。");
    }
    if (!signals.studySlotKnown) {
      push("你最容易固定下来的学习时段是什么时候？比如早上、晚饭后、睡前，还是周末整块时间。");
    }
    if (!signals.constraintsKnown) {
      push("你现在最容易被什么打断？比如作息不稳、课程挤占、拖延，还是专注时间太短。");
    }
    if (!signals.minimumActionKnown && signals.timeBudgetKnown) {
      push("如果哪天状态差，你愿意保底完成什么最小动作？比如背 10 个词、做 1 题，或学 10 分钟。");
    }
    return questions;
  }

  if (!signals.deliverableKnown) {
    push("这件事最后要做到什么程度才算完成？最好直接说一个看得见的结果。");
  }
  if (!signals.deadlineKnown) {
    push("这件事最晚什么时候要完成？如果没有精确日期，也可以告诉我是这周、这个月，还是本学期内。");
  }
  if (!signals.progressKnown) {
    push("你现在做到哪一步了？比如刚开始、已经收集资料、做了一半，还是已经有初稿/代码/笔记。");
  }
  if (!signals.timeBudgetKnown) {
    push("你接下来每天或每周大概能稳定投入多少时间？更适合整块专注，还是碎片推进。");
  }
  if (!signals.constraintsKnown) {
    push("现在最大的限制是什么？比如时间碎、容易分心、资料不全，还是需要和别人配合。");
  }
  return questions;
}

function buildLocalGuidedAsk(body) {
  const conversationText = buildPlannerConversationText(body);
  const category = detectPlannerCategory(conversationText);
  const signals = extractPlannerSignals(conversationText);

  if (!shouldUseGuidedQuestioning(category, signals)) {
    return null;
  }

  const questions = buildGuidedQuestionsV3(category, signals, conversationText);
  if (!questions.length) {
    return null;
  }

  const introMap = {
    exam: "我先按考试复习的思路把信息补齐，再一步步细化成计划。",
    project: "我先把项目范围、当前进度和这周能投入的时间摸清，再一步步细化成能落地的开发安排。",
    demo: "我先把交付物、进度和限制摸清，再一步步细化成可演示的推进计划。",
    coursework: "我先把作业要求、当前进度和可投入时间补齐，再一步步细化成可执行安排。",
    longterm: "我先把阶段目标、当前状态和现实限制理顺，再一步步细化成更稳的长期计划。",
    general: "我先补齐最关键的信息，再一步步细化成不飘的计划。"
  };

  return {
    mode: "ask",
    reply: `${introMap[category] || introMap.general}\n\n${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}`,
    questions,
    draft: null,
    provider: "local-guard",
    model: "guided-ask",
    usage: null
  };
}

function buildLocalDraft(category, conversationText) {
  const deadline = inferRelativeDeadline(conversationText);

  if (category === "exam") {
    return {
      reply: "信息已经够了，我先按冲刺复习的顺序给你收成一版能直接执行的草案。重点会放在先补弱项、再做限时检验，避免临近考试还在泛泛复习。",
      draft: {
        title: "考试冲刺复习安排",
        deadline,
        rationale: "我先按考试时间、薄弱模块、当前水平和可投入时长做拆解，优先保证最容易提分的内容先被覆盖，再留出临近考试的回看和检验时间。",
        tasks: [
          "整理考试范围与现有资料清单，圈出这几天必须覆盖的章节和题型。",
          "先集中补薄弱模块的核心概念和例题，形成一页公式或方法速记。",
          "按每天可投入时长刷针对性练习，并把错题按原因归到同一份清单里。",
          "安排 1 到 2 次限时训练，检验做题速度、步骤稳定性和薄弱点是否回潮。",
          "在考前回看错题、公式和易混点，只保留最影响分数的内容做最后加固。"
        ],
        tips: [
          "先做最容易提分的薄弱模块，不要把时间平均摊给所有章节。",
          "限时训练要尽量贴近真实考试节奏，避免只做不计时。",
          "晚上复习前先定一个主攻点，这样 2 小时更容易收住。"
        ]
      }
    };
  }

  if (category === "demo") {
    return {
      reply: "信息已经够了，我先按“先跑通最小可演示闭环，再补展示材料”的顺序给你出一版推进草案。这样更适合一个人利用晚上的整块时间稳定往前推。",
      draft: {
        title: "比赛 Demo 冲刺推进",
        deadline,
        rationale: "我先按交付物、当前进度、可投入时长和现实限制做拆解，优先保住可演示网页的主流程，再把答辩材料和收尾检查排到后面。",
        tasks: [
          "明确本次 Demo 的最小演示闭环，写清首页、核心流程和必须展示的结果。",
          "先补齐网页主流程和关键页面，保证从进入到完成展示能顺畅跑通。",
          "同步整理演示所需截图、文案和结果说明，避免最后临时回头补材料。",
          "按晚间固定时段推进一个明确模块，并记录第二天衔接点减少重新启动成本。",
          "在截止前做一轮完整演示和彩排，修掉最影响展示效果的卡点和缺口。"
        ],
        tips: [
          "先保证能演示，再决定哪些细节留到下一轮优化。",
          "一个人推进时每天只盯一个主模块，切换太多最容易掉效率。",
          "答辩 PPT 最好跟着功能推进同步积累，不要全部留到最后一天。"
        ]
      }
    };
  }

  if (category === "project") {
    const domain = detectProjectDomain(conversationText);
    if (domain === "game") {
      return {
        reply: "信息已经够了，我先按“先做出最小可玩闭环，再补资源和表现”的顺序给你收成一版开发草案。这样比一开始摊大功能面更稳，也更适合一周内推进。",
        draft: {
          title: "C++ 游戏项目一周推进",
          deadline,
          rationale: "我先按最小可玩版本、当前基础、可投入时间和主要卡点做拆解，优先保证核心玩法能跑通，再安排调试、资源补齐和演示收尾。",
          tasks: [
            "明确一周内必须交付的最小可玩闭环，写清植物放置、僵尸推进、攻击判定和胜负条件哪些必须保留。",
            "搭好工程结构和核心类关系，先把窗口、主循环、资源加载和基础对象管理跑通。",
            "优先实现一条完整玩法主链，让放置、生成、移动、碰撞和掉血至少能串起来运行一次。",
            "围绕最容易出错的模块做逐项调试，记录崩溃点、判定错位和资源问题并当天回补。",
            "在截止前做一轮完整演示走查，补 README 或操作说明，只保留能稳定展示的功能。"
          ],
          tips: [
            "先保住最小可玩，再考虑关卡、动画和额外植物类型，别一开始把面铺太大。",
            "每加一个功能就立刻编译运行一次，别攒到最后一起排错。",
            "一周项目最怕返工，类关系和主循环先写简图会省很多调试时间。"
          ]
        }
      };
    }

    return {
      reply: "信息已经够了，我先按“先跑通最小可运行版本，再按模块补功能和测试”的顺序给你收成一版开发草案。这样比一开始追求完整更稳。",
      draft: {
        title: "编程项目短周期推进",
        deadline,
        rationale: "我先按交付目标、当前基础、这周可投入时间和主要卡点做拆解，优先把最小可运行版本接通，再安排模块补齐、调试和收尾。",
        tasks: [
          "明确这周必须交付的最小可运行结果，列出核心功能、非核心功能和可以删减的部分。",
          "搭好工程骨架和主要模块接口，先保证项目能编译、能启动、能留下调试入口。",
          "按一条主流程优先实现关键功能，把输入、状态变化和结果输出先完整串起来。",
          "每完成一个模块就立刻编译运行并记录报错，把高频 bug 和卡点集中归档后逐项清掉。",
          "在截止前做一轮完整走查，补操作说明、演示脚本或必要文档，确保交付时能稳定复现。"
        ],
        tips: [
          "短周期项目先做减法，核心流程能跑通比功能堆满更重要。",
          "别把调试留到最后，编译通过和运行通过要当成每天的硬节点。",
          "如果只会基础语法，就优先用简单稳定的类设计，别急着上太复杂的架构。"
        ]
      }
    };
  }

  if (category === "coursework") {
    return {
      reply: "信息已经够我先帮你收成一版作业冲刺草案了。我会按“先完成能拿分的结果，再补说明和自查”的顺序拆，这样更适合临近截止的课程任务。",
      draft: {
        title: "课程作业完成安排",
        deadline,
        rationale: "我先根据交付物、截止时间、当前进度、评分标准和可投入时长做拆解，优先保证必交内容先完成，再把报告整理、自查和提交风险压到后面处理。",
        tasks: [
          "通读题目和评分标准，列出必做项、占分点和不能漏交的材料清单。",
          "先把环境、资料和作业框架准备好，确认代码或正文能够从头顺利推进。",
          "按题目顺序完成核心内容，并同步保存运行结果、截图或引用材料供后续整理。",
          "根据评分标准补齐实验报告、分析说明或排版细节，避免只完成主体却丢过程分。",
          "在提交前做一轮对照自查，确认文件命名、格式、附件和截止时间都没有遗漏。"
        ],
        tips: [
          "先完成最占分的主体内容，再回头补格式和润色会更稳。",
          "代码、截图和报告最好同步留档，避免最后回头补证据。",
          "如果晚上时间固定，第一小时做主体，第二小时专门收结果和整理材料。"
        ]
      }
    };
  }

  return {
    reply: "信息已经够了，我先给你收成一版能稳定执行的长期推进草案。重点不会放在一开始做很多，而是先把节奏固定住，再慢慢加量。",
    draft: {
      title: "长期目标稳步推进",
      deadline,
      rationale: "我先按阶段目标、当前状态、可投入时长和现实限制做拆解，优先保证固定时段和最小动作先建立，再把连续推进和复盘放进后续节奏里。",
      tasks: [
        "明确这一阶段最先要看到的结果，写成一个 2 到 6 周内能判断成败的标准。",
        "固定每周最稳定的学习时段，并给每次推进预留一个不会太重的起步动作。",
        "按当前时间预算安排稳定练习，把输出留痕到同一份记录里便于复盘。",
        "针对最容易打断你的因素提前设置限制，降低临时分心把整次学习打散的概率。",
        "每周做一次短复盘，只调整最影响坚持率的一个问题，让节奏越走越稳。"
      ],
      tips: [
        "长期目标先保连续性，再慢慢加难度，比一开始排太满更容易坚持。",
        "固定时段前先准备最小动作，状态差时也不容易完全断掉。",
        "每周只改一个最卡你的点，节奏会比频繁大改更稳。"
      ]
    }
  };
}

function decorateEvidenceBasedLocalDraft(category, conversationText, localDraft) {
  if (!localDraft?.draft || typeof localDraft.draft !== "object") {
    return localDraft;
  }

  const nextDraft = {
    ...localDraft.draft,
    tasks: Array.isArray(localDraft.draft.tasks) ? [...localDraft.draft.tasks] : [],
    tips: Array.isArray(localDraft.draft.tips) ? [...localDraft.draft.tips] : []
  };

  if (category === "exam") {
    nextDraft.tasks = [
      nextDraft.tasks[0] || "整理考试范围与现有资料清单，圈出这几天必须覆盖的章节和题型。",
      getActiveRecallTask(),
      getSpacedReviewTask(),
      getInterleavingTask(),
      getWrongQuestionReviewTask(),
      getTimedMockTask()
    ];
    nextDraft.tips = [
      "优先用主动回忆和做题检验代替反复重读，薄弱点会更容易暴露出来。",
      "如果还有一周以上，至少保留 next day / 3 days / 7 days 三个回看点，别只学一遍。",
      "很多高分复习博主都会把模考放到正式考试时段去做，这一点值得保留。"
    ].slice(0, 3);
    return {
      ...localDraft,
      draft: nextDraft
    };
  }

  if (category === "project") {
    const domain = detectProjectDomain(conversationText);
    nextDraft.tasks = domain === "game"
      ? [
        nextDraft.tasks[0] || "明确一周内必须交付的最小可玩闭环，写清必须保留的核心玩法。",
        "把开发顺序切成每天一个可运行的小增量，先做窗口和主循环，再接玩法主链，最后补表现和说明。",
        "每接好一个模块就立刻编译运行，优先当天清掉崩溃、资源丢失和碰撞判定这类会阻塞后续的问题。",
        "把 bug 按“编译不过 / 运行崩溃 / 逻辑不对 / 表现异常”分类记录，避免同类问题反复返工。",
        "截止前按演示流程完整走一遍，只保留能稳定展示的版本和功能。"
      ]
      : [
        nextDraft.tasks[0] || "明确这周必须交付的最小可运行结果，列出核心功能和可删减部分。",
        "把开发顺序切成每天一个可运行的小增量，先保住启动、输入、主流程和输出，再补扩展功能。",
        "每完成一个模块就立刻编译运行并记录错误，优先清掉会阻断主流程的问题。",
        "把 bug 按“编译不过 / 运行崩溃 / 逻辑不对 / 表现异常”分类整理，减少反复试错。",
        "截止前做一轮完整走查和演示预演，保证交付版能稳定复现。"
      ];
    nextDraft.tips = [
      "项目计划不能套考试模板，核心是先保主链可运行，再补功能和表现。",
      "如果只有基础语法水平，就优先写简单稳定的类和函数，别让架构复杂度超过当前能力。",
      "不同项目的计划应该围绕交付物和卡点变化，不应该只换几个名词。"
    ];
    return {
      ...localDraft,
      draft: nextDraft
    };
  }

  if (category === "longterm") {
    const domain = detectLearningDomain(conversationText);
    nextDraft.tasks = [
      nextDraft.tasks[0] || "明确这一阶段最先要看到的结果，写成 2 到 6 周内能判断成败的标准。",
      getHabitCueTask(),
      getLongtermPracticeTask(domain),
      getSpacedReviewTask(),
      getCheckinReviewTask(),
      getIfThenTask()
    ];
    nextDraft.tips = [
      "长期目标先保连续性，再慢慢加难度，比一开始排太满更容易真正坚持。",
      "如果是知识型目标，默认用回忆、练习、复盘做主线，不要把重读和划重点当成主方法。",
      "很多学习博主会用打卡表维持节奏，但只建议保留最小必要记录，别把精力都花在做表上。"
    ].slice(0, 3);
    return {
      ...localDraft,
      draft: nextDraft
    };
  }

  return localDraft;
}

function buildLocalPlannerResponse(body) {
  const latestPrompt = extractLatestUserPrompt(body);
  if (isGreetingOnly(latestPrompt)) {
    return buildGreetingPlannerResponse();
  }

  const conversationText = buildPlannerConversationText(body);
  const category = detectPlannerCategory(conversationText);
  const signals = extractPlannerSignals(conversationText);
  const guidedAsk = buildLocalGuidedAsk(body);

  if (guidedAsk) {
    return guidedAsk;
  }

  if (category !== "general") {
    const localDraft = decorateEvidenceBasedLocalDraft(
      category,
      conversationText,
      buildLocalDraft(category, conversationText)
    );
    return {
      mode: "draft",
      questions: null,
      provider: "local-guard",
      model: "guided-draft",
      usage: null,
      ...localDraft
    };
  }

  return null;
}

function buildPresetAskResponse(body) {
  const prompt = extractLatestUserPrompt(body);
  if (/(?:\u82f1\u8bed|\u56db\u7ea7|\u516d\u7ea7|\u96c5\u601d|\u6258\u798f)/u.test(prompt) && /(?:\u8003\u8bd5|\u590d\u4e60|\u5907\u8003)/u.test(prompt)) {
    const questions = [
      "这次英语考试具体是哪一种？比如四级、六级、雅思、托福，或者学校自己的课程考试。",
      "你的考试时间或目标出分时间是什么时候？",
      "你现在最薄弱的是哪个模块？比如听力、阅读、写作、翻译，还是词汇和语法。",
      "你目前的基础大概在哪个水平？比如最近一次分数、做题正确率，或者你自己的主观判断。",
      "你接下来每天或每周大概能拿出多少时间复习？更适合整块专注，还是碎片时间推进。"
    ];

    return {
      mode: "ask",
      reply: `我先把你的英语备考情况摸清，再给你出更贴合的计划。\n\n${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}`,
      questions,
      draft: null,
      provider: "local-guard",
      model: "preset-ask",
      usage: null
    };
  }

  return null;
}

async function callOpenAIPlanner(body) {
  const latestPrompt = extractLatestUserPrompt(body);
  if (isGreetingOnly(latestPrompt)) {
    return buildGreetingPlannerResponse();
  }

  const { apiKey, baseUrl, model } = getOpenAIConfig();
  const input = buildMessages(body);
  const hasDirectFileInput = containsDirectFileInput(input);

  try {
    if (!apiKey) {
      throw new Error("Server cannot find OPENAI_API_KEY.");
    }

    const response = await fetch(`${baseUrl}/responses`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        store: false,
        instructions: `${PLANNER_RUNTIME_PROMPT.trim()}\n${LEARNING_EVIDENCE_PROMPT.trim()}`,
        input,
        text: {
          format: {
            type: "json_schema",
            ...PLANNER_RUNTIME_SCHEMA
          }
        }
      })
    });

    const { payload, rawText } = await readResponsePayload(response);
    if (!response.ok) {
      if (shouldFallbackToChatCompletions(response.status, payload) && !hasDirectFileInput) {
        return callOpenAIPlannerViaChatCompletions({
          apiKey,
          baseUrl,
          model,
          input
        });
      }

      if (hasDirectFileInput && shouldFallbackToChatCompletions(response.status, payload)) {
        throw new Error("The configured upstream does not support PDF attachments on the Responses API.");
      }

      throw new Error(buildUpstreamErrorMessage(response, payload, rawText));
    }

    const refusal = Array.isArray(payload?.output)
      ? payload.output
        .flatMap((item) => Array.isArray(item?.content) ? item.content : [])
        .find((contentItem) => contentItem?.type === "refusal")
      : null;

    if (refusal?.refusal) {
      return {
        mode: "ask",
        reply: refusal.refusal,
        questions: null,
        draft: null,
        provider: "openai",
        model,
        usage: payload?.usage || null
      };
    }

    const content = extractOpenAIOutputText(payload);
    if (!content) {
      throw new Error("OpenAI response did not contain output text.");
    }

    const normalized = enforceAskQuestionCoverage(
      normalizePlannerPayload(parseModelJson(content)),
      body
    );

    return {
      ...normalized,
      provider: "openai",
      model,
      usage: payload?.usage || null
    };
  } catch (error) {
    const fallback = buildLocalPlannerResponse(body) || buildPresetAskResponse(body);
    if (fallback) {
      return {
        ...fallback,
        reply: `${buildPlannerFallbackNotice(error)}\n\n${fallback.reply}`,
        provider: `${fallback.provider || "local"}-fallback`,
        usage: null
      };
    }

    throw error;
  }
}

function shouldFallbackToChatCompletions(status, payload) {
  if (status === 404 || status === 405 || status === 415) {
    return true;
  }

  const message = String(payload?.error?.message || payload?.message || "").toLowerCase();
  if (!message) {
    return false;
  }

  return [
    "responses",
    "unsupported",
    "not found",
    "unknown path",
    "invalid url",
    "response_format",
    "json_schema",
    "invalid character",
    "cannot unmarshal"
  ].some((fragment) => message.includes(fragment));
}

function containsDirectFileInput(input) {
  return input.some((item) => Array.isArray(item?.content)
    && item.content.some((part) => part?.type === "input_file"));
}

function convertResponsesContentToChatContent(content) {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((part) => {
      if (part?.type === "input_text") {
        return {
          type: "text",
          text: String(part.text || "")
        };
      }

      if (part?.type === "input_image" && typeof part.image_url === "string") {
        return {
          type: "image_url",
          image_url: {
            url: part.image_url,
            detail: part.detail || "auto"
          }
        };
      }

      if (part?.type === "input_file") {
        return {
          type: "text",
          text: `用户还上传了 PDF 文件《${part.filename || "document.pdf"}》，但当前回退通道无法直接读取 PDF 内容。`
        };
      }

      return null;
    })
    .filter(Boolean);
}

function convertInputToChatMessages(input) {
  return [
    { role: "system", content: `${PLANNER_RUNTIME_PROMPT.trim()}\n${LEARNING_EVIDENCE_PROMPT.trim()}` },
    ...input.map((item) => ({
      role: item.role === "assistant" ? "assistant" : item.role === "developer" ? "system" : "user",
      content: convertResponsesContentToChatContent(item.content)
    }))
  ];
}

function extractChatCompletionContent(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => typeof item?.text === "string" ? item.text : "")
      .join("\n")
      .trim();
  }

  return "";
}

async function callOpenAIPlannerViaChatCompletions({ apiKey, baseUrl, model, input }) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: convertInputToChatMessages(input)
    })
  });

  const { payload, rawText } = await readResponsePayload(response);
  if (!response.ok) {
    throw new Error(buildUpstreamErrorMessage(response, payload, rawText));
  }

  const content = extractChatCompletionContent(payload);
  if (!content) {
    throw new Error("Chat Completions response did not contain output text.");
  }

  const normalized = enforceAskQuestionCoverage(
    normalizePlannerPayload(parseModelJson(content)),
    { prompt: input[input.length - 1]?.content || "", history: [] }
  );
  return {
    ...normalized,
    provider: "openai-compatible",
    model,
    usage: payload?.usage || null
  };
}

function safeJoin(requestPath) {
  const cleanedPath = decodeURIComponent(requestPath.split("?")[0]);
  const targetPath = cleanedPath === "/" ? "/index.html" : cleanedPath;
  const fullPath = path.normalize(path.join(ROOT_DIR, targetPath));

  if (!fullPath.startsWith(ROOT_DIR)) {
    return null;
  }

  return fullPath;
}

async function handleStaticFile(request, response) {
  const fullPath = safeJoin(request.url || "/");
  if (!fullPath) {
    sendText(response, 403, "Forbidden");
    return;
  }

  try {
    const stat = await fs.promises.stat(fullPath);
    const filePath = stat.isDirectory() ? path.join(fullPath, "index.html") : fullPath;
    const ext = path.extname(filePath).toLowerCase();
    const data = await fs.promises.readFile(filePath);

    response.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream"
    });
    response.end(data);
  } catch (error) {
    sendText(response, 404, "Not Found");
  }
}

async function handleHttpRequest(request, response) {
  if (!request.url) {
    sendText(response, 400, "Bad Request");
    return;
  }

  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === "GET" && request.url === "/api/planner/status") {
    const config = getOpenAIConfig();
    sendJson(response, 200, {
      ok: true,
      provider: "openai",
      apiKeyConfigured: config.apiKeyConfigured,
      apiKeyPreview: maskSecret(config.apiKey),
      baseUrl: config.baseUrl,
      model: config.model
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/planner") {
    try {
      const body = await parseRequestBody(request);
      const payload = await callOpenAIPlanner(body);
      sendJson(response, 200, payload);
    } catch (error) {
      const statusCode = error instanceof Error && error.message === "Request body too large." ? 413 : 500;
      sendJson(response, statusCode, {
        message: error instanceof Error ? error.message : "Unknown server error."
      });
    }
    return;
  }

  if (request.method === "GET") {
    await handleStaticFile(request, response);
    return;
  }

  sendText(response, 405, "Method Not Allowed");
}

function createServer() {
  return http.createServer(handleHttpRequest);
}

module.exports = {
  buildGuidedQuestionsV3,
  buildLocalGuidedAsk,
  buildLocalPlannerResponse,
  createServer,
  buildPlannerConversationText,
  callOpenAIPlanner,
  detectPlannerCategory,
  extractLatestUserPrompt,
  extractPlannerSignals,
  getOpenAIConfig
};

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    const config = getOpenAIConfig();
    console.log(`Time Dreambook server running at http://${HOST}:${PORT}`);
    console.log(
      `[planner] provider=openai model=${config.model} baseUrl=${config.baseUrl} apiKeyConfigured=${config.apiKeyConfigured}`
    );
  });
}

function getAttachmentSummaryLabel(attachment) {
  if (attachment.kind === "image") {
    return "图片";
  }

  if (attachment.kind === "pdf") {
    return "PDF";
  }

  if (attachment.kind === "docx") {
    return "DOCX";
  }

  return "文本文件";
}

function buildAttachmentSummary(attachments) {
  if (!attachments.length) {
    return "";
  }

  return attachments
    .map((attachment, index) => `${index + 1}. ${getAttachmentSummaryLabel(attachment)}《${attachment.name}》`)
    .join("\n");
}
