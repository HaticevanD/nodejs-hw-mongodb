import { Contact } from '../db/models/contact.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
  userId, //Added
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  //Query object
  //By owner
  const contactsQuery = Contact.find({ userId });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  //Sorting and Pagination
  const contacts = await contactsQuery
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec();

  //Count the filtered number of users (to calculate users on each page)
  const totalItems = await Contact.countDocuments(contactsQuery.getFilter());

  //Calculations
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactByIdService = async (id, userId) => {
  //Use findOne to ensure the ID matches AND it belongs to the user
  return await Contact.findOne({ _id: id, userId });
};

export const createContact = async (payload) => {
  const newContact = await Contact.create(payload);
  return newContact;
};

export const updateContact = async (contactId, userId, payload) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const deleted = await Contact.findOneAndDelete({ _id: contactId, userId });
  return deleted;
};
