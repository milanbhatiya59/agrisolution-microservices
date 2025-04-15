import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const getCommunityChats = async (communityId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/community/chats/${communityId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching community chats:", error);
    return { error: "Failed to get community chats." };
  }
};

export { getCommunityChats };
