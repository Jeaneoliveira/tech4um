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
