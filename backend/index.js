import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import eventRoutes from './src/routes/event.routes.js';
import alertRoutes from './src/routes/alert.routes.js';
import routeRoutes from './src/routes/route.routes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.use('/api/events',  eventRoutes);
app.use('/api/alerts',  alertRoutes);
app.use('/api',         routeRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use(errorHandler);
app.get('/',(req,res)=>{
    res.send('Api is running');
})
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server on port ${process.env.PORT || 5000}`);
  });
});