import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const getNotification = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notification/get/${id}`);

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response from API");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching notification:", error);
    return { error: "Failed to get notification." };
  }
};

export { getNotification };
