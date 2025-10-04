import express from 'express';
// import { connectDB, router as dbRouter } from './src/db.js';
import taskRouter from './src/task.js';
import cors from 'cors';
import './firebase.js';

const app = express();
const port = 8080;

// connectDB();
app.use(express.json());
app.use(cors());
// app.use(dbRouter);
app.use('/task', taskRouter);

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export { app, server };