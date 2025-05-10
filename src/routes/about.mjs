import { Router } from 'express';
import { main } from '../controllers/aboutController.mjs';

const router = Router();

router.get('/', main);

export default router;
