import express from "express";
import authController from "../controllers/authController.js";
import validateBody from "../decorators/validateBody.js";

import { userSignupSchema, userSigninSchema } from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(userSignupSchema),
  authController.signup
);

export default authRouter;
