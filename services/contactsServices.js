import Contact from "../models/contact.js";

export const getAllContacts = () => Contact.find();

export const addContact = () => Contact.create(data);
