import * as contactsService from "../services/contactsServices.js";
import fs from "fs/promises";
import path from "path";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";

const avatarPath = path.resolve("public", "avatars");

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await contactsService.listContacts(
      { owner },
      { skip, limit }
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.getOneContact({ _id: id, owner });
    if (!result) {
      throw HttpError(404, error.message);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.removeOneContact({ _id: id, owner });
    if (!result) {
      throw HttpError(404, error.message);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatar = path.join("public", "avatars", filename);
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact({
      ...req.body,
      avatar,
      owner,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { id } = req.params;
    const { _id: owner } = req.user;
    // const result = await contactsService.updateContactId(id, req.body);
    const result = await contactsService.updateOneContact(
      { _id: id, owner },
      req.body
    );
    if (!result) {
      throw HttpError(404, error.message);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const contactStatusUpdate = async (req, res, next) => {
  try {
    const { error } = updateContactStatusSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactsServices.updateContactStatus(id, req.body);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
