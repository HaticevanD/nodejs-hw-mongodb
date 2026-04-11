import { Router } from 'express';
import {
  getContacts,
  getContactById,
  createNewContact,
  patchContact,
  deleteContactById,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

//Protect all contacts routes
// From this point on, every request MUST have a valid Bearer Token
router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactById));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createNewContact),
);

router.patch(
  '/:contactId',
  upload.single('photo'),
  //validateBody(updateContactSchema),
  ctrlWrapper(patchContact),
);
export default router;
