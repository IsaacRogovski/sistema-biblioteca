# Minha Biblioteca

Sistema de **gestão de biblioteca** (cadastro de livros) com login e CRUD completo.

- **Frontend:** Angular 22 (componentes standalone, signals, rotas com guard e interceptor HTTP)
- **Backend:** API REST em Node.js + Express, com autenticação por token JWT
- **Dados:** array em memória (pré-cadastrado, não persiste ao reiniciar a API)

## Pré-requisitos

- **Node.js 22.22.3 ou superior** (ou 24.15+). Confira com `node -v`.
- npm (já vem com o Node).

## Como rodar

São dois processos: a **API** (porta 3000) e o **front** (porta 4200). Abra **dois terminais** na pasta do projeto.

**Primeira vez (uma vez só):**

```bash
npm install            # instala o front
npm run api:preparar   # instala o backend e cria backend/.env
```

**Terminal 1 – API:**

```bash
npm run api
```

Deve aparecer `Servidor rodando em http://localhost:3000`.

**Terminal 2 – Front:**

```bash
npm start
```

Abra **http://localhost:4200** no navegador.

> Para o backend reiniciar sozinho ao editar o código, use `npm run api:dev` no lugar de `npm run api`.

### Usuários de teste

| Usuário       | Senha   |
| ------------- | ------- |
| `ADMHENRIQUE` | `12345` |
| `ADMISAAC`    | `12345` |
| `ADMGIOVANNA` | `12345` |

## O que o sistema faz

- **Login** com usuários pré-cadastrados (sem tela de cadastro). Senhas guardadas como hash bcrypt.
- **CRUD de livros:** adicionar, listar, editar e excluir (com confirmação).
- **Busca** no acervo por título, autor, editora ou gênero (ignora acentos).
- **Sair da conta** pelo botão "Sair". Depois de sair, `/biblioteca` volta para o login.
- Sessão expirada ou token inválido: o front encerra a sessão e avisa.

## Rotas da API

| Método   | Rota           | Token? | Descrição                                 |
| -------- | -------------- | ------ | ----------------------------------------- |
| `POST`   | `/login`       | não    | Recebe `{ usuario, senha }`, devolve o token |
| `GET`    | `/livros`      | sim    | Lista todos os livros                     |
| `GET`    | `/livros/:id`  | sim    | Busca um livro                            |
| `POST`   | `/livros`      | sim    | Cadastra um livro (201)                   |
| `PUT`    | `/livros/:id`  | sim    | Atualiza um livro                         |
| `DELETE` | `/livros/:id`  | sim    | Exclui um livro (204)                     |

Sem token (ou com token inválido/expirado), as rotas de `/livros` respondem **401**.

### Objeto Livro (6 propriedades + id)

```json
{ "id": 1, "titulo": "O Hobbit", "autor": "J.R.R. Tolkien", "ano": 1937,
  "editora": "George Allen & Unwin", "paginas": 310, "genero": "Fantasia" }
```

A classe `Livro` (`backend/src/models/livro.js`) tem construtor, getters e setters.

### Testando a API sem o front (curl)

```bash
# 401: sem token
curl -i http://localhost:3000/livros

# login: devolve o token
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" \
  -d '{"usuario":"ADMISAAC","senha":"12345"}'

# usando o token (troque SEU_TOKEN)
curl http://localhost:3000/livros -H "Authorization: Bearer SEU_TOKEN"
```

## Como o token funciona

1. O front envia `POST /login`; a API confere a senha (bcrypt) e devolve um **JWT** válido por 1 hora.
2. O token é guardado no `localStorage` (`AuthService`).
3. O **interceptor** (`auth.interceptor.ts`) anexa `Authorization: Bearer <token>` em toda chamada à API.
4. Se a API responder **401**, o interceptor apaga o token e leva para o login.
5. O **guard** (`auth.guard.ts`) bloqueia `/biblioteca` para quem não tem token válido.

## Estrutura do projeto

```
backend/
  src/
    server.js              rotas da API (login + CRUD)
    models/                classes Livro e Usuario
    data/usuarios.js       usuários pré-cadastrados (senha em hash)
    middlewares/           authMiddleware.js (valida o token)
  .env.example             modelo das variáveis (PORT, JWT_SECRET)
src/app/
  login/                   tela de login
  biblioteca/              tela do acervo (formulário + lista)
  components/toast/        avisos na tela
  services/                AuthService, LivroService, ToastService
  interceptors/            auth.interceptor.ts
  guards/                  auth.guard.ts
  models/livro.ts          interface Livro + validação do formulário
  config.ts                endereço da API
src/styles.css             tema global (cores, fonte, botões, campos)
```

## Testes

```bash
npm test
```

Testes unitários (Vitest) de validação do formulário, `AuthService` e dos componentes de login e biblioteca.

## Problemas comuns

- **"Sem conexão com a API"** na tela: a API não está rodando. Rode `npm run api` em outro terminal.
- **Erro de porta em uso:** feche o processo que usa a 3000/4200, ou mude `PORT` em `backend/.env` e `API_URL` em `src/app/config.ts`.
- **`JWT_SECRET` indefinido / erro ao logar:** rode `npm run api:preparar` para criar o `backend/.env`.
- Os dados voltam ao estado inicial sempre que a API é reiniciada (é um array em memória).
