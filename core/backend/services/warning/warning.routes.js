import { Router } from 'express';
import { getWarning } from './warning.controller.js';

const router = Router();

router.route('/').post(getWarning);

export default router;