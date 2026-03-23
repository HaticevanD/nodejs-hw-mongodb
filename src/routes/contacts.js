import { Router } from 'express';
import { getContacts, getContactById } from '../controllers/contacts.js';

const router = Router();

router.get('/', getContacts);
router.get('/:contactId', getContactById);
export default router;
