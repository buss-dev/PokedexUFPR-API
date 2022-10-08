import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { database } from '../database';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

const authenticateToken = (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err) => {
    if (err) return res.sendStatus(403);
  });
};

class AuthenticationRoutes {
  public async getUsers(req: Request, res: Response) {
    console.log(authenticateToken(req, res));
    const result = await database.client.query(`SELECT * FROM students`);
    return res.json({
      response: result.rows,
    });
  }

  public async loginUser(req: Request, res: Response) {
    const result = await database.client.query(
      `SELECT * FROM students WHERE email = $1`,
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
    INSERT into students(first_name, last_name, email, password)
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
      DELETE from students
      WHERE id = $1
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
      UPDATE students
      SET first_name = $1, last_name = $2
      WHERE id = $3
      `,
      [firstName, lastName, id]
    );
    return res.json({
      response: `Usuário ${req.body.id} editado`,
    });
  }
}

export const authentication: AuthenticationRoutes = new AuthenticationRoutes();
