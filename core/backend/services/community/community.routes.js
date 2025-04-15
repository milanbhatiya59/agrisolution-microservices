import { Router } from 'express';
import {
  createCommunity,
  getCommunities,
  getCommunityChat,
  createMessage,
} from './community.controller.js';

const router = Router();

router.route('/create').post(createCommunity);
router.route('/chats/:id').get(getCommunityChat);
router.route('/chats').post(createMessage);
router.route('/').get(getCommunities);

export default router;
