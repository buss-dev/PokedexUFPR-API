import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import {
  // express,
  Request,
  Response,
} from 'express';
import { database } from '../database-pg';
import { authenticateToken } from '../utils/authenticate_token';
import { postgresToJson } from '../utils/postgres_to_json';

interface user {
  id: number;
  login: string;
}

dotenv.config();

class Pokemon {
  public async getAllPokemons(req: Request, res: Response) {
    try {
      const result = await database.client.query(`
      select
        p.id_pokemon as "idPokemon",
        p.nome_pokemon as "pokemonName",
        tp.nome_tipo_pokemon as "nomeTipoPokemon",
        string_agg(hp.nome_habilidade_pokemon, ',') as "habilidadesPokemon",
        p2.login_person as "nomeCriador",
        p.pokemon_image as "imagemPokemonBase64"
      from
        pokemon p
      left join conjunto_habilidades_pokemon chp on
        chp.id_pokemon = p.id_pokemon
      left join habilidade_pokemon hp on
        hp.id_habilidade_pokemon = chp.id_habilidade_pokemon
      left join tipo_pokemon tp on
        tp.id_tipo_pokemon = p.id_tipo_pokemon
      left join person p2 on
        p2.id_person = p.criado_por
      group by
        p.id_pokemon,
        tp.nome_tipo_pokemon,
        p2.login_person 
      `);
      const pokemons = postgresToJson(result);
      return res.json(pokemons);
    } catch {
      return res.sendStatus(401);
    }
  }

  public async getPokemonById(req: Request, res: Response) {
    try {
      const result = await database.client.query(
        `
      select
        p.id_pokemon as "idPokemon",
        p.nome_pokemon as "pokemonName",
        tp.nome_tipo_pokemon as "nomeTipoPokemon",
        string_agg(hp.nome_habilidade_pokemon, ',') as "habilidadesPokemon",
        p2.login_person as "nomeCriador",
        p.pokemon_image as "imagemPokemonBase64"
      from
        pokemon p
      left join conjunto_habilidades_pokemon chp on
        chp.id_pokemon = p.id_pokemon
      left join habilidade_pokemon hp on
        hp.id_habilidade_pokemon = chp.id_habilidade_pokemon
      left join tipo_pokemon tp on
        tp.id_tipo_pokemon = p.id_tipo_pokemon
      left join person p2 on
        p2.id_person = p.criado_por
      where p.id_pokemon = $1
      group by
        p.id_pokemon,
        tp.nome_tipo_pokemon,
        p2.login_person 
      `,
        [req.body.nameValuePairs.id_pokemon]
      );
      const pokemons = postgresToJson(result);
      console.log(pokemons);
      return res.json(pokemons[0]);
    } catch {
      return res.sendStatus(401);
    }
  }

  public async getAllPokemonsByType(req: Request, res: Response) {
    try {
      const result = await database.client.query(
        `
      select
        p.id_pokemon as "idPokemon",
        p.nome_pokemon as "pokemonName",
        tp.nome_tipo_pokemon as "nomeTipoPokemon",
        string_agg(hp.nome_habilidade_pokemon, ',') as "habilidadesPokemon",
        p2.login_person as "nomeCriador",
        p.pokemon_image as "imagemPokemonBase64"
      from
        pokemon p
      left join conjunto_habilidades_pokemon chp on
        chp.id_pokemon = p.id_pokemon
      left join habilidade_pokemon hp on
        hp.id_habilidade_pokemon = chp.id_habilidade_pokemon
      left join tipo_pokemon tp on
        tp.id_tipo_pokemon = p.id_tipo_pokemon
      left join person p2 on
        p2.id_person = p.criado_por
      where p.id_tipo_pokemon = $1
      group by
        p.id_pokemon,
        tp.nome_tipo_pokemon,
        p2.login_person 
      `,
        [req.body.nameValuePairs.id_tipo_pokemon]
      );
      const pokemons = postgresToJson(result);
      console.log(pokemons);
      return res.json(pokemons);
    } catch (error) {
      return res.send(error).status(401);
    }
  }

  public async getAllPokemonsByAbility(req: Request, res: Response) {
    try {
      const result = await database.client.query(
        `
      select
        p.id_pokemon as "idPokemon",
        p.nome_pokemon as "pokemonName",
        tp.nome_tipo_pokemon as "nomeTipoPokemon",
        string_agg(hp.nome_habilidade_pokemon, ',') as "habilidadesPokemon",
        p2.login_person as "nomeCriador",
        p.pokemon_image as "imagemPokemonBase64"
      from
        pokemon p
      left join conjunto_habilidades_pokemon chp on
        chp.id_pokemon = p.id_pokemon
      left join habilidade_pokemon hp on
        hp.id_habilidade_pokemon = chp.id_habilidade_pokemon
      left join tipo_pokemon tp on
        tp.id_tipo_pokemon = p.id_tipo_pokemon
      left join person p2 on
        p2.id_person = p.criado_por
      where hp.nome_habilidade_pokemon like $1
      group by
        p.id_pokemon,
        tp.nome_tipo_pokemon,
        p2.login_person 
      `,
        ['%' + req.body.nameValuePairs.nome_habilidade_pokemon + '%']
      );
      const pokemons = postgresToJson(result);
      return res.json(pokemons);
    } catch {
      return res.sendStatus(401);
    }
  }

