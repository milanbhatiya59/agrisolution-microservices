import { User } from '../../models/user.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

const getUser = asyncHandler(async (req, res) => {
  const { userClerkId } = req.params;

  const user = await User.findOne({ clerkId: userClerkId });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

export { getUser };