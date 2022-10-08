import { Router } from 'express';
import { authentication } from '../controllers/authentication';

const router: Router = Router();

router.get('/users/getAll', authentication.getUsers);
router.post('/users/login', authentication.loginUser);
router.post('/users/register', authentication.registerUser);
router.delete('/users/delete', authentication.deleteUser);
router.put('/users/edit', authentication.editUser);

export { router };
