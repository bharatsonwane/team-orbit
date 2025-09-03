import express from "express";
import lookupRoutes from "./lookup.routes";
import userRoutes from "./user.routes";
import ChatRoutes from "./chat.routes";

const routes = express.Router();

routes.use("/lookup", lookupRoutes);
routes.use("/user", userRoutes);
routes.use("/chat", ChatRoutes);

export default routes;
