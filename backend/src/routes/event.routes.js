import { Router } from 'express';
import { ingest, timeline } from '../controllers/event.controller.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  validate(['shipmentId', 'routeId', 'type', 'location']),
  ingest
);

router.get('/:shipmentId', timeline);

export default router;