# API-REST-de-Permiss-es-de-Trabalho

# 🛠️ API REST de Permissões de Trabalho

> Sistema completo para gestão de permissões de trabalho industriais, com controle de acesso, riscos e usuários.  
> **Back-end em Node.js + MySQL** • **Front-end responsivo em React + Tailwind CSS**

---

## 🧩 Visão Geral

Este projeto simula um sistema de controle de **Permissões de Trabalho**, muito usado em indústrias, manutenção técnica e ambientes que exigem **autorizações formais e análises de risco**.

- 🔐 Controle de usuários e papéis (admin, supervisor, técnico)  
- 🧾 Cadastro de permissões com data, setor e responsável  
- ⚠️ Registro de APR (Análise Preliminar de Risco)  
- 📱 Frontend responsivo com React e Tailwind  
- 🔄 API RESTful com autenticação, CRUD e integração real com banco MySQL

---

## 🧱 Estrutura do Projeto

```bash
voro-backend/
├── back-end/
│   └── permissions-api/        ← API com Node.js e MySQL
└── front-end/
    └── permissoes-frontend/    ← Interface web com React + Tailwind
🚀 Tecnologias Utilizadas
🎯 Back-end
Node.js

Express

MySQL

bcrypt

dotenv

mysql2

💻 Front-end
React

Vite

Tailwind CSS

Axios

React Router DOM

📊 Banco de Dados (voro_db)
🧍‍♂️ usuarios
Campo	Tipo	Descrição
id	INT	Chave primária
nome	VARCHAR	Nome do usuário
email	VARCHAR	E-mail único
senha	VARCHAR	Senha criptografada (bcrypt)
papel	ENUM	admin, supervisor, tecnico

🧾 permissoes_trabalho
Campo	Tipo	Descrição
id	INT	Chave primária
funcionario	TEXT	Nome do funcionário
setor	TEXT	Setor de execução
atividade	TEXT	O que será feito
data	DATE	Quando será executado
status	ENUM	Status da permissão
local	TEXT	Local do trabalho
usuario_id	INT FK	Quem autorizou

⚠️ apr (Análise Preliminar de Risco)
Campo	Tipo	Descrição
id	INT	Chave primária
permissao_id	INT FK	Relaciona com a permissão
checklist	TEXT	Informações sobre riscos
data	DATE	Data da análise

🌐 Rotas da API
🔑 Autenticação
POST /login → Login de usuário

👥 Usuários
GET /usuarios → Lista de usuários (sem senha)

POST /usuarios → Cadastra novo usuário

PUT /usuarios/:id → Atualiza usuário

DELETE /usuarios/:id → Remove usuário

🧾 Permissões
GET /permissoes → Lista permissões

POST /permissoes → Cadastra nova permissão

⚠️ Análise de Risco
POST /apr → Cadastra análise de risco (APR)

