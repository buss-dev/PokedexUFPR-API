import { Router } from 'express';
import { firstController } from './app/controller/FirstController';
import { authentication } from './routes/authentication';

const router: Router = Router();

//Routes
router.get('/', firstController.home);
router.get('/users/getAll', authentication.getUsers);
router.post('/users/login', authentication.loginUser);
router.post('/users/register', authentication.registerUser);

export { router };
