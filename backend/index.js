import express from 'express';
import cookieParser from 'cookie-parser';
// import { connectDB, router as dbRouter } from './src/db.js';
import taskRouter from './src/task.js';
import plannerRouter from './src/planner.js';
import authRouter from './src/routes/auth.js';
import cors from 'cors';
// Firebase will be initialized in the auth service

const app = express();
const port = 8080;

// connectDB();
app.use(express.json());
app.use(cookieParser()); // For handling HTTP cookies
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Your frontend URLs
    credentials: true // Allow cookies to be sent
}));

// Routes
// app.use(dbRouter);
app.use('/task', taskRouter);
app.use('/planner', plannerRouter);
app.use('/auth', authRouter);

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export { app, server };