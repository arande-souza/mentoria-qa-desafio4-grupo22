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
mentoria-qa-desafio4-grupo22/
├── src/                # código-fonte da aplicação
│   ├── app.js          # configuração principal do Express
│   ├── controllers/    # camada de controle das requisições
│   ├── routes/         # definição das rotas da API
│   ├── services/       # regras de negócio
│   └── validations/    # validações de entrada
├── resources/          # recursos utilizados pela aplicação
│   └── swagger/        # configuração da documentação Swagger
├── docs/               # documentação de apoio
│   └── Postman/        # collection para testes manuais
├── tests/              # testes automatizados
│   ├── e2e/            # cenários end-to-end da API
│   └── fixtures/       # massa de dados reutilizável
├── scripts/            # scripts auxiliares
├── reports/            # relatórios de execução
├── package.json        # dependências e scripts do projeto
└── README.md           # documentação principal
```
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
Os testes usam Supertest diretamente sobre o app da aplicação, preservando os contratos da API.

### Executar suíte principal com histórico e dashboard dos testes

```bash
npm run test:dash
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

<img width="1920" height="1481" alt="screencapture-file-C-mentoria-qa-desafio4-grupo22-reports-dashboard-html-2026-04-15-12_29_48copia" src="https://github.com/user-attachments/assets/7c0a7088-8a61-46a4-a9c3-464bcc03277e" />


### Cenários

<img width="1520" height="1751" alt="screencapture-file-C-mentoria-qa-desafio4-grupo22-reports-scenarios-html-2026-04-15-12_30_01" src="https://github.com/user-attachments/assets/8a784d59-b74c-43c2-9e25-72571d35a56a" />


---

## 👥 Participantes

- Arandê Souza | arande89@gmail.com
- Aimêe Andrade | aimeeas@gmail.com
- Fabiano Pereira | fab_pereira@hotmail.com
- Maria Jaciara | Jaciara_mjss@hotmail.com
- Ricardo Albuquerque | r.albuquerquem@gmail.com
