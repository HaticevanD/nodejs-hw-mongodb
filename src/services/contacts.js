import { Contact } from '../db/contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactByIdService = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (payload) => {
  const newContact = await Contact.create(payload);
  return newContact;
};

export const updateContact = async (contactId, payload) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const deleted = await Contact.findByIdAndDelete(contactId);
  return deleted;
};
