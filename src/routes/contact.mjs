import { Router } from 'express';
import { main, sendMessage } from '../controllers/contactController.mjs';

const router = Router();

router.get('/', main);
router.post('/send-message', sendMessage);

export default router;
