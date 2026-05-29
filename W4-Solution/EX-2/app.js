import express from 'express';
import articleRoutes from './routes/articleRoutes.js';
import { requestLogger } from './middleware/logger.js';

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use('/articles', articleRoutes);

export default app;
