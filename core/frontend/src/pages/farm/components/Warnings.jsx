import { useState, useEffect } from "react";
import { getWarning } from "../../../api/getWarning";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { translateText } from "../../../utils/translate";

const Warning = ({ farmData }) => {
  const [warning, setWarning] = useState(null);
  const { language } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState("Warnings");
  const [translatedWarning, setTranslatedWarning] = useState(null);

  useEffect(() => {
    if (!farmData) return;

    const fetchWarning = async () => {
      try {
        const response = await getWarning(farmData);
        setWarning(response);
      } catch (err) {
        console.error("Error fetching warning:", err);
      }
    };

    fetchWarning();
  }, [farmData]);

  useEffect(() => {
    const translateContent = async () => {
      const titleTranslation = await translateText("Warnings", language);
      setTranslatedTitle(titleTranslation);

      if (warning) {
        const translatedData = {
          weather: warning.weather
            ? await translateText(warning.weather, language)
            : null,
          soilHealth: warning.soilHealth
            ? await translateText(warning.soilHealth, language)
            : null,
          cropHealth: warning.cropHealth
            ? await translateText(warning.cropHealth, language)
            : null,
        };

        setTranslatedWarning(translatedData);
      }
    };

    translateContent();
  }, [language, warning]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-500/70 rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 flex items-center mb-4">
        <AlertTriangle className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
        {translatedTitle}
      </h2>

      {translatedWarning && (
        <div className="space-y-4">
          {translatedWarning.weather && (
            <div className="bg-red-100 dark:bg-red-800/30 text-red-900 dark:text-red-200 p-4 rounded-md shadow-sm border-l-4 border-red-500 dark:border-red-400/70">
              ⚠️ {translatedWarning.weather}
            </div>
          )}
          {translatedWarning.soilHealth && (
            <div className="bg-red-100 dark:bg-red-800/30 text-red-900 dark:text-red-200 p-4 rounded-md shadow-sm border-l-4 border-red-500 dark:border-red-400/70">
              ⚠️ {translatedWarning.soilHealth}
            </div>
          )}
          {translatedWarning.cropHealth && (
            <div className="bg-red-100 dark:bg-red-800/30 text-red-900 dark:text-red-200 p-4 rounded-md shadow-sm border-l-4 border-red-500 dark:border-red-400/70">
              ⚠️ {translatedWarning.cropHealth}
            </div>
          )}
        </div>
      )}

      {!translatedWarning || (!translatedWarning.weather && !translatedWarning.soilHealth && !translatedWarning.cropHealth) && (
        <p className="text-gray-700 dark:text-gray-300 mt-4">
          No warnings available.
        </p>
      )}
    </div>
  );
};

export default Warning;
