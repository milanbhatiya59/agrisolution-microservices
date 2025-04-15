import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import { CORS_ORIGIN } from '../../constants.js';

const app = express();

// ⏱️ Custom timeout handler (right here)
app.use((req, res, next) => {
  res.setTimeout(60000, () => {
    console.log('⏰ Request has timed out.');
    res.status(504).json({ message: 'Gateway Timeout' });
  });
  next();
});

// 📦 Middlewares
app.use(cors({ origin: CORS_ORIGIN, credentials: false }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// 📁 Routes import
import notificationRouter from './notification.routes.js';

// 🔗 Routes declaration
app.use('/api/v1/notification', notificationRouter);

export { app };
