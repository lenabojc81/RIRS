import express from 'express';
import { connectDB, router as dbRouter } from './src/db.js';
import transactionRouter from './src/transactions.js';
import cors from 'cors';

const app = express();
const port = 8080;

connectDB();
app.use(express.json());
app.use(cors());
app.use(dbRouter);
app.use('/transaction', transactionRouter);

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export { app, server };