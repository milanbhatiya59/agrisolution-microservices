import axios from "axios";

export const deleteFarmApi = async (farmId) => {
  const response = await axios.delete(`/api/farms/${farmId}`);
  return response.data;
};
