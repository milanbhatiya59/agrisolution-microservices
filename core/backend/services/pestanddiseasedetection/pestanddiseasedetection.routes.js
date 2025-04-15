import { Router } from 'express';
import { upload } from '../../middlewares/multer.middleware.js';
import { pestAndDiseaseDetection } from './pestanddiseasedetection.controller.js';

const router = Router();

router.route('/').post(upload.single('image'), pestAndDiseaseDetection);

export default router;