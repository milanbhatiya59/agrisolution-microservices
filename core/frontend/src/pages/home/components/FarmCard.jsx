import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { translateText } from "../../../utils/translate";
import { useLanguage } from "../../../context/LanguageContext";
import { Trash2 } from "lucide-react"; // 👈 Import delete icon

const FarmCard = ({ farm, onDelete }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [translatedData, setTranslatedData] = useState({});

  useEffect(() => {
    const translateFarmDetails = async () => {
      const translations = {
        farmID: await translateText("Farm ID", language),
        location: await translateText("Location", language),
        size: await translateText("Size", language),
        currentCrop: await translateText("Current Crop", language),
        soilSample: await translateText("Soil Sample No", language),
        hectares: await translateText("hectares", language),
        delete: await translateText("Delete", language),
      };
      setTranslatedData(translations);
    };

    translateFarmDetails();
  }, [language]);

  const handleCardClick = () => {
    navigate(`/farm/${farm._id}`);
  };

  return (
    <div className="relative p-6 bg-white dark:bg-gray-700 rounded-xl border-l-4 border-green-600 shadow-md hover:scale-[1.02] transition transform duration-300">
      <div onClick={handleCardClick} className="cursor-pointer">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          🌾 {translatedData.farmID}: {farm._id}
        </div>
        <div className="mt-2 text-gray-700 dark:text-gray-300">
          <strong>📍 {translatedData.location}:</strong>{" "}
          {farm.soilSampleDetails.geoPositionLatitude},{" "}
          {farm.soilSampleDetails.geoPositionLongitude}
        </div>
        <div className="mt-2 text-gray-700 dark:text-gray-300">
          <strong>📏 {translatedData.size}:</strong>{" "}
          {farm.soilSampleDetails.farmSizeInHector} {translatedData.hectares}
        </div>
        <div className="mt-2 text-gray-700 dark:text-gray-300">
          <strong>🌱 {translatedData.currentCrop}:</strong>{" "}
          {farm.currentCrop || "Not Set"}
        </div>
        <div className="mt-2 text-gray-700 dark:text-gray-300">
          <strong>🧪 {translatedData.soilSample}:</strong>{" "}
          {farm.soilSampleDetails.soilSampleNumber || "N/A"}
        </div>
      </div>

      {/* Delete Button with Icon */}
      <button
        onClick={() => onDelete(farm._id)}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md transition"
        title={translatedData.delete}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FarmCard;
