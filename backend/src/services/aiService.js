import { config } from "../config.js";

function clean(value, fallback = "") {
  return String(value || fallback).trim();
}

function listFeatures(rawFeatures) {
  return clean(rawFeatures, "natural light, updated finishes, and move-in-ready spaces")
    .split(/,|\n/)
    .map((feature) => feature.trim())
    .filter(Boolean);
}

const listingDescriptionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["mlsDescription", "shortDescription", "socialCaption"],
  properties: {
    mlsDescription: { type: "string" },
    shortDescription: { type: "string" },
    socialCaption: { type: "string" },
  },
};

const socialScriptSchema = {
  type: "object",
  additionalProperties: false,
  required: ["hook", "fifteenSecondScript", "thirtySecondScript", "cta", "caption"],
  properties: {
    hook: { type: "string" },
    fifteenSecondScript: { type: "string" },
    thirtySecondScript: { type: "string" },
    cta: { type: "string" },
    caption: { type: "string" },
  },
};

function shouldUseOpenAI() {
  return config.aiProvider.toLowerCase() === "openai";
}

function assertOpenAIKey() {
  if (!config.aiApiKey) {
    throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai");
  }
}

function extractResponseText(payload) {
  if (payload.output_text) return payload.output_text;

  const content = payload.output
    ?.flatMap((item) => item.content || [])
    ?.find((item) => item.type === "output_text" || item.text);

  return content?.text || "";
}

async function generateJsonWithOpenAI({ instructions, userInput, schema, schemaName }) {
  assertOpenAIKey();

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.aiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.openaiModel,
      instructions,
      input: userInput,
      max_output_tokens: 900,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          schema,
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed with ${response.status}: ${body}`);
  }

  const payload = await response.json();
  const text = extractResponseText(payload);
  if (!text) throw new Error("OpenAI returned an empty response");
  return JSON.parse(text);
}

function createMockListingDescription(input) {
  const address = clean(input.address, "this home");
  const bedrooms = clean(input.bedrooms, "well-sized");
  const bathrooms = clean(input.bathrooms, "updated");
  const squareFeet = clean(input.squareFeet, "generous");
  const tone = clean(input.tone, "Professional").toLowerCase();
  const features = listFeatures(input.keyFeatures);
  const featurePhrase = features.slice(0, 4).join(", ");

  return {
    provider: "mock",
    mlsDescription: `Welcome to ${address}, a ${tone} ${bedrooms}-bedroom, ${bathrooms}-bath home with approximately ${squareFeet} square feet. Highlights include ${featurePhrase}. Thoughtful spaces, polished presentation, and an inviting layout make this property ready for its next chapter.`,
    shortDescription: `${address} offers ${bedrooms} bedrooms, ${bathrooms} baths, and standout features like ${featurePhrase}. A strong fit for buyers looking for style, comfort, and convenience.`,
    socialCaption: `Just listed: ${address}. ${features[0] || "Beautiful details"} set the tone for this one. Message me for details or to schedule a private tour.`,
  };
}

function createMockSocialScript(input) {
  const propertyType = clean(input.propertyType, "home");
  const location = clean(input.location, "the neighborhood");
  const priceRange = clean(input.priceRange, "today's market");
  const platform = clean(input.platform, "Instagram Reel");
  const sellingPoints = listFeatures(input.keySellingPoints);
  const leadPoint = sellingPoints[0] || "a layout buyers will love";
  const secondPoint = sellingPoints[1] || "updated spaces";

  return {
    provider: "mock",
    hook: `Looking for a ${propertyType} in ${location}? This one deserves a closer look.`,
    fifteenSecondScript: `Start outside with the curb appeal, cut to the main living space, then highlight ${leadPoint}. End with the address or neighborhood and invite viewers to book a showing.`,
    thirtySecondScript: `Open with a quick exterior shot and say, "This ${propertyType} in ${location} brings serious value in ${priceRange}." Move through the kitchen, living area, and best feature. Mention ${leadPoint} and ${secondPoint}, then close with a clear showing invitation.`,
    cta: "Send me a message for details or to schedule a private tour.",
    caption: `${platform} idea: ${propertyType} in ${location} with ${sellingPoints.slice(0, 3).join(", ")}. DM for the full listing media package.`,
  };
}

export async function createListingDescription(input) {
  if (!shouldUseOpenAI()) {
    return createMockListingDescription(input);
  }

  const data = await generateJsonWithOpenAI({
    schema: listingDescriptionSchema,
    schemaName: "listing_description_response",
    instructions:
      "You write accurate, polished real estate marketing copy for Nieri Creative clients. Avoid fair housing issues, unsupported superlatives, guaranteed outcomes, invented facts, and claims not supported by the user's input. Keep copy professional, specific, and ready for an agent to review before publishing.",
    userInput: JSON.stringify({
      task: "Create real estate listing marketing copy from the provided details.",
      requiredOutput: {
        mlsDescription: "MLS-style listing description, one paragraph, polished and factual.",
        shortDescription: "Short Zillow/Realtor.com style description, one compact paragraph.",
        socialCaption: "Short social caption with a clear but not pushy call to action.",
      },
      property: input,
    }),
  });

  return { provider: "openai", model: config.openaiModel, ...data };
}

export async function createSocialScript(input) {
  if (!shouldUseOpenAI()) {
    return createMockSocialScript(input);
  }

  const data = await generateJsonWithOpenAI({
    schema: socialScriptSchema,
    schemaName: "social_script_response",
    instructions:
      "You create concise real estate social video scripts for agents. Keep scripts easy to film, conversational, compliant, and grounded only in the user's supplied property details. Do not invent amenities, performance claims, buyer demographics, or legal/financial promises.",
    userInput: JSON.stringify({
      task: "Create short-form social media video copy from the provided details.",
      requiredOutput: {
        hook: "A punchy opening line.",
        fifteenSecondScript: "A simple 15-second filming and voiceover script.",
        thirtySecondScript: "A simple 30-second filming and voiceover script.",
        cta: "A direct call to action.",
        caption: "A platform-ready caption.",
      },
      property: input,
    }),
  });

  return { provider: "openai", model: config.openaiModel, ...data };
}
