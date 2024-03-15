import Contact from "../models/contact.js";

export const listContacts = (filter, query) =>
  Contact.find(filter, "-createdAt -updatedAt", query).populate(
    "owner",
    "email"
  );

export const getContactById = (id) => Contact.findById(id);
export const getOneContact = (filter) => Contact.findOne(filter);

export const addContact = (data) => Contact.create(data);

export const updateContactId = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const updateOneContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data, { new: true, runValidators: true });

export const removeContact = (id) => Contact.findByIdAndDelete(id);
export const removeOneContact = (filter) => Contact.findOneAndDelete(filter);

export const updateContactStatus = (id, favorite) =>
  Contact.findByIdAndUpdate(id, favorite, { new: true, runValidators: true });
