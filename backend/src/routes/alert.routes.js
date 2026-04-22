import { Router } from 'express';
import { list, resolve } from '../controllers/alert.controller.js';

const router = Router();

router.get('/', list);
router.patch('/:id/resolve', resolve);

export default router;