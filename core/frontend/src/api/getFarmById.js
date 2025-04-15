import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const getFarmById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/farm/get/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching farm data:", error);
    return { error: "Failed to get farm data." };
  }
};

export { getFarmById };
