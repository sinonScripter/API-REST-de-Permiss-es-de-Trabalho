const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db'); // conexão com o banco
const permissoesRoutes = require('./routes/permissoes.routes'); // rotas

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', permissoesRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3001;

// Rota padrão
app.get('/', (req, res) => {
  res.send('API Voro.Tech rodando 🎯');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
