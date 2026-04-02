import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactByIdService,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContacts = async (req, res) => {
  //get query params
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;

  //Pagination operations
  const parsedPage = Number(page) > 0 ? Number(page) : 1;
  const parsedPerPage = Number(perPage) > 0 ? Number(perPage) : 10;

  //Sorting operations
  const parsedSortBy = sortBy || 'name';
  const parsedSortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

  //Filtering operations
  const filter = {};
  if (req.query.type) filter.contactType = req.query.type;
  if (req.query.isFavourite !== undefined) {
    filter.isFavourite = req.query.isFavourite === 'true'; //Turn the string to boolean
  }

  const contactsData = await getAllContacts({
    page: parsedPage,
    perPage: parsedPerPage,
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
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
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContact = async (req, res) => {
  const { contactId } = req.params;
  const updates = req.body;

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

  res.status(204).send();
};
