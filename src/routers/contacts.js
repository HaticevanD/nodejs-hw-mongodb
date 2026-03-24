import { Router } from 'express';
import {
  getContacts,
  getContactById,
  createNewContact,
  patchContact,
  deleteContactById,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(createNewContact));
router.patch('/:contactId', ctrlWrapper(patchContact));
router.delete('/:contactId', ctrlWrapper(deleteContactById));

export default router;
