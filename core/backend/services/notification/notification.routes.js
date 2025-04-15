import { Router } from 'express';
import { getNotification } from './notification.controller.js';

const router = Router();

router.route('/get/:id').get(getNotification);

export default router;