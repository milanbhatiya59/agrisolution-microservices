import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { warningPrompt } from '../../prompts/warning.prompt.js';
import { callGeminiAPIToGetText } from '../../services/gemini.service.js';

const getWarning = asyncHandler(async (req, res) => {
  const farmData = req.body.farmData;

  if (!farmData) {
    throw new ApiError(400, 'Missing farm data');
  }

  const responseData = await callGeminiAPIToGetText(warningPrompt, farmData);

  res
    .status(200)
    .json(new ApiResponse(200, responseData, 'Warning retrieved successfully'));
});

export { getWarning };