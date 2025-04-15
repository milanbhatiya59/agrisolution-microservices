import { useState, useEffect } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { translateText } from "../../../utils/translate";

const FarmDetails = ({ farmData }) => {
  const { language } = useLanguage();
  const [translatedLabels, setTranslatedLabels] = useState({});
  const [translatedData, setTranslatedData] = useState(null);

  const labels = {
    loading: "Loading farm details...",
    farmerDetails: "Farmer Details",
    name: "Name",
    address: "Address",
    village: "Village",
    subDistrict: "Sub-District",
    district: "District",
    pin: "PIN",
    soilHealthCard: "Soil Health Card",
    cardNumber: "Card Number",
    validity: "Validity",
    soilSampleDetails: "Soil Sample Details",
    sampleNumber: "Sample Number",
    surveyNumber: "Survey Number",
    farmSize: "Farm Size (Hectares)",
    latitude: "Latitude",
    longitude: "Longitude",
    soilTestResults: "Soil Test Results",
    noTestResults: "No soil test results available.",
    currentCrop: "Current Crop",
    fertilizerNeeded: "Fertilizer Needed",
    noFertilizer: "No fertilizer needed",
  };

  useEffect(() => {
    const translateContent = async () => {
      const translatedLabelsObj = {};
      for (const key in labels) {
        translatedLabelsObj[key] = await translateText(labels[key], language);
      }
      setTranslatedLabels(translatedLabelsObj);

      if (farmData) {
        const translatedFarmData = {
          farmersDetails: {
            name: farmData.farmersDetails?.name
              ? await translateText(farmData.farmersDetails.name, language)
              : "N/A",
            address: farmData.farmersDetails?.address
              ? await translateText(farmData.farmersDetails.address, language)
              : "N/A",
            village: farmData.farmersDetails?.village
              ? await translateText(farmData.farmersDetails.village, language)
              : "N/A",
            subDistrict: farmData.farmersDetails?.subDistrict
              ? await translateText(
                  farmData.farmersDetails.subDistrict,
                  language
                )
              : "N/A",
            district: farmData.farmersDetails?.district
              ? await translateText(farmData.farmersDetails.district, language)
              : "N/A",
            PIN: farmData.farmersDetails?.PIN || "N/A",
          },
          soilHealthCard: {
            soilHealthCardNo:
              farmData.soilHealthCard?.soilHealthCardNo || "N/A",
            validityFrom: farmData.soilHealthCard?.validityFrom || "N/A",
            validityTo: farmData.soilHealthCard?.validityTo || "N/A",
          },
          soilSampleDetails: {
            soilSampleNumber:
              farmData.soilSampleDetails?.soilSampleNumber || "N/A",
            surveyNo: farmData.soilSampleDetails?.surveyNo || "N/A",
            farmSizeInHector:
              farmData.soilSampleDetails?.farmSizeInHector || "N/A",
            geoPositionLatitude:
              farmData.soilSampleDetails?.geoPositionLatitude || "N/A",
            geoPositionLongitude:
              farmData.soilSampleDetails?.geoPositionLongitude || "N/A",
          },
          soilTestResults: farmData.soilTestResults || {},
          currentCrop: farmData.currentCrop
            ? await translateText(farmData.currentCrop, language)
            : "N/A",
          fertilizerNeeded: farmData.fertilizerNeeded?.length
            ? await Promise.all(
                farmData.fertilizerNeeded.map(async (fertilizer) => ({
                  name: await translateText(fertilizer.name, language),
                  quantity: fertilizer.quantity,
                }))
              )
            : [],
        };
        setTranslatedData(translatedFarmData);
      }
    };

    translateContent();
  }, [language, farmData]);

  if (!farmData || !translatedData) {
    return (
      <div className="w-2/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <p>{translatedLabels.loading || "Loading farm details..."}</p>
      </div>
    );
  }

  const renderFieldGroup = (fields) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {fields.map(({ label, value }, index) => (
        <div
          key={index}
          className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {label}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-2/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      {/* Farmer Details */}
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        {translatedLabels.farmerDetails}
      </h2>
      {renderFieldGroup([
        {
          label: translatedLabels.name,
          value: translatedData.farmersDetails.name,
        },
        {
          label: translatedLabels.address,
          value: translatedData.farmersDetails.address,
        },
        {
          label: translatedLabels.village,
          value: translatedData.farmersDetails.village,
        },
        {
          label: translatedLabels.subDistrict,
          value: translatedData.farmersDetails.subDistrict,
        },
        {
          label: translatedLabels.district,
          value: translatedData.farmersDetails.district,
        },
        {
          label: translatedLabels.pin,
          value: translatedData.farmersDetails.PIN,
        },
      ])}

      {/* Current Crop */}
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-600">
        {translatedLabels.currentCrop}
      </h2>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm mb-6">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {translatedData.currentCrop}
        </p>
      </div>

      {/* Fertilizer Needed */}
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        {translatedLabels.fertilizerNeeded}
      </h2>
      {translatedData.fertilizerNeeded.length > 0 ? (
        renderFieldGroup(
          translatedData.fertilizerNeeded.map((item) => ({
            label: item.name,
            value: item.quantity,
          }))
        )
      ) : (
        <p>{translatedLabels.noFertilizer}</p>
      )}

      {/* Soil Health Card */}
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        {translatedLabels.soilHealthCard}
      </h2>
      {renderFieldGroup([
        {
          label: translatedLabels.cardNumber,
          value: translatedData.soilHealthCard.soilHealthCardNo,
        },
        {
          label: translatedLabels.validity,
          value: `${translatedData.soilHealthCard.validityFrom} - ${translatedData.soilHealthCard.validityTo}`,
        },
      ])}

      {/* Soil Sample Details */}
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        {translatedLabels.soilSampleDetails}
      </h2>
      {renderFieldGroup([
        {
          label: translatedLabels.sampleNumber,
          value: translatedData.soilSampleDetails.soilSampleNumber,
        },
        {
          label: translatedLabels.surveyNumber,
          value: translatedData.soilSampleDetails.surveyNo,
        },
        {
          label: translatedLabels.farmSize,
          value: translatedData.soilSampleDetails.farmSizeInHector,
        },
        {
          label: translatedLabels.latitude,
          value: translatedData.soilSampleDetails.geoPositionLatitude,
        },
        {
          label: translatedLabels.longitude,
          value: translatedData.soilSampleDetails.geoPositionLongitude,
        },
      ])}

      {/* Soil Test Results */}
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        {translatedLabels.soilTestResults}
      </h2>
      {Object.keys(translatedData.soilTestResults).length > 0 ? (
        renderFieldGroup(
          Object.entries(translatedData.soilTestResults).map(
            ([key, value]) => ({
              label: key.replace(/_/g, " "),
              value: value ?? "N/A",
            })
          )
        )
      ) : (
        <p>{translatedLabels.noTestResults}</p>
      )}
    </div>
  );
};

export default FarmDetails;
