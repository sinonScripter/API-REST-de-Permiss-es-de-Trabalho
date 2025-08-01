require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Rota inicial
app.get('/', (req, res) => {
  res.send('API Permissions funcionando!');
});

// Listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nome, email, papel FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Cadastrar usuário
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, papel } = req.body;

  if (!nome || !email || !senha || !papel) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)',
      [nome, email, hashedPassword, papel]
    );

    res.status(201).json({ id: result.insertId, nome, email, papel });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error); // <== aqui
    res.status(500).json({ error: 'Erro ao cadastrar usuário.', details: error.message });
  }
});

// Login do usuário
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const usuario = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
});

// Listar permissões
app.get('/permissoes', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        pt.id,
        pt.funcionario,
        pt.setor,
        pt.atividade,
        pt.data,
        pt.status,
        pt.local,
        u.nome AS responsavel
      FROM permissoes_trabalho pt
      JOIN usuarios u ON pt.usuario_id = u.id
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar permissões' });
  }
});

// Cadastrar permissão
app.post('/permissoes', async (req, res) => {
  const { funcionario, setor, atividade, data, status, usuario_id, local } = req.body;

  if (!funcionario || !setor || !atividade || !data || !status || !usuario_id || !local) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO permissoes_trabalho (funcionario, setor, atividade, data, status, usuario_id, local) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [funcionario, setor, atividade, data, status, usuario_id, local]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar permissão.' });
  }
});

// Cadastrar APR
app.post('/apr', async (req, res) => {
  const { permissao_id, checklist, data } = req.body;

  if (!permissao_id || !checklist || !data) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO apr (permissao_id, checklist, data) VALUES (?, ?, ?)',
      [permissao_id, checklist, data]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar APR.' });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, papel } = req.body;

  try {
    // Verificar se usuário existe
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Preparar os dados para atualizar
    let hashedPassword;
    if (senha) {
      hashedPassword = await bcrypt.hash(senha, 10);
    }

    // Atualizar no banco (pode atualizar apenas os campos enviados)
    await pool.query(
      `UPDATE usuarios SET 
        nome = ?, 
        email = ?, 
        senha = COALESCE(?, senha), 
        papel = ? 
      WHERE id = ?`,
      [nome || rows[0].nome, email || rows[0].email, hashedPassword, papel || rows[0].papel, id]
    );

    res.json({ message: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o usuário existe
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Deleta o usuário
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

    res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});



// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
