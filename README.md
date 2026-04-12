# ✈️ Dream Travel API | mentoria-qa-desafio4-grupo22

API REST desenvolvida em **Node.js + Express** para gerenciamento de viagens dos sonhos.

> 🧪 **Foco principal:** construção de testes automatizados de API utilizando **Supertest**, validando regras de negócio, contratos e cenários de erro.

---

## 🚀 Objetivo

Este projeto tem como principal objetivo **validar uma API através de testes automatizados**, simulando cenários reais de qualidade de software.

A API serve como base para aplicação de testes com foco em:

- Testes de API com **Supertest**
- Validação de contratos de resposta
- Cobertura de cenários positivos e negativos
- Validação de regras de negócio
- Testes de status HTTP (`200`, `201`, `400`, `409`)
- Estruturação de testes para evolução contínua

---

## 🧪 Estratégia de Testes

Os testes foram desenvolvidos utilizando **Supertest**, permitindo validar a API de forma rápida e isolada.

### Principais cenários cobertos:

- ✅ Criação de viagem com dados válidos (Happy Path)
- ❌ Validação de campos obrigatórios
- ❌ Regras de negócio (ex: orçamento inválido, lista de atividades fora do limite)
- ❌ Prevenção de duplicidade de destino (case-insensitive)
- 🔁 Validação de respostas e estrutura do JSON retornado

---

## 🛠️ Tecnologias utilizadas

### API
- Node.js
- Express

### Testes
- Supertest
- Jest (ou framework utilizado)

---

## 💡 Abordagem QA

Este projeto foi estruturado seguindo boas práticas de qualidade:

- Separação entre aplicação e testes
- Cenários organizados por comportamento
- Validação de status code + payload
- Cobertura de casos de erro (não só happy path)
- Preparação para CI/CD

---

## ⚠️ Observação

A API utiliza persistência em memória, sendo ideal para:

- Execução rápida de testes
- Simulação de cenários
- Estudos de automação de API

---

## 🛠️ Tecnologias utilizadas

- Node.js
- Express
- JavaScript

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- Node.js 18 ou superior
- npm

### Instalação
1. Instale as dependencias:

```bash
npm install
```

2. Inicie a API:

```bash
npm start
```

3. Acesse a aplicacao em:

```text
http://localhost:3000
```

## Endpoints

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
### Exemplo com CURL

```bash
curl -X POST http://localhost:3000/viagens \
  -H "Content-Type: application/json" \
  -d "{\"destino\":\"Japão\",\"orcamento\":15000,\"atividades\":[\"Templos\",\"Anime\",\"Culinaria\"],\"dias\":15,\"status\":false}"
```
### GET /viagens

Lista todas as viagens em memoria.

## Regras implementadas

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

## Exemplo com CURL

```bash
curl -X POST http://localhost:3000/viagens \
  -H "Content-Type: application/json" \
  -d "{\"destino\":\"Japão\",\"orcamento\":15000,\"atividades\":[\"Templos\",\"Anime\",\"Culinaria\"],\"dias\":15,\"status\":false}"
```
## Dashboar Histórico de execução
<img width="1920" height="1334" alt="Designer" src="https://github.com/user-attachments/assets/4cfd41d4-4496-422e-9fc7-92e48685ced5" />

### Cenários
<img width="1920" height="1926" alt="image" src="https://github.com/user-attachments/assets/b15ab49d-9bc9-49b9-9760-c351ae17ff87" />







## Participantes 
- Arandê Souza |  arande89@gmail.com
- Aimeê | aimeeas@gmail.com
- Fabiano Pereira | 
- Jaciara | Jaciara_mjss@hotmail.com
- Ricardo Albuquerque | r.albuquerquem@gmail.com




