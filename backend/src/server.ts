import path from "path";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from "http";
import { Server } from "socket.io";

import { envVariable } from "./config/envVariable";
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import apiRoutes from './routes/routes';
import openApiRoutes from './doc/openApiRoutes';
import responseHandler from './middleware/responseHandler';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("joinRoom", ({ userId }) => {
//     socket.join(userId); // joining room using user ID
//   });

//   socket.on("sendMessage", async (data) => {
//     const { senderId, receiverId, message, mediaUrl } = data;

//     // TODO: Implement Chat service when converted to TypeScript
//     // const savedMessage = await Chat.saveMessage({ senderId, receiverId, message, mediaUrl });
//     // io.to(receiverId).emit("receiveMessage", savedMessage);
    
//     console.log("Message received:", { senderId, receiverId, message, mediaUrl });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

const PORT =  envVariable.API_PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler as express.RequestHandler);

// Routes
app.use('/api', apiRoutes);
app.use("/test", (req, res) => res.send("Chat backend is running."));
app.use("/docs", openApiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((req, res, next) => next(new Error("Url not found")));
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📱 Frontend: http://localhost:3000`);
  logger.info(`🔧 Backend API: http://localhost:${PORT}/api`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/docs`);
});

export default app;
