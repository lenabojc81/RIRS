import express from 'express';
import { connectDB, router as dbRouter } from './src/db.js';

const app = express();
const port = 3000;

connectDB();
app.use(express.json());
app.use(dbRouter);

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export { app, server };