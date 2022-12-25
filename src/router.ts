import { Router } from 'express';
import { router as personRoutes } from './routes/person_routes';
import { router as accountRoutes } from './routes/account_routes';

const router: Router = Router();

//Routes
router.use('/', personRoutes);
router.use('/', accountRoutes);

export { router };
