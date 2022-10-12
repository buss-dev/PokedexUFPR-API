import { Router } from 'express';
import { person } from '../controllers/person';

const router: Router = Router();

router.get('/users/getAll', person.getUsers);
router.post('/users/login', person.loginUser);
router.post('/users/register', person.registerUser);
router.delete('/users/delete', person.deleteUser);
router.put('/users/edit', person.editUser);

export { router };