  public async savePokemon(req: Request, res: Response) {
    try {
      const user = <user>authenticateToken(req, res);

      const pokemonMesmoNome = await database.client.query(
        `select * from pokemon where nome_pokemon = $1`,
        [req.body.nameValuePairs.nome_pokemon]
      );

      const jsonPokemonMesmoNome = postgresToJson(pokemonMesmoNome);

      if (jsonPokemonMesmoNome.length > 0) {
        return res
          .json({ message: 'Pokémon com esse nome já existe' })
          .status(401);
      }

      if (user != null) {
        const result = await database.client.query(
          `insert into pokemon (nome_pokemon, id_tipo_pokemon, pokemon_image, criado_por)
          values ($1, $2, $3, $4)`,
          [
            req.body.nameValuePairs.nome_pokemon,
            req.body.nameValuePairs.tipo_pokemon,
            req.body.nameValuePairs.pokemon_image,
            user.id,
          ]
        );

        const idHabilidadePokemon1 =
          req.body.nameValuePairs.id_habilidade_pokemon_1;
        const idHabilidadePokemon2 =
          req.body.nameValuePairs.id_habilidade_pokemon_2;
        const idHabilidadePokemon3 =
          req.body.nameValuePairs.id_habilidade_pokemon_3;

        console.log(idHabilidadePokemon1);
        console.log(idHabilidadePokemon2);
        console.log(idHabilidadePokemon3);

        if (idHabilidadePokemon1 != 0) {
          await database.client.query(
            `
            insert into conjunto_habilidades_pokemon (id_habilidade_pokemon, id_pokemon)
            values ($1, (select id_pokemon from pokemon where nome_pokemon = $2))
            `,
            [idHabilidadePokemon1, req.body.nameValuePairs.nome_pokemon]
          );
        }

        if (idHabilidadePokemon2 != 0) {
          await database.client.query(
            `
            insert into conjunto_habilidades_pokemon (id_habilidade_pokemon, id_pokemon)
            values ($1, (select id_pokemon from pokemon where nome_pokemon = $2))
            `,
            [idHabilidadePokemon2, req.body.nameValuePairs.nome_pokemon]
          );
        }

        if (idHabilidadePokemon3 != 0) {
          await database.client.query(
            `
            insert into conjunto_habilidades_pokemon (id_habilidade_pokemon, id_pokemon)
            values ($1, (select id_pokemon from pokemon where nome_pokemon = $2))
            `,
            [idHabilidadePokemon3, req.body.nameValuePairs.nome_pokemon]
          );
        }

        return res.json({
          message: `Pokémon ${req.body.nameValuePairs.nome_pokemon} criado com sucesso`,
        });
      }
    } catch {
      return res.sendStatus(401);
    }
  }

  public async deletePokemon(req: Request, res: Response) {
    try {
      await database.client.query(
        `
          delete from conjunto_habilidades_pokemon where id_pokemon = $1;
          `,
        [req.body.nameValuePairs.id_pokemon]
      );
      await database.client.query(
        `
          delete from pokemon where id_pokemon = $1;
          `,
        [req.body.nameValuePairs.id_pokemon]
      );
      return res.json({
        message: `Pokémon excluído com sucesso`,
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(401);
    }
  }

  public async savePokemonAbility(req: Request, res: Response) {
    try {
      console.log(req.body.nameValuePairs);
      const result = await database.client.query(
        `
        insert
          into
          habilidade_pokemon (id_habilidade_pokemon,
          nome_habilidade_pokemon,
          id_tipo_pokemon)
        values ((
        select
          id_habilidade_pokemon + 1
        from
          habilidade_pokemon
        order by
          id_habilidade_pokemon desc
        limit 1),
        '$1'::text, $2::int4)
        `,
        [req.body.nome_habilidade_pokemon, req.body.id_tipo_pokemon]
      );
      res.json({ message: 'Habilidade salva' });
    } catch (error) {
      console.log(error);
      return res.status(401).send(error);
    }
  }

  public async getDashboardData(req: Request, res: Response) {
    try {
      const pokemonsQuantity = postgresToJson(
        await database.client.query(
          `
        select
        count(p.id_pokemon)::text as numeros_pokemons
        from
        pokemon p
        `
        )
      );
      const typesQuantity = postgresToJson(
        await database.client.query(
          `
        select
        tp.nome_tipo_pokemon as "nomeTipoPokemon",
        count(p.id_tipo_pokemon)::text as "qtdTipoPokemon"
        from
          pokemon p
        join tipo_pokemon tp on
          tp.id_tipo_pokemon = p.id_tipo_pokemon
        group by
          p.id_tipo_pokemon,
          tp.nome_tipo_pokemon
        order by
          count(p.id_tipo_pokemon) desc
        limit 3
        `
        )
      );
      const abilitiesQuantity = postgresToJson(
        await database.client.query(
          `
        select hp.nome_habilidade_pokemon as "nomeHabilidadePokemon", count(p.id_pokemon)::text as "qtdPokemonHabilidade" from habilidade_pokemon hp 
        join conjunto_habilidades_pokemon chp on chp.id_habilidade_pokemon = hp.id_habilidade_pokemon 
        join pokemon p on p.id_pokemon = chp.id_pokemon 
        group by hp.nome_habilidade_pokemon   
        order by count(p.id_pokemon) desc
     limit 3
        `
        )
      );
      const jsonResponse = {
        quantidade: pokemonsQuantity[0].numeros_pokemons,
        tipos: typesQuantity,
        habilidades: abilitiesQuantity,
      };
      console.log(jsonResponse);
      return res.json(jsonResponse);
    } catch (error) {
      return res.json(error);
    }
  }

  public async getPokemonTypes(req: Request, res: Response) {
    try {
      const result = await database.client.query(
        `select id_tipo_pokemon as "idTipoPokemon", nome_tipo_pokemon as "nomeTipoPokemon" from tipo_pokemon`
      );
      const response = postgresToJson(result);
      res.json(response);
    } catch (error) {
      res.send(error).status(401);
    }
  }

  public async getAllAbilities(req: Request, res: Response) {
    try {
      const result = await database.client.query(
        `
        select 
        id_habilidade_pokemon as "idHabilidadePokemon", 
        nome_habilidade_pokemon as "nomeHabilidadePokemon", 
        id_tipo_pokemon as "idTipoPokemon" 
        from habilidade_pokemon
        `
      );
      res.json(postgresToJson(result));
    } catch (error) {
      res.send(error).status(500);
    }
  }

  public async editPokemon(req: Request, res: Response) {
    try {
      const result = await database.client.query(
        `update pokemon set nome_pokemon = $1, id_tipo_pokemon = $2, pokemon_image = $3
        where id_pokemon = $4`,
        [
          req.body.nameValuePairs.nome_pokemon,
          req.body.nameValuePairs.tipo_pokemon,
          req.body.nameValuePairs.pokemon_image,
          req.body.nameValuePairs.id_pokemon,
        ]
      );

      console.log(req.body.nameValuePairs);

      await database.client.query(
        `delete from conjunto_habilidades_pokemon where id_pokemon = $1`,
        [req.body.nameValuePairs.id_pokemon]
      );

      const idHabilidadePokemon1 =
        req.body.nameValuePairs.id_habilidade_pokemon_1;
      const idHabilidadePokemon2 =
        req.body.nameValuePairs.id_habilidade_pokemon_2;
      const idHabilidadePokemon3 =
        req.body.nameValuePairs.id_habilidade_pokemon_3;

      console.log(idHabilidadePokemon1);
      console.log(idHabilidadePokemon2);
      console.log(idHabilidadePokemon3);

      if (idHabilidadePokemon1 != 0) {
        await database.client.query(
          `
          insert into conjunto_habilidades_pokemon (id_habilidade_pokemon, id_pokemon)
          values ($1, (select id_pokemon from pokemon where nome_pokemon = $2))
          `,
          [idHabilidadePokemon1, req.body.nameValuePairs.nome_pokemon]
        );
      }

      if (idHabilidadePokemon2 != 0) {
        await database.client.query(
          `
          insert into conjunto_habilidades_pokemon (id_habilidade_pokemon, id_pokemon)
          values ($1, (select id_pokemon from pokemon where nome_pokemon = $2))
          `,
          [idHabilidadePokemon2, req.body.nameValuePairs.nome_pokemon]
        );
      }

      if (idHabilidadePokemon3 != 0) {
        await database.client.query(
          `
          insert into conjunto_habilidades_pokemon (id_habilidade_pokemon, id_pokemon)
          values ($1, (select id_pokemon from pokemon where nome_pokemon = $2))
          `,
          [idHabilidadePokemon3, req.body.nameValuePairs.nome_pokemon]
        );
      }
      return res.json({
        message: 'Pokémon editado com sucesso',
      });
    } catch (error) {
      console.log(error);
      res.send(error).status(500);
    }
  }
}

export const pokemon: Pokemon = new Pokemon();
