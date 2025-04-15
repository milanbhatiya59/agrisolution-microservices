import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { Notification } from '../../models/notification.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

const getNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findOne({ farm: id });
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, notification, 'Notification fetched successfully')
    );
});

export { getNotification };