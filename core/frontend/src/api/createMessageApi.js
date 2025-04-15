import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const createMessageApi = async ({
  communityId,
  senderClerkId,
  content,
}) => {
  const res = await axios.post(
    `${API_BASE_URL}/community/chats`,
    {
      communityId,
      senderClerkId,
      content,
    }
  );
  return res.data.data;
};

export { createMessageApi };