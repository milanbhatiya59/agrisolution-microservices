import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const createCommunity = async (clerkUserId, communityName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/community/create`, {
      ownerClerkId: clerkUserId,
      communityName: communityName,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error creating farm:", error);
    return { error: "Failed to create farm. Please try again." };
  }
};

export { createCommunity };
