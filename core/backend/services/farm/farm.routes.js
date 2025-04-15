import { Router } from 'express';
import {
  createFarm,
  getFarmsByowner,
  getFarmById,
} from './farm.controller.js';

const router = Router();

router.route('/create').post(createFarm);
router.route('/get').post(getFarmsByowner);
router.route('/get/:id').get(getFarmById);

export default router;