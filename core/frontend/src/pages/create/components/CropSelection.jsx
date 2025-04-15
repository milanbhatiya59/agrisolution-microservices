import { useLanguage } from "../../../context/LanguageContext";
import { translateText } from "../../../utils/translate";
import { useEffect, useState } from "react";
import { getProfitEstimation } from "../../../api/getProfitEstimation";

const CropSelection = ({ formData, handleChange, cropRecommendations }) => {
  const { language } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [estimation, setEstimation] = useState(null);
  const [loadingEstimation, setLoadingEstimation] = useState(false);

  useEffect(() => {
    const fetchTranslations = async () => {
      setTranslatedTexts({
        title: await translateText("Crop Recommendations", language),
        selectCrop: await translateText("Select a Crop", language),
        fertilizersNeeded: await translateText("Fertilizers Needed", language),
        estimationTitle: await translateText("Profit Estimation", language),
        costLabel: await translateText("Estimated Cost", language),
        yieldLabel: await translateText("Expected Yield", language),
        revenueLabel: await translateText("Expected Revenue", language),
      });
    };

    fetchTranslations();
  }, [language]);

  const handleCropChange = async (e) => {
    handleChange(e);
    const selected = cropRecommendations.find(
      (crop) => crop.cropName === e.target.value
    );
    setSelectedCrop(selected);

    const cacheKey = `estimation_${selected?.cropName}_${formData.soilSampleDetails.FarmSizeInHector}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setEstimation(JSON.parse(cached));
      return;
    }

    setLoadingEstimation(true);
    try {
      const result = await getProfitEstimation({
        crop: selected?.cropName,
        farmSize: formData.soilSampleDetails.FarmSizeInHector,
        fertilizers: selected?.fertilizerNeeded || [],
      });
      localStorage.setItem(cacheKey, JSON.stringify(result));
      setEstimation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEstimation(false);
    }
  };

  return (
    <div className="md:col-span-1">
      <h2 className="text-lg font-semibold mb-4">
        {translatedTexts.title || "Crop Recommendations"}
      </h2>

      <label className="block text-sm font-medium mb-1">
        {translatedTexts.selectCrop || "Select a Crop"}
      </label>
      <select
        name="currentCrop"
        value={formData.currentCrop}
        onChange={handleCropChange}
        className="w-full p-2 border rounded bg-green-200 dark:bg-green-700 focus:border-green-400 focus:ring-1 focus:ring-green-400 text-black"
      >
        <option value="">
          {translatedTexts.selectCrop || "Select a Crop"}
        </option>
        {cropRecommendations.map((crop, index) => (
          <option key={index} value={crop.cropName}>
            {crop.cropName}
          </option>
        ))}
      </select>

      {selectedCrop && (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {/* Left: Fertilizers */}
          <div className="bg-green-100 dark:bg-green-800 p-4 rounded">
            <h3 className="text-md font-medium mb-2">
              {translatedTexts.fertilizersNeeded || "Fertilizers Needed"}:
            </h3>
            {selectedCrop.fertilizerNeeded?.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {selectedCrop.fertilizerNeeded.map((fertilizer, idx) => (
                  <li key={idx}>
                    {fertilizer.name} - {fertilizer.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-gray-500">
                No fertilizers listed.
              </p>
            )}
          </div>

          {/* Right: Estimation */}
          <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded space-y-3">
            <h3 className="text-md font-medium">
              {translatedTexts.estimationTitle || "Profit Estimation"}
            </h3>

            {loadingEstimation ? (
              <p className="text-sm italic text-yellow-600 dark:text-yellow-300">
                Loading estimation...
              </p>
            ) : estimation ? (
              <div className="text-sm space-y-2">
                <p>
                  💰 <strong>{translatedTexts.costLabel}:</strong> ₹
                  {estimation.estimatedCost.toLocaleString()}
                </p>
                <p>
                  📈 <strong>{translatedTexts.revenueLabel}:</strong> ₹
                  {estimation.estimatedRevenue.toLocaleString()}
                </p>

                {/* Cost Breakdown */}
                {estimation.costBreakdown && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      📦 Cost Breakdown:
                    </h4>
                    <ul className="list-disc list-inside text-xs">
                      {Object.entries(estimation.costBreakdown).map(
                        ([key, val]) => (
                          <li key={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}: ₹
                            {val.toLocaleString()}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Revenue Breakdown */}
                {estimation.revenueBreakdown && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      📊 Revenue Breakdown:
                    </h4>
                    <ul className="list-disc list-inside text-xs">
                      <li>
                        Market Price/Quintal: ₹
                        {estimation.revenueBreakdown.marketPricePerQuintal}
                      </li>
                      <li>
                        Yield/Ha:{" "}
                        {
                          estimation.revenueBreakdown
                            .expectedYieldQuintalPerHectare
                        }
                      </li>
                      <li>
                        Total Yield: {estimation.revenueBreakdown.totalYield}{" "}
                        quintals
                      </li>
                    </ul>
                  </div>
                )}

                {/* Notes */}
                {estimation.notes && (
                  <p className="text-xs italic text-gray-600 dark:text-gray-300 mt-2">
                    📌 {estimation.notes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm italic text-gray-500">
                No estimation available yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropSelection;
