import User from "../models/user.js";
import bcrypt from "bcrypt";

export const findUser = (filter) => User.findOne(filter);

export const signup = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const validatePassword = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateUserAvatar = async (userId, avatarURL) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.avatarURL = avatarURL;

    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};

export const deleteUsers = (filter) => User.deleteMany(filter);
