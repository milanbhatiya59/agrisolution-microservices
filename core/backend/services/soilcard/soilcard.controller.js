import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { soilCardPrompt } from '../../prompts/soilcard.prompt.js';
import { callGeminiAPIToGetTextFromImage } from '../../services/gemini.service.js';

const getSoilCardData = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    throw new ApiError(400, 'No file uploaded');
  }

  const mimeType = req.file.mimetype;
  const base64Image = req.file.buffer.toString('base64');

  if (!mimeType) {
    throw new ApiError(
      400,
      'Invalid file type. Only JPEG and PNG are allowed.'
    );
  }

  if (!base64Image || base64Image.length < 50) {
    throw new ApiError(400, 'Invalid or corrupted image data.');
  }

  const responseData = await callGeminiAPIToGetTextFromImage(
    soilCardPrompt,
    base64Image,
    mimeType
  );

  if (!responseData || Object.keys(responseData).length === 0) {
    throw new ApiError(500, 'Failed to retrieve valid data from Gemini API.');
  }

  return res.status(200).json(new ApiResponse(200, responseData, null));
});

export { getSoilCardData };