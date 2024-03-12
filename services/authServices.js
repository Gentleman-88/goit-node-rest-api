import User from "../models/user.js";
import bcrypt from "bcrypt";

export const findUser = (filter) => User.findOne(filter);

export const signup = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  User.create({ ...data, password: hashPassword });
};

// export const signin = async;

export const validatePassword = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);
