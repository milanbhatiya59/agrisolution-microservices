import { Router } from 'express';
import { getUser } from './user.controller.js';

const router = Router();

router.route('/:userClerkId').get(getUser);

export default router;