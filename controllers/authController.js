import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import HttpError from "../helpers/HttpError.js";

const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const avatar = path.join("public", "avatars", filename);
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, error.message);
  }
  const newUser = await authServices.signup({
    ...req.body,
    avatar,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatar: newUser.avatar,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, error.message);
  }
  const comparePassword = await authServices.validatePassword(
    password,
    user.password
  );
  if (!comparePassword) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;

  const paylaod = {
    id,
  };

  const token = jwt.sign(paylaod, process.env.JWT_SECRET, { expiresIn: "23h" });
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;

  res.json({
    email,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });

  res.json({
    message: "Signout success",
  });
};

const updateAvatar = async (req, res) => {
  try {
    const { filename } = req.file;

    const updatedUser = await authServices.updateUserAvatar(
      req.user._id,
      filename
    );

    res.status(200).json({
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default {
  signup: signup,
  signin: signin,
  getCurrent: getCurrent,
  signout: signout,
  updateAvatar: updateAvatar,
};
