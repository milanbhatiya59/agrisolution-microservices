import { useLanguage } from "../../../context/LanguageContext";
import { translateText } from "../../../utils/translate";
import { useEffect, useState } from "react";

const SoilTestResultsForm = ({ formData, handleChange }) => {
  const { language } = useLanguage();
  const [translatedLabels, setTranslatedLabels] = useState({});
  const [translatedTitle, setTranslatedTitle] = useState("Soil Test Results");

  // List of required fields
  const requiredFields = [
    "pH",
    "EC",
    "OrganicCarbonOC",
    "AvailableNitrogenN",
    "AvailablePhosphorusP",
    "AvailablePotassiumK"
  ];

  useEffect(() => {
    const translateLabels = async () => {
      const translations = {};
      for (const field of Object.keys(formData.soilTestResults)) {
        translations[field] = await translateText(
          field.replace(/([A-Z])/g, " $1"),
          language
        );
      }

      const titleTranslation = await translateText(
        "Soil Test Results",
        language
      );
      setTranslatedTitle(titleTranslation);
      setTranslatedLabels(translations);
    };

    translateLabels();
  }, [language, formData.soilTestResults]);

  return (
    <div className="md:col-span-3">
      <h2 className="text-lg font-semibold mb-4">{translatedTitle}</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(formData.soilTestResults).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">
              {translatedLabels[field] || field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={`soilTestResults.${field}`}
              value={formData.soilTestResults[field] || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:bg-green-100 text-black"
              required={requiredFields.includes(field)}  // 🔥 This line ensures required fields show alert
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoilTestResultsForm;
