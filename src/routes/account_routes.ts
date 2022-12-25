import { Router } from 'express';
import { account } from '../controllers/account';

const router: Router = Router();

router.post('/account/create', account.newAccount);
router.get('/account/getByOwnerId', account.getAccountByOwnerId);
router.delete('/account/deleteAccount', account.deleteAccountByIdAndAgency);

export { router };
