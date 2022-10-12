import { Router } from 'express';
import { router as personRoutes } from './routes/person_routes';

const router: Router = Router();

//Routes
router.use('/', personRoutes);

export { router };
