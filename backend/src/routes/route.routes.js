import { Router } from 'express';
import { optimize } from '../controllers/route.controller.js';

const router = Router();

router.post('/optimize', optimize);

export default router;