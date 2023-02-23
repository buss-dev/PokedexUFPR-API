import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

interface user {
  id: number;
  login: string;
}

export const authenticateToken = (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).send('Is required to be logged');

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err) => {
    if (err) return res.status(403).send('An error ocurred in authentication');
  });

  const user = <user>jwt.decode(token);

  return user;
};
