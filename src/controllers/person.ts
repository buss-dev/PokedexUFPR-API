import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
import { database } from '../database-pg';
import { authenticateToken } from '../utils/authenticate_token';
import { postgresToJson } from '../utils/postgres_to_json';

dotenv.config();

interface queryReq extends express.Request {
  query: {
    id: string;
  };
}

const generateAccessToken = (user: any) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '4h',
  });
};

// const validateUniqueEmail = async (email: string, res: Response) => {
//   const result = await database.client.query(
//     `SELECT * FROM person WHERE person_email = $1`,
//     [email]
//   );
//   if (result.rows.length > 0) {
//     res
//       .status(406)
//       .send('{"message": "This e-mail already exists in our database!"}');
//   }
// };

class Person {
  public async getUsers(req: Request, res: Response) {
    try {
      authenticateToken(req, res);
    } catch {}
    const result = await database.client.query(`SELECT * FROM person`);
    return res.json({
      response: result.rows,
    });
  }

  public async loginUser(req: Request, res: Response) {
    const result = await database.client.query(
      `SELECT * FROM person WHERE login_person = $1`,
      [req.body.nameValuePairs.login]
    );

    console.log('AQUI');

    const hasUser = postgresToJson(result).length > 0;

    if (!hasUser) {
      return res.json({ message: 'Usuário não existe' });
    }

    const user = {
      id: result.rows[0][0],
      login: result.rows[0][1],
      password: result.rows[0][2],
    };
    try {
      if (
        await bcrypt.compare(
          req.body.nameValuePairs.password,
          <string>user.password
        )
      ) {
        const token = generateAccessToken(user);
        res.send(
          `{"login": ${req.body.nameValuePairs.login}, "token": "${token}", "message": "Usuário logado com sucesso!"}`
        );
      } else {
        return res.json({ message: 'Login e/ou senha errado(s)' });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  public async registerUser(req: Request, res: Response) {
    // validateUniqueEmail(req.body.email, res);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      login: req.body.login,
      password: hashedPassword,
    };

    const result = await database.client.query(
      `
    INSERT into person(login_person, password_person)
    VALUES ($1,$2) 
    `,
      [user.login, user.password]
    );

    return res.json({
      response: user,
    });
  }

  // public async deleteUser(req: queryReq, res: Response) {
  //   const id: string = req.query.id;
  //   const result = await database.client.query(
  //     `
  //     DELETE from person
  //     WHERE person_id = $1
  //     `,
  //     [id]
  //   );
  //   return res.json({
  //     response: `Usuário ${req.query.id} excluído`,
  //   });
  // }

  // public async editUser(req: Request, res: Response) {
  //   const id: number = req.body.id;
  //   const firstName: string = req.body.firstName;
  //   const lastName: string = req.body.lastName;
  //   const result = await database.client.query(
  //     `
  //     UPDATE person
  //     SET person_first_name = $1, person_last_name = $2
  //     WHERE person_id = $3
  //     `,
  //     [firstName, lastName, id]
  //   );
  //   return res.json({
  //     response: `Usuário ${req.body.id} editado`,
  //   });
  // }
}

export const person: Person = new Person();
