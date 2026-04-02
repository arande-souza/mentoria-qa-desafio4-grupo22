# mentoria-qa-desafio4-grupo22

## ✈️ Objetivo do Projeto

Este projeto tem como objetivo desenvolver uma **API de Cadastro de Viagens dos Sonhos**, responsável por gerenciar informações de viagens desejadas ou já realizadas.

A API deve permitir o cadastro dos seguintes dados:

- **Destino**
- **Orçamento**
- **Lista de atividades**
- **Duração em dias**
- **Status de realização**

---

## 📌 Regras de Negócio

### Campos obrigatórios

| Campo | Tipo | Regra |
|------|------|------|
| Destino | `string` | Máximo de 50 caracteres |
| Orçamento | `float` | Deve ser maior que 0,00 |
| Lista de atividades | `string[]` | Deve conter entre 1 e 10 atividades |
| Duração (dias) | `integer` | Deve ser maior ou igual a 1 |
| Realizada | `boolean` | Aceita apenas `true` ou `false` |

### Regras gerais

- Não é permitido cadastrar **destinos duplicados**
- Após o campo **Realizada** ser definido como `true`, seu valor **não poderá ser alterado para `false`**
