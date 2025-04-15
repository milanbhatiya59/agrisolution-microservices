import { asyncHandler } from '../../utils/asyncHandler.js'
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Community } from '../../models/community.model.js';
import { User } from '../../models/user.model.js';
import { Message } from '../../models/messages.models.js';

const createCommunity = asyncHandler(async (req, res) => {
  const { ownerClerkId, communityName } = req.body;

  const user = await User.findOne({ clerkId: ownerClerkId });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const community = await Community.create({
    admin: user._id,
    name: communityName,
    members: [user._id],
  });

  if (!community) {
    throw new ApiError(500, 'Community not created');
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        community,
        'Community created successfully with notifications'
      )
    );
});

const getCommunities = async (req, res) => {
  const communities = await Community.find();

  res
    .status(201)
    .json(new ApiResponse(201, communities, 'Community fetched Succesfully'));
};

const getCommunityChat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const community = await Community.findById(id);
  if (!community) {
    throw new ApiError(404, 'Community not found');
  }

  const messages = await Message.find({ community: id }).sort({ createdAt: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, messages, 'Messages fetched successfully'));
});

const createMessage = asyncHandler(async (req, res) => {
  const { communityId, senderClerkId, content } = req.body;

  const user = await User.findOne({ clerkId: senderClerkId });
  if (!user) throw new ApiError(404, 'User not found');

  const community = await Community.findById(communityId);
  if (!community) throw new ApiError(404, 'Community not found');

  const message = await Message.create({
    community: community._id,
    sender: user._id,
    content,
  });

  const populatedMessage = await message.populate('sender', 'clerkId name');

  res.status(201).json(new ApiResponse(201, populatedMessage, 'Message sent'));
});

export { createCommunity, getCommunities, getCommunityChat, createMessage };
