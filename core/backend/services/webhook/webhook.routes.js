import { Router } from 'express';
import { registerClerkUser } from './webhook.controller.js';

const router = Router();

router.route('/clerk').post(registerClerkUser);

export default router;