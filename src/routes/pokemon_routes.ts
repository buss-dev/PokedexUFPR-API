import { Router } from 'express';
import { pokemon } from '../controllers/pokemon';

const router: Router = Router();

router.get('/pokemon/getAll', pokemon.getAllPokemons);
router.get('/pokemon/getDashboardData', pokemon.getDashboardData);
router.get('/pokemon/getAllTypes', pokemon.getPokemonTypes);
router.get('/pokemon/getAllAbilities', pokemon.getAllAbilities);
router.post('/pokemon/getByType', pokemon.getAllPokemonsByType);
router.post('/pokemon/getByAbility', pokemon.getAllPokemonsByAbility);
router.post('/pokemon/getById', pokemon.getPokemonById);
router.post('/pokemon/savePokemon', pokemon.savePokemon);
router.post('/pokemon/editPokemon', pokemon.editPokemon);
router.post('/pokemon/saveAbility', pokemon.savePokemonAbility);
router.delete('/pokemon/deletePokemon', pokemon.deletePokemon);

export { router };
