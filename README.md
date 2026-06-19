# 🚀 Tech4um

Tech4um é uma aplicação web de fórum em tempo real desenvolvida como desafio técnico, permitindo que usuários criem salas de discussão, participem de conversas públicas e enviem mensagens privadas.

## ✨ Funcionalidades

* Autenticação de usuários com JWT
* Cadastro e login
* Criação de fóruns (salas)
* Listagem de fóruns disponíveis
* Participação em salas de discussão
* Envio de mensagens em tempo real com Socket.IO
* Lista de participantes
* Mensagens privadas
* Interface responsiva inspirada no protótipo do Figma

## 🛠️ Tecnologias Utilizadas

### Frontend

* React
* TypeScript
* Vite
* Axios
* Socket.IO Client
* CSS

### Backend

* Node.js
* Express
* TypeScript
* JWT
* Socket.IO

### Banco de Dados

* MySQL
* Sequelize

## 📂 Estrutura do Projeto

```bash
tech4um/
├── backend/
├── frontend/
└── README.md
```

## ▶️ Executando o Projeto

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Autenticação

A autenticação é realizada utilizando JSON Web Token (JWT). Após o login, o token é armazenado localmente e enviado para as rotas protegidas da aplicação.

## 💬 Comunicação em Tempo Real

O sistema utiliza Socket.IO para permitir:

* Atualização instantânea das mensagens
* Entrada em salas de conversa
* Comunicação em tempo real entre usuários


## 🧪 Testes Automatizados

O projeto conta com testes automatizados de integração para validar as principais funcionalidades da API.

### Tecnologias

* Vitest
* Supertest

### Rotas testadas

#### Autenticação

* `POST /auth/register` — cadastro de usuários
* `POST /auth/login` — autenticação e geração de token JWT

#### Fóruns

* `POST /forums` — criação de fóruns autenticados

#### Mensagens

* `GET /messages/:forumId` — listagem de mensagens de um fórum

### Executando os testes

```bash
cd backend
npm test
```

### Cenários validados

* Cadastro de usuário
* Login com credenciais válidas
* Geração e utilização de token JWT
* Acesso a rotas protegidas
* Criação de fóruns
* Listagem de mensagens por fórum

Resultado esperado:

```txt
✓ deve cadastrar um usuário
✓ deve fazer login
✓ deve criar um fórum
✓ deve listar mensagens de um fórum

Tests 4 passed
```

## 📸 Funcionalidades Demonstradas

* Login e autenticação
* Dashboard de fóruns
* Criação de salas
* Chat em tempo real
* Mensagens privadas
* Navegação entre salas


## 👩‍💻 Desenvolvido por

Jeane Aline Silva de Oliveira

Curso de Análise e Desenvolvimento de Sistemas
