import { useLanguage } from "../../../context/LanguageContext";
import { translateText } from "../../../utils/translate";
import { useEffect, useState } from "react";

const FarmersDetailsForm = ({ formData, handleChange }) => {
  const { language } = useLanguage();
  const [translatedLabels, setTranslatedLabels] = useState({});

  useEffect(() => {
    const translateLabels = async () => {
      const translations = {};
      for (const field of Object.keys(formData.farmersDetails)) {
        translations[field] = await translateText(
          field.replace(/([A-Z])/g, " $1"),
          language
        );
      }
      translations.title = await translateText("Farmers Details", language);
      setTranslatedLabels(translations);
    };

    translateLabels();
  }, [language, formData.farmersDetails]);

  return (
    <div className="md:col-span-3">
      <h2 className="text-lg font-semibold mb-4">
        {translatedLabels.title || "Farmers Details"}
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(formData.farmersDetails).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">
              {translatedLabels[field] || field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={`farmersDetails.${field}`}
              value={formData.farmersDetails[field] || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:bg-green-100 text-black"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmersDetailsForm;
