import { asyncHandler } from '../../utils/asyncHandler.js';
import { User } from '../../models/user.model.js';
import { Webhook } from 'svix';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { CLERK_WEBHOOK_SIGNING_SECRET } from '../../constants.js';

const registerClerkUser = asyncHandler(async (req, res) => {
  if (!CLERK_WEBHOOK_SIGNING_SECRET) {
    throw new ApiError(500, 'Missing Clerk Webhook Signing Secret');
  }

  const svixHeaders = req.headers;
  const svixId = svixHeaders['svix-id'];
  const svixTimestamp = svixHeaders['svix-timestamp'];
  const svixSignature = svixHeaders['svix-signature'];

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new ApiError(400, 'Missing Svix headers');
  }

  const payload = req.body;
  const body = JSON.stringify(payload);

  let event;
  try {
    const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    console.error(err);
    throw new ApiError(400, 'Verification error');
  }

  const eventType = event.type;
  const userData = event.data;

  if (eventType === 'user.created') {
    const { id, email_addresses } = userData;
    if (!id || !email_addresses || email_addresses.length === 0) {
      throw new ApiError(400, 'Invalid user data from Clerk');
    }

    const existingUser = await User.findOne({ clerkId: id });
    if (existingUser) {
      throw new ApiError(409, 'User already exists');
    }

    try {
      await User.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        farms: [],
      });
    } catch (error) {
      console.error(error);
      throw new ApiError(500, 'User not created');
    }
  }

  if (eventType === 'user.deleted') {
    const deletedUser = await User.findOneAndDelete({ clerkId: userData.id });

    if (!deletedUser) {
      throw new ApiError(404, 'User not found');
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Webhook processed successfully'));
});

export { registerClerkUser };