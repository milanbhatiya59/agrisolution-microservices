import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const getWarning = async (farmData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/warning`, { farmData });
    return response.data.data.warnings;
  } catch (error) {
    console.error("Error fetching warning:", error);
    return { error: "Failed to get warning." };
  }
};

export { getWarning };
