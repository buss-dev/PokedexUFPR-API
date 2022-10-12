import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { database } from '../database-pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../utils/authenticate_token';

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
      `SELECT * FROM person WHERE person_email = $1`,
      [req.body.email]
    );
    const user = {
      firstName: result.rows[0][1],
      lastName: result.rows[0][2],
      email: result.rows[0][3],
      password: result.rows[0][4],
    };
    try {
      if (await bcrypt.compare(req.body.password, <string>user.password)) {
        const token = generateAccessToken(user);
        res.send(`{"message": "Success", "token": "${token}"}`);
      } else {
        res.status(405).send('Not allowed');
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  public async registerUser(req: Request, res: Response) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    };
    const result = await database.client.query(
      `
    INSERT into person(person_first_name, person_last_name, person_email, person_password)
    VALUES ($1,$2,$3,$4) 
    `,
      [user.firstName, user.lastName, user.email, user.password]
    );
    return res.json({
      response: user,
    });
  }

  public async deleteUser(req: queryReq, res: Response) {
    const id: string = req.query.id;
    const result = await database.client.query(
      `
      DELETE from person
      WHERE person_id = $1
      `,
      [id]
    );
    return res.json({
      response: `Usuário ${req.query.id} excluído`,
    });
  }

  public async editUser(req: Request, res: Response) {
    const id: number = req.body.id;
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const result = await database.client.query(
      `
      UPDATE person
      SET person_first_name = $1, person_last_name = $2
      WHERE person_id = $3
      `,
      [firstName, lastName, id]
    );
    return res.json({
      response: `Usuário ${req.body.id} editado`,
    });
  }
}

export const person: Person = new Person();
