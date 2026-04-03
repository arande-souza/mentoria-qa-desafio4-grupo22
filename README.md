# mentoria-qa-desafio4-grupo22

API REST em Node.js com Express para cadastro de viagens dos sonhos, usando persistencia em memoria.

## Requisitos

- Node.js 18 ou superior
- npm

## Como rodar

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
  "destino": "  Tailandia  ",
  "orcamento": 8500.5,
  "atividades": ["Praias", "  Templos  ", "Gastronomia"],
  "duracaoDias": 12,
  "realizada": false
}
```

#### Exemplo de resposta 201

```json
{
  "id": 1,
  "destino": "Tailandia",
  "orcamento": 8500.5,
  "atividades": ["Praias", "Templos", "Gastronomia"],
  "duracaoDias": 12,
  "realizada": false
}
```

### GET /viagens

Lista todas as viagens em memoria.

#### Exemplo de resposta 200

```json
[
  {
    "id": 1,
    "destino": "Tailandia",
    "orcamento": 8500.5,
    "atividades": ["Praias", "Templos", "Gastronomia"],
    "duracaoDias": 12,
    "realizada": false
  }
]
```

## Regras implementadas

- `destino` obrigatorio, string, com trim, nao vazio e maximo de 50 caracteres
- `orcamento` obrigatorio, numero valido e maior que 0
- `atividades` obrigatorio, array com 1 a 10 itens e apenas strings nao vazias
- `duracaoDias` obrigatorio, inteiro e maior ou igual a 1
- `realizada` obrigatorio e boolean
- destino duplicado ignorando maiusculas e minusculas retorna `409`
- erros de validacao retornam `400`
- ID incremental gerado em memoria

## Exemplo com cURL

```bash
curl -X POST http://localhost:3000/viagens \
  -H "Content-Type: application/json" \
  -d "{\"destino\":\"Japao\",\"orcamento\":15000,\"atividades\":[\"Templos\",\"Anime\",\"Culinaria\"],\"duracaoDias\":15,\"realizada\":false}"
```
