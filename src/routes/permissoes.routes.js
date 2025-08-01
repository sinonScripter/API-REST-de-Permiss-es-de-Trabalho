const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rota para listar todas as permissões de trabalho
router.get('/pt', (req, res) => {
  const query = 'SELECT * FROM permissoes_trabalho';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar permissões:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json(results);
  });
});

module.exports = router;
