import { Router } from 'express';
import { router as personRoutes } from './routes/person_routes';
import { router as pokemonRoutes } from './routes/pokemon_routes';

const router: Router = Router();

//Routes
router.use('/', personRoutes);
router.use('/', pokemonRoutes);

export { router };
