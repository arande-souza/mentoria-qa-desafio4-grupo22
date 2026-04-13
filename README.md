# Dream Travel API | mentoria-qa-desafio4-grupo22

API REST desenvolvida em Node.js + Express para cadastro de viagens dos sonhos.

O projeto foi estruturado para servir como base de testes automatizados de API com Jest e Supertest, cobrindo cenarios positivos, negativos, validacoes e regras de negocio.

## Objetivo

Esta API foi criada para apoiar estudos e pratica de:

- testes automatizados de API com Supertest
- validacao de contratos de request/response
- cobertura de cenarios positivos e negativos
- validacao de regras de negocio
- organizacao de projeto com separacao de responsabilidades

## Tecnologias

- Node.js
- Express
- Jest
- Supertest
- Swagger UI Express
- Swagger JSDoc

## Estrutura do projeto

```text
src/
  app.js
  routes/
  controllers/
  services/
  validations/

resources/
  swagger/
    swagger.js

tests/
```

## Arquitetura

- `routes`: definicao dos endpoints
- `controllers`: fluxo HTTP de entrada e saida
- `services`: regras de negocio e persistencia em memoria
- `validations`: validacao de payload
- `src/app.js`: configuracao do Express, middlewares, rotas e exportacao do app

## Como rodar o projeto

### Pre-requisitos

- Node.js 18 ou superior
- npm

### Instalacao

```bash
npm install
```

### Subir a API

```bash
npm start
```

A aplicacao sera iniciada em:

```text
http://localhost:3000
```

## Swagger

Com a API em execucao, acesse:

```text
http://localhost:3000/docs
```

O Swagger documenta os endpoints:

- `POST /viagens`
- `GET /viagens`

## Testes

Para executar os testes automatizados:

```bash
npm test
```

Os testes usam Supertest e continuam consumindo a aplicacao sem precisar alterar os contratos da API.

## Endpoints

### GET /

Retorna informacoes basicas da API.

### POST /viagens

Cria uma nova viagem.

#### Exemplo de body

```json
{
  "destino": "Japao",
  "orcamento": 15000,
  "atividades": ["Templos", "Anime", "Culinaria"],
  "dias": 15,
  "status": false
}
```

#### Exemplo com curl

```bash
curl -X POST http://localhost:3000/viagens \
  -H "Content-Type: application/json" \
  -d "{\"destino\":\"Japao\",\"orcamento\":15000,\"atividades\":[\"Templos\",\"Anime\",\"Culinaria\"],\"dias\":15,\"status\":false}"
```

### GET /viagens

Lista todas as viagens cadastradas em memoria.

Tambem aceita ordenacao via query params:

- `sortBy=id|destino|orcamento|dias|status`
- `order=asc|desc`

#### Exemplo

```bash
curl "http://localhost:3000/viagens?sortBy=destino&order=asc"
```

## Regras implementadas

| Campo | Tipo | Regra | Obrigatorio |
| --- | --- | --- | --- |
| destino | `string` | maximo de 50 caracteres | sim |
| orcamento | `number` | deve ser maior que 0 | sim |
| atividades | `string[]` | deve conter entre 1 e 10 itens | sim |
| dias | `integer` | deve ser maior ou igual a 1 | sim |
| status | `boolean` | aceita apenas `true` ou `false` | sim |

Regras adicionais:

- nao permite cadastrar destinos duplicados, considerando comparacao case-insensitive
- erros de validacao retornam `400`
- duplicidade retorna `409`
- o ID e incremental e gerado em memoria

## Persistencia

A API utiliza persistencia em memoria. Isso torna o projeto leve e adequado para:

- execucao rapida dos testes
- simulacao de cenarios
- estudos de automacao de API

## Dashboard historico de execucao

<img width="1920" height="1334" alt="Designer" src="https://github.com/user-attachments/assets/4cfd41d4-4496-422e-9fc7-92e48685ced5" />

### Cenarios

<img width="1920" height="1926" alt="image" src="https://github.com/user-attachments/assets/b15ab49d-9bc9-49b9-9760-c351ae17ff87" />

## Participantes

- Arande Souza | arande89@gmail.com
- Aimee | aimeeas@gmail.com
- Fabiano Pereira |
- Jaciara | Jaciara_mjss@hotmail.com
- Ricardo Albuquerque | r.albuquerquem@gmail.com
