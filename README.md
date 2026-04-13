# Dream Travel API | mentoria-qa-desafio4-grupo22

API REST desenvolvida em Node.js + Express para cadastro de viagens dos sonhos.

O projeto foi organizado para manter a API simples, mas com uma estrutura profissional para backend e QA, incluindo testes automatizados com Jest + Supertest, documentacao Swagger e apoio a execucoes com Newman.

## Objetivo

Este projeto serve como base para pratica de:

- testes automatizados de API
- validacao de contratos e regras de negocio
- organizacao de backend por responsabilidade
- documentacao de endpoints
- geracao de evidencias de execucao

## Tecnologias

- Node.js
- Express
- Jest
- Supertest
- Swagger UI Express
- Swagger JSDoc
- Newman

## Estrutura do projeto

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
```

## Arquitetura

- `src/app.js`: configuracao do Express, middlewares, Swagger, rotas e exportacao do app
- `controllers`: controle de entrada e saida HTTP
- `services`: regras de negocio e persistencia em memoria
- `validations`: validacao e sanitizacao do payload
- `tests/fixtures`: dados reutilizaveis para os testes
- `tests/e2e`: cenarios end-to-end da API com Supertest
- `resources/swagger`: configuracao da documentacao OpenAPI
- `docs/Postman`: collection para execucao via Newman
- `reports`: evidencias e historico das execucoes

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

A API sera iniciada em:

```text
http://localhost:3000
```

### Modo desenvolvimento

```bash
npm run dev
```

## Swagger

Com a API em execucao, acesse:

```text
http://localhost:3000/docs
```

Endpoints documentados:

- `POST /viagens`
- `GET /viagens`

## Testes automatizados

### Jest + Supertest

Executa a suite principal:

```bash
npm test
```

Gera resultado em JSON:

```bash
npm run test:json
```

Os testes usam Supertest diretamente sobre o app da aplicacao, preservando os contratos da API.

### Historico e dashboard

```bash
npm run history:save
npm run history:dashboard
npm run test:history
```

### Postman / Newman

Executa a collection Postman e gera relatorio HTML:

```bash
npm run test:postman
```

Relatorio gerado em:

```text
reports/newman-report.html
```

### Collection Postman

O projeto possui a collection:

```text
docs/Postman/viagens.postman_collection.json
```

Ela pode ser executada via Newman usando o script ja configurado no `package.json`.

#### Como executar

1. Inicie a API:

```bash
npm start
```

2. Em outro terminal, rode a collection com report HTML:

```bash
npm run test:postman
```

Esse comando executa o script abaixo do `package.json`:

```bash
newman run docs/Postman/viagens.postman_collection.json -r "cli,htmlextra" --reporter-htmlextra-export reports/newman-report.html
```

#### Resultado da execucao

- saida no terminal com o reporter `cli`
- relatorio HTML gerado em `reports/newman-report.html`

#### Quando usar

- validar a collection fora do Jest
- gerar evidencia visual de execucao
- compartilhar o resultado dos testes com o time

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

## Evidencias

Arquivos de apoio e evidencias ficam em `reports/`, incluindo:

- historico de execucao
- dashboards HTML
- resultado em JSON dos testes
- relatorio HTML do Newman

## Participantes

- Arande Souza | arande89@gmail.com
- Aimee | aimeeas@gmail.com
- Fabiano Pereira |
- Jaciara | Jaciara_mjss@hotmail.com
- Ricardo Albuquerque | r.albuquerquem@gmail.com
