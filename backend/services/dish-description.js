const buildFallbackDescription = ({ dishName, category, isVeg }) => {
  const normalizedName = String(dishName || "").trim();
  const normalizedCategory = String(category || "Dish").trim();
  const vegText = isVeg ? "vegetarian" : "non-vegetarian";

  return `${normalizedName} is a flavorful ${vegText.toLowerCase()} ${normalizedCategory.toLowerCase()} made with fresh ingredients and balanced spices, crafted to deliver a satisfying taste in every bite.`;
};

const createPrompt = ({ dishName, category, isVeg }) => {
  const vegLabel = isVeg ? "vegetarian" : "non-vegetarian";

  return [
    "You are writing menu descriptions for a restaurant app.",
    "Write exactly one appealing description in plain English.",
    "Rules:",
    "- Keep it between 18 and 30 words.",
    "- Do not use quotes, markdown, or bullet points.",
    "- Mention taste and texture naturally.",
    "- Keep it realistic, not exaggerated.",
    `Dish name: ${dishName}`,
    `Category: ${category || "Dish"}`,
    `Type: ${vegLabel}`
  ].join("\n");
};

const callGemini = async ({ dishName, category, isVeg }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: createPrompt({ dishName, category, isVeg })
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 100
      }
    })
  });

  if (!response.ok) {
    throw new Error(`AI provider request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    return null;
  }

  return text.replace(/\s+/g, " ").trim();
};

exports.generateDishDescription = async ({ dishName, category, isVeg }) => {
  try {
    const generated = await callGemini({ dishName, category, isVeg });
    if (generated) {
      return generated;
    }
  } catch (_) {
    // If external AI fails, return a deterministic fallback so the feature still works.
  }

  return buildFallbackDescription({ dishName, category, isVeg });
};
