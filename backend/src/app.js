import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeInput, apiLimiter, authLimiter } from './middleware/security.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// The API runs behind a hosting proxy; trust one hop so rate limiting sees the client IP.
app.set('trust proxy', 1);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(sanitizeInput);

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'GigFlow API is running' });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

export default app;
