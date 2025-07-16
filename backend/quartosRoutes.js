const express = require('express');
const router = express.Router();
const pool = require('./db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quartos ORDER BY numero');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar quartos.' });
  }
});


router.post('/', async (req, res) => {
  const { numero, suite, capacidade, preco, tipo_quarto, localizacao } = req.body;
  if (!numero || !suite || !capacidade || !preco) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO quartos (numero, tipo_quarto, capacidade, preco_diaria, disponivel, observacoes) VALUES ($1, $2, $3, $4, true, $5) RETURNING *',
      [numero, tipo_quarto || suite, capacidade, preco, localizacao || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Já existe um quarto com esse número.' });
    } else {
      res.status(500).json({ error: 'Erro ao cadastrar quarto.' });
    }
  }
});

module.exports = router;
