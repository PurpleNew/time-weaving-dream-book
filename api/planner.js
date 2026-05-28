const { callOpenAIPlanner } = require("../lib/planner-core");

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error("Invalid JSON body.");
  }
}

module.exports = async function handler(request, response) {
  if (request.method === "OPTIONS") {
    return sendJson(response, 204, {});
  }

  if (request.method !== "POST") {
    return sendJson(response, 405, { message: "Method Not Allowed" });
  }

  try {
    const body = await readJsonBody(request);
    const payload = await callOpenAIPlanner(body);
    return sendJson(response, 200, payload);
  } catch (error) {
    const statusCode = error instanceof Error && error.message === "Request body too large." ? 413 : 500;
    return sendJson(response, statusCode, {
      message: error instanceof Error ? error.message : "Unknown server error."
    });
  }
};
