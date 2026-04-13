# ✈️ Dream Travel API | mentoria-qa-desafio4-grupo22

API REST desenvolvida em **Node.js + Express** para cadastro de viagens dos sonhos.

> 🧪 **Foco principal:** testes automatizados de API com **Jest**, **Supertest** e apoio a execuções com **Newman**, validando regras de negócio, contratos e cenários de erro.

---

## 🚀 Objetivo

Este projeto serve como base para prática de:

- testes automatizados de API
- validação de contratos de request/response
- cobertura de cenários positivos e negativos
- validação de regras de negócio
- organização de backend com separação de responsabilidades
- geração de evidências de execução

---

## 🛠️ Tecnologias

### API
- Node.js
- Express
- Swagger UI Express
- Swagger JSDoc

### Testes
- Jest
- Supertest
- Newman

---

## 📁 Estrutura do projeto

```text
src/
  app.js
  controllers/
    viagemController.js
  routes/
    viagemRoutes.js
  services/
    viagemService.js
  validations/
    viagem.validation.js

resources/
  swagger/
    swagger.js

docs/
  Postman/
    viagens.postman_collection.json

tests/
  e2e/
    viagens.test.js
  fixtures/
    viagem.fixture.js

scripts/
reports/
package.json
README.md
```

---

## 💡 Arquitetura

- `src/app.js`: configura o Express, middlewares, Swagger, rotas e exporta o app
- `controllers`: camada responsável pela entrada e saída HTTP
- `services`: regras de negócio e persistência em memória
- `validations`: validação e sanitização do payload
- `tests/e2e`: cenários end-to-end com Supertest
- `tests/fixtures`: massa de dados reutilizável
- `resources/swagger`: configuração da documentação OpenAPI
- `docs/Postman`: collection para execução via Newman
- `reports`: evidências e histórico das execuções

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- Node.js 18 ou superior
- npm

### Instalação

```bash
npm install
```

### Subir a API

```bash
npm start
```

A API será iniciada em:

```text
http://localhost:3000
```

### Modo desenvolvimento

```bash
npm run dev
```

---

## 📚 Swagger

Com a API em execução, acesse:

```text
http://localhost:3000/docs
```

Endpoints documentados:

- `POST /viagens`
- `GET /viagens`

---

## 🧪 Testes automatizados

### Jest + Supertest

Executa a suíte principal:

```bash
npm test
```

Gera resultado em JSON:

```bash
npm run test:json
```

Os testes usam Supertest diretamente sobre o app da aplicação, preservando os contratos da API.

### Histórico e dashboard

```bash
npm run history:save
npm run history:dashboard
npm run test:history
```

### Postman / Newman

Executa a collection Postman e gera relatório HTML:

```bash
npm run test:postman
```

Relatório gerado em:

```text
reports/newman-report.html
```

### Collection Postman

O projeto possui a collection:

```text
docs/Postman/viagens.postman_collection.json
```

Ela pode ser executada via Newman usando o script já configurado no `package.json`.

#### Como executar

1. Inicie a API:

```bash
npm start
```

2. Em outro terminal, rode a collection com report HTML:

```bash
npm run test:postman
```

Esse comando executa:

```bash
newman run docs/Postman/viagens.postman_collection.json -r "cli,htmlextra" --reporter-htmlextra-export reports/newman-report.html
```

#### Resultado da execução

- saída no terminal com o reporter `cli`
- relatório HTML gerado em `reports/newman-report.html`

#### Quando usar

- validar a collection fora do Jest
- gerar evidência visual de execução
- compartilhar o resultado dos testes com o time

---

## Endpoints

### GET /

Retorna informações básicas da API.

### POST /viagens

Cria uma nova viagem.

#### Exemplo de body JSON

```json
{
  "destino": "Japao",
  "orcamento": 15000,
  "atividades": ["Templos", "Anime", "Culinaria"],
  "dias": 15,
  "status": false
}

```

### GET /viagens

Lista todas as viagens cadastradas em memória.

Também aceita ordenação via query params:

- `sortBy=id|destino|orcamento|dias|status`
- `order=asc|desc`

---

## 📏 Regras implementadas

| Campo               | Tipo       | Regra                               | Obrigatório |
| ------------------- | ---------- | ----------------------------------- | ----------- |
| Destino             | `string`   | Máximo de 50 caracteres             | SIM |
| Orçamento           | `float`    | Deve ser maior que 0,00             | SIM |
| Lista de atividades | `string[]` | Deve conter entre 1 e 10 atividades | SIM |
| Duração (dias)      | `integer`  | Deve ser maior ou igual a 1         | SIM |
| Realizada           | `boolean`  | Aceita apenas `true` ou `false`     | SIM |

- Não deve ser permitido cadastrar destinos duplicados, considerando comparação case-insensitive. O sistema deve retornar status `409` Conflict.
- erros de validacao retornam `400`
- ID incremental gerado em memoria

---

#### Exemplo cURL

```bash
curl -X POST http://localhost:3000/viagens \
  -H "Content-Type: application/json" \
  -d "{\"destino\":\"Japão\",\"orcamento\":15000,\"atividades\":[\"Templos\",\"Anime\",\"Culinaria\"],\"dias\":15,\"status\":false}"
```

## ⚠️ Persistência

A API utiliza persistência em memória. Isso torna o projeto leve e adequado para:

- execução rápida dos testes
- simulação de cenários
- estudos de automação de API

---

## 📊 Dashboard Histórico de execução

<img width="1920" height="1334" alt="Designer" src="https://github.com/user-attachments/assets/4cfd41d4-4496-422e-9fc7-92e48685ced5" />

### Cenários

<img width="1920" height="1926" alt="image" src="https://github.com/user-attachments/assets/b15ab49d-9bc9-49b9-9760-c351ae17ff87" />

---

## 👥 Participantes

- Arande Souza | arande89@gmail.com
- Aimee | aimeeas@gmail.com
- Fabiano Pereira |
- Jaciara | Jaciara_mjss@hotmail.com
- Ricardo Albuquerque | r.albuquerquem@gmail.com
