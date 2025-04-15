import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const getUser = async (userClerkId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userClerkId}`);

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response from API");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: "Failed to get user." };
  }
};

export { getUser };
