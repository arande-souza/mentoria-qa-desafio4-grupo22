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
  "destino": "Japao",
  "orcamento": 15000,
  "atividades": ["Templos", "Anime", "Culinaria"],
  "dias": 15,
  "status": false
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

## Regras implementadas

| Campo               | Tipo       | Regra                               |
| ------------------- | ---------- | ----------------------------------- | ----------- |
| Destino             | `string`   | Máximo de 50 caracteres             | obrigatorio |
| Orçamento           | `float`    | Deve ser maior que 0,00             | obrigatorio |
| Lista de atividades | `string[]` | Deve conter entre 1 e 10 atividades | obrigatorio |
| Duração (dias)      | `integer`  | Deve ser maior ou igual a 1         | obrigatorio |
| Realizada           | `boolean`  | Aceita apenas `true` ou `false`     | obrigatorio |

- Não deve ser permitido cadastrar destinos duplicados, considerando comparação case-insensitive. O sistema deve retornar status `409` Conflict.
- erros de validacao retornam `400`
- ID incremental gerado em memoria

## Exemplo com cURL

```bash
curl -X POST http://localhost:3000/viagens \
  -H "Content-Type: application/json" \
  -d "{\"destino\":\"Japão\",\"orcamento\":15000,\"atividades\":[\"Templos\",\"Anime\",\"Culinaria\"],\"dias\":15,\"status\":false}"
```
## Dashboar Histórico de execução
<img width="850" height="900" alt="Teste " src="https://github.com/user-attachments/assets/98540fdd-4e80-4fb2-9bb9-ef4ad98a59be" />



