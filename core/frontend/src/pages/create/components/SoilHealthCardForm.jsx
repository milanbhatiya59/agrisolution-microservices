import { useLanguage } from "../../../context/LanguageContext";
import { translateText } from "../../../utils/translate";
import { useEffect, useState } from "react";

const SoilHealthCardForm = ({ formData, handleChange, loading }) => {
  const { language } = useLanguage();
  const [translatedLabels, setTranslatedLabels] = useState({});

  useEffect(() => {
    const translateLabels = async () => {
      const translations = {};
      for (const field of Object.keys(formData.soilHealthCard)) {
        translations[field] = await translateText(
          field.replace(/([A-Z])/g, " $1"),
          language
        );
      }
      translations.title = await translateText("Soil Health Card", language);
      setTranslatedLabels(translations);
    };

    translateLabels();
  }, [language, formData.soilHealthCard]);

  return (
    <div className="md:col-span-3">
      <h2 className="text-lg font-semibold mb-4">
        {translatedLabels.title || "Soil Health Card"}
      </h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 border-solid"></div>
          <span className="ml-2">Loading soil card data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {Object.keys(formData.soilHealthCard).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">
                {translatedLabels[field] || field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field.includes("Validity") ? "date" : "text"}
                name={`soilHealthCard.${field}`}
                value={formData.soilHealthCard[field] || ""}
                onChange={handleChange}
                min={
                  field === "ValidityTo"
                    ? formData.soilHealthCard.ValidityFrom || undefined
                    : undefined
                }
                className="w-full p-2 border rounded focus:bg-green-100 text-black"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoilHealthCardForm;
