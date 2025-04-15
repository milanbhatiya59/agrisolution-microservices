import mongoose, { Schema } from 'mongoose';

const farmSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    currentCrop: { type: String, default: null },
    fertilizerNeeded: [
      {
        name: { type: String, default: null },
        quantity: { type: String, default: null },
      },
    ],
  },
  { timestamps: true }
);

export const Farm = mongoose.model('Farm', farmSchema);
