import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { requestLogger } from './middleware/logger.js';

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use('/users', userRoutes);

export default app;
