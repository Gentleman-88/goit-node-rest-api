import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";

const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw new HttpError(409, error.message);
  }
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "identicon" });
  const newUser = await authServices.signup({
    ...req.body,
    avatarURL,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
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
  const { _id: id } = req.user;
  const { path: oldPath, filename } = req.file;

  Jimp.read(filename)
    .then((avatar) => {
      return avatar.resize(250, 250).quality(60).greyscale().write(filename);
    })
    .catch((err) => {
      console.error(err);
    });

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const newAvatar = path.join("public", "avatars", filename);
  const result = await authServices.updateUserAvatar(id, {
    avatarURL: newAvatar,
  });

  res.json(result);
};

export default {
  signup: signup,
  signin: signin,
  getCurrent: getCurrent,
  signout: signout,
  updateAvatar: updateAvatar,
};
