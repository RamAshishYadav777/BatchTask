import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import DatabaseConnection from './app/config/dbcon';
import productApiRoutes from './app/routes/productApiRoutes';

dotenv.config();

const app: Express = express();

// SECURITY & MIDDLEWARE
app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// DATABASE
DatabaseConnection().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// ROUTES
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Backend service is healthy' });
});
app.use('/api/v1', productApiRoutes);

// GLOBAL ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// START
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("==========================================");
  console.log(`STATUS: BACKEND SERVICE RUNNING`);
  console.log(`PORT  : ${port}`);
  console.log(`ENV   : ${process.env.NODE_ENV || 'development'}`);
  console.log("==========================================");
});

