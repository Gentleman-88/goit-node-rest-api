import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

// const { JWT_SECRET } = process.env;
// console.log(JWT_SECRET);

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
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
  res.json({
    token,
  });
};

export default {
  signup: signup,
  signin: signin,
};
