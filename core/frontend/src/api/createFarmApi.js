import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const createFarm = async (clerkUserId, farmData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/farm/create`, {
      ownerClerkId: clerkUserId,
      ...farmData,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error creating farm:", error);
    return { error: "Failed to create farm. Please try again." };
  }
};

export { createFarm };
