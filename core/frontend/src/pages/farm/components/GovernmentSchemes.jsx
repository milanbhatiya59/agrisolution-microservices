import { useEffect, useState } from "react";
import axios from "axios";

const GovernmentSchemes = ({ farmData }) => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prompt = `
Suggest 3-5 government schemes for Indian farmers based on:

- District: ${farmData?.farmersDetails?.district || "Unknown"}
- Sub-district: ${farmData?.farmersDetails?.subDistrict || "Unknown"}
- Village: ${farmData?.farmersDetails?.village || "Unknown"}
- Crop: ${farmData?.currentCrop || "Unknown"}
- Farm Size: ${
    farmData?.soilSampleDetails?.farmSizeInHector || "Unknown"
  } hectares

Only return valid JSON array like:
[
  {
    "name": "Scheme Name",
    "description": "Short description",
    "eligibility": "Who can apply",
    "link": "Official link (optional)"
  }
]
`.trim();

  useEffect(() => {
    const fetchSchemes = async () => {
      if (!farmData) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.post(import.meta.env.VITE_API_URL, {
          contents: [{ parts: [{ text: prompt }] }],
        });

        const raw = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const match = raw.match(/\[([\s\S]*?)\]/);
        if (!match) throw new Error("No JSON array found");

        const parsed = JSON.parse(match[0]);
        setSchemes(parsed);
      } catch (err) {
        console.error("Failed to fetch schemes:", err);
        setError("Could not fetch schemes.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [farmData]);

  if (!farmData) return null;

  return (
    <div className="mt-6 bg-blue-50 dark:bg-blue-900 p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
        🏛️ Government Schemes for You
      </h3>

      {loading && (
        <p className="text-sm italic text-blue-700">Loading schemes...</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && schemes.length > 0 && (
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex space-x-4 snap-x snap-mandatory px-1">
            {schemes.map((scheme, idx) => (
              <div
                key={idx}
                className="min-w-[280px] max-w-xs flex-shrink-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow snap-center"
              >
                <h4 className="font-bold text-blue-700 dark:text-blue-200">
                  {scheme.name}
                </h4>
                <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                  {scheme.description}
                </p>
                <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                  <strong>Eligibility:</strong> {scheme.eligibility}
                </p>
                {scheme.link && (
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs mt-2 inline-block"
                  >
                    🔗 Learn more
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentSchemes;
