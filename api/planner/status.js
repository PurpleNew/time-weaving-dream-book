const { getOpenAIConfig } = require("../../lib/planner-core");

function maskSecret(secret) {
  const value = String(secret || "").trim();
  if (!value) {
    return "";
  }

  if (value.length <= 8) {
    return `${value.slice(0, 2)}***`;
  }

  return `${value.slice(0, 5)}***${value.slice(-4)}`;
}

module.exports = function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end("{}");
    return;
  }

  if (request.method !== "GET") {
    response.statusCode = 405;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ message: "Method Not Allowed" }));
    return;
  }

  const config = getOpenAIConfig();
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify({
    ok: true,
    provider: "openai",
    apiKeyConfigured: config.apiKeyConfigured,
    apiKeyPreview: maskSecret(config.apiKey),
    baseUrl: config.baseUrl,
    model: config.model
  }));
};
