import { asyncHandler } from '../utils/asyncHandler.js';
import { findOptimalPath } from '../services/route.service.js';

export const optimize = asyncHandler(async (req, res) => {
  const { from, to } = req.body;

  if (!from || !to) {
    return res.status(400).json({ success: false, message: 'from and to are required' });
  }

  const result = await findOptimalPath(from, to);
  res.json({ success: true, data: result });
});