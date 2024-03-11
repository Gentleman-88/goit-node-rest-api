import Contact from "../models/contact.js";

export const listContacts = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);

export const addContact = (data) => Contact.create(data);

export const updateContactId = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const updateContactStatus = (id, favorite) =>
  Contact.findByIdAndUpdate(id, favorite, { new: true, runValidators: true });
