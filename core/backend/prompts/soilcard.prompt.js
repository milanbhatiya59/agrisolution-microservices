const soilCardPrompt = `Please analyze the provided image of a Soil Health Card and extract the following information in a structured JSON format.

The extracted JSON should include:

{
  soilHealthCard: {
      soilHealthCardNo: { type: String, default: null },
      validityFrom: { type: String, default: null },
      validityTo: { type: String, default: null },
    },
    farmersDetails: {
      name: { type: String, default: null },
      address: { type: String, default: null },
      village: { type: String, default: null },
      subDistrict: { type: String, default: null },
      district: { type: String, default: null },
      PIN: { type: String, default: null },
    },
    soilSampleDetails: {
      soilSampleNumber: { type: String, default: null },
      surveyNo: { type: String, default: null },
      farmSizeInHector: { type: String, default: null },
      geoPositionLatitude: { type: String, default: null },
      geoPositionLongitude: { type: String, default: null },
    },
    soilTestResults: {
      pH: { type: Number, default: null },
      EC: { type: Number, default: null },
      organicCarbon_OC: { type: Number, default: null },
      availableNitrogen_N: { type: Number, default: null },
      availablePhosphorus_P: { type: Number, default: null },
      availablePotassium_K: { type: Number, default: null },
      availableSulphur_S: { type: Number, default: null },
      availableZinc_Zn: { type: Number, default: null },
      availableBoron_B: { type: Number, default: null },
      availableIron_Fe: { type: Number, default: null },
      availableManganese_Mn: { type: Number, default: null },
      availableCopper_Cu: { type: Number, default: null },
    },
    cropRecommendations: []
}

Using the extracted soil test results, generate an array of at least 10 recommended crops based on soil properties, climatic suitability, and nutrient availability.

Each crop recommendation should have the following fields:
{
  cropName: { type: String },
  season: { type: String },
  fertilizerNeeded: [
    {
      name: { type: String },
      quantity: { type: String },
    }
  ]
}

Ensure that the recommendations are tailored to the soil conditions and that all necessary fields are populated. The response should be valid JSON without markdown formatting. If information is unclear or missing, set values as null.`;

export { soilCardPrompt };