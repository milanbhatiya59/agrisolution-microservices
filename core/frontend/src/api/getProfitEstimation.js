import axios from "axios";
import { jsonrepair } from "jsonrepair";

export const getProfitEstimation = async ({ crop, fertilizers, farmSize }) => {
  const cacheKey = `${crop}-${farmSize}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const prompt = `
Estimate cost and revenue for the following farm:

- Crop: ${crop}
- Farm Size: ${farmSize} hectares
- Fertilizers: ${fertilizers.map((f) => `${f.name} (${f.quantity})`).join(", ")}

Give output strictly in JSON, nothing else. Format:
{
  "estimatedCost": number,
  "estimatedRevenue": number,
  "costBreakdown": {
    "fertilizers": number,
    "labor": number,
    "equipment": number,
    "seeds": number
  },
  "revenueBreakdown": {
    "marketPricePerQuintal": number,
    "expectedYieldQuintalPerHectare": number,
    "totalYield": number
  },
  "notes": "Short summary of assumptions."
}
`.trim();

  try {
    const response = await axios.post(import.meta.env.VITE_API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonBlock = raw.match(/\{[\s\S]*?\}/);
    if (!jsonBlock) throw new Error("No JSON found");

    let clean = jsonBlock[0];
    let data;

    try {
      const repaired = jsonrepair(clean); 
      data = JSON.parse(repaired);
    } catch (err) {
      console.error("Failed to repair/parse Gemini JSON:", clean);
      throw err;
    }

    if (
      typeof data.estimatedCost !== "number" ||
      typeof data.estimatedRevenue !== "number"
    ) {
      throw new Error("Incomplete or invalid response structure");
    }

    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (err) {
    console.error("Failed to fetch from Gemini:", err);
    throw new Error("Could not estimate profit");
  }
};
