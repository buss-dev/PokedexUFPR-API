const database = require('../../database');
const express = require('express');
const router = express.Router();

router.get('/getAllStudents', (req, response) => {
  database.query('SELECT * FROM aluno', (error, results) => {
    if (error) {
      throw error;
    } else {
      response.status(200).json(results.rows);
    }
  });
});

router.get('/getStudentById', (req, response) => {
  const id = parseInt(req.query.id);
  database.query(
    'SELECT * FROM aluno where id_aluno = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
});

router.put('/updateStudentById', (req, response) => {
  const id = parseInt(req.query.id);
  const nome_aluno = req.query.nome_aluno;
  database.query(
    'UPDATE aluno SET nome_aluno = $1 WHERE id_aluno = $2',
    [nome_aluno, id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response
          .status(200)
          .json(`Aluno atualizado. Novo nome = ${nome_aluno}`);
      }
    }
  );
});

router.post('/insertNewStudent', (req, response) => {
  const nome_aluno = req.body.nome_aluno;
  database.query(
    'INSERT into aluno(nome_aluno) values ($1)',
    [nome_aluno],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response
          .status(200)
          .json(`Aluno inserido. Nome = ${req.body.nome_aluno}`);
      }
    }
  );
});

router.delete('/deleteStudentById', (req, response) => {
  const id = parseInt(req.query.id);
  database.query(
    'DELETE from aluno WHERE id_aluno = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json(`Aluno removido`);
      }
    }
  );
});

module.exports = router;
