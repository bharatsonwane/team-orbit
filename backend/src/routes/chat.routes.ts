import express from "express";
import RouteRegistrar from "../middleware/RouteRegistrar";
import { authRoleMiddleware } from "../middleware/authRoleMiddleware";
import { getMessagesByChatRoom, sendMessage } from "../controllers/chat.controller";

const router = express.Router();

const registrar = new RouteRegistrar(router, {
  basePath: "/api/chat",
  tags: ["Chat"],
});

registrar.get("/chat/:senderId/:receiverId", {
  controller: getMessagesByChatRoom,
});
/**@description send chat */
registrar.post("/send", {
  controller: sendMessage,
});

export default router;
