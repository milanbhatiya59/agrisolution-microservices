import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const getSoilCardApiData = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/soilcard`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error: "Failed to upload image. Please try again." };
  }
};

export { getSoilCardApiData };
