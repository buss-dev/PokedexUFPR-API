require('dotenv').config();
const express = require('express');
const router = express.Router();
const database = require('../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/users', (req, res) => {
  database.query(`SELECT * FROM students`, (err, results) => {
    if (err) {
      throw err;
    } else {
      res.json(results.rows);
    }
  });
});

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    };
    signUpUser(user, res);
  } catch {
    res.sendStatus(500);
  }
});

router.post('/login', (req, res) => {
  let user = null;
  database.query(
    `
      SELECT * FROM students
      WHERE email = $1
      `,
    [req.body.email],
    async (error, result) => {
      if (error) {
        throw error;
      } else {
        user = result.rows[0];
        if (user == null) {
          return res.status(400).send('Cannot find user');
        }
        try {
          if (await bcrypt.compare(req.body.password, user.password)) {
            const token = generateAccessToken(user);
            res.send(`Success, your token is: ${token}`);
          } else {
            res.send('Not allowed');
          }
        } catch {
          res.sendStatus(500);
        }
      }
    }
  );
});

function signUpUser(user, res) {
  database.query(
    `
    INSERT into students(first_name, last_name, email, password)
    VALUES ($1,$2,$3,$4) 
    `,
    [user.firstName, user.lastName, user.email, user.password],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        res.status(201).send(user);
      }
    }
  );
}

function generateAccessToken(user) {
  // return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = router;
