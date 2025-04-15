import { useState, useEffect } from "react";
import { getPestAndDiseaseData } from "../../../api/getPestAndDiseaseData";
import { useLanguage } from "../../../context/LanguageContext";
import { translateText } from "../../../utils/translate";

const PestAndDiseaseDetection = ({ farmData }) => {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [pestAndDiseaseData, setPestAndDiseaseData] = useState(null);
  const [translatedData, setTranslatedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [translatedTexts, setTranslatedTexts] = useState({
    title: "Pest & Disease Detection",
    analyzeButton: "Analyze Image",
    analyzing: "Analyzing...",
    processing: "Processing...",
    healthyCrop: "✅ No pests or diseases detected. The crop appears healthy.",
    affectedCrops: "Affected Crops:",
    symptoms: "Symptoms:",
    controlMeasures: "Control Measures:",
    organicMethods: "🌱 Organic Methods:",
    chemicalMethods: "💊 Chemical Methods:",
    invalidFile: "Invalid file type! Please upload a valid image.",
    selectImage: "Please select an image first.",
    fetchError: "Failed to fetch data. Please try again.",
  });

  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
  ];

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!allowedFileTypes.includes(file.type)) {
      setError(translatedTexts.invalidFile);
      return;
    }
    setError(null);
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setPestAndDiseaseData(null);
    setTranslatedData(null);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError(translatedTexts.selectImage);
      return;
    }
    setLoading(true);
    setError(null);
    setPestAndDiseaseData(null);
    setTranslatedData(null);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const response = await getPestAndDiseaseData(formData, farmData);
      setPestAndDiseaseData(response);
    } catch (error) {
      setError(translatedTexts.fetchError);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const translateUI = async () => {
      const updatedTexts = {};
      for (const key in translatedTexts) {
        updatedTexts[key] = await translateText(translatedTexts[key], language);
      }
      setTranslatedTexts(updatedTexts);
    };
    translateUI();
  }, [language]);

  useEffect(() => {
    const translateDiseaseData = async () => {
      if (!pestAndDiseaseData) return;
      const translated = {
        ...pestAndDiseaseData,
        analysis: {
          ...pestAndDiseaseData.analysis,
          name: await translateText(pestAndDiseaseData.analysis.name, language),
          description: await translateText(
            pestAndDiseaseData.analysis.description,
            language
          ),
          affected_crops: await Promise.all(
            pestAndDiseaseData.analysis.affected_crops.map((crop) =>
              translateText(crop, language)
            )
          ),
          symptoms: await Promise.all(
            pestAndDiseaseData.analysis.symptoms.map((symptom) =>
              translateText(symptom, language)
            )
          ),
          control_measures: {
            organic: await Promise.all(
              pestAndDiseaseData.analysis.control_measures.organic.map(
                (method) => translateText(method, language)
              )
            ),
            chemical: await Promise.all(
              pestAndDiseaseData.analysis.control_measures.chemical.map(
                (method) => translateText(method, language)
              )
            ),
          },
        },
      };
      setTranslatedData(translated);
    };
    translateDiseaseData();
  }, [pestAndDiseaseData, language]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-5 text-gray-900 dark:text-gray-100">
        {translatedTexts.title}
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4 block"
      />
      {previewImage && (
        <img
          src={previewImage}
          alt="Selected"
          className="w-52 h-52 object-cover rounded-lg mb-4"
        />
      )}
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? translatedTexts.analyzing : translatedTexts.analyzeButton}
      </button>
      {error && <p className="text-red-500 mt-3">{error}</p>}
      {loading && (
        <p className="text-gray-700 dark:text-gray-300 mt-3">
          {translatedTexts.processing}
        </p>
      )}
      {translatedData && (
        <div className="mt-6">
          {translatedData.analysis.type === "healthy" ? (
            <p className="text-green-600 font-medium">
              {translatedTexts.healthyCrop}
            </p>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-red-500">
                {translatedData.analysis.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {translatedData.analysis.description}
              </p>
              <h4 className="text-lg font-semibold mt-4">
                {translatedTexts.affectedCrops}
              </h4>
              <ul className="list-disc list-inside">
                {translatedData.analysis.affected_crops.map((crop, i) => (
                  <li key={i}>{crop}</li>
                ))}
              </ul>
              <h4 className="text-lg font-semibold mt-4">
                {translatedTexts.symptoms}
              </h4>
              <ul className="list-disc list-inside">
                {translatedData.analysis.symptoms.map((symptom, i) => (
                  <li key={i}>{symptom}</li>
                ))}
              </ul>
              <h4 className="text-lg font-semibold mt-4">
                {translatedTexts.controlMeasures}
              </h4>
              <p className="font-medium text-blue-500 mt-2">
                {translatedTexts.organicMethods}
              </p>
              <ul className="list-disc list-inside">
                {translatedData.analysis.control_measures.organic.map(
                  (method, i) => (
                    <li key={i}>{method}</li>
                  )
                )}
              </ul>
              <p className="font-medium text-red-500 mt-2">
                {translatedTexts.chemicalMethods}
              </p>
              <ul className="list-disc list-inside">
                {translatedData.analysis.control_measures.chemical.map(
                  (method, i) => (
                    <li key={i}>{method}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default PestAndDiseaseDetection;
