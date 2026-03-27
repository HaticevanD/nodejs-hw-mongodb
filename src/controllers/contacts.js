import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactByIdService,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContacts = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createNewContact = async (req, res) => {
  const { name, email, phoneNumber, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(
      400,
      'name, phoneNumber and contactType are required',
    );
  }

  const newContact = await createContact({
    name,
    email,
    phoneNumber,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContact = async (req, res) => {
  const { contactId } = req.params;
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, 'Body cannot be empty');
  }

  const updated = await updateContact(contactId, updates);

  if (!updated) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await deleteContact(contactId);

  if (!deleted) {
    throw createHttpError(404, 'Contact not found');
  }

  return res.status(204).send();
};
