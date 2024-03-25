import express from "express";
import authController from "../controllers/authController.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

import {
  userSignupSchema,
  userSigninSchema,
  userUpdateAvatar,
} from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.post(
  "/signin",
  validateBody(userSigninSchema),
  authController.signin
);

authRouter.patch(
  "/avatars",
  authenticate,
  validateBody(userUpdateAvatar),
  upload.single("avatarURL"),
  authController.updateAvatar
);

authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/signout", authenticate, authController.signout);

export default authRouter;
