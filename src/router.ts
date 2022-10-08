import { Router } from 'express';
import { router as authenticationRoutes } from './routes/authenticationRoutes';

const router: Router = Router();

//Routes
router.use('/', authenticationRoutes);

export { router };
