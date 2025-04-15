import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const getUserFarmsApi = async (clerkUserId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/farm/get`, {
      ownerClerkId: clerkUserId,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching user farms:", error);
    throw error;
  }
};

export { getUserFarmsApi };
