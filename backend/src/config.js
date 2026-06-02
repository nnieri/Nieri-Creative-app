import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 4000),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  useMockAryeo: process.env.USE_MOCK_ARYEO !== "false",
  aryeoApiBaseUrl: process.env.ARYEO_API_BASE_URL || "https://api.aryeo.com/v1",
  aryeoApiToken: process.env.ARYEO_API_TOKEN || "",
  aiProvider: process.env.AI_PROVIDER || "mock",
  aiApiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-5.4-mini",
};
