const express = require('express');
const router = express.Router();
const pool = require('./db');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  const { nome, email, senha, usuario, cpf, telefone } = req.body;
  if (!nome || !email || !senha || !usuario) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipo_usuario, ativo) VALUES ($1, $2, $3, $4, $5) RETURNING usuario_id',
      [nome, email, senha, 'Funcionario', true]
    );
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario_id: result.rows[0].usuario_id });
  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email já cadastrado.' });
    } else {
      res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  }
});

router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE (email = $1 OR nome = $1) AND ativo = true',
      [usuario]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo.' });
    }
    const user = result.rows[0];
    if (user.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }
    res.status(200).json({ message: 'Login realizado com sucesso!', usuario_id: user.usuario_id, nome: user.nome, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
});

module.exports = router;
