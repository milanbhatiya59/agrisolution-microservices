import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const getCommunities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/community`);

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response from API");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching communities:", error);
    return { error: "Failed to get communities." };
  }
};

export { getCommunities };
