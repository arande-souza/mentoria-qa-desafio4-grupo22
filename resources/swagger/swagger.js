const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Viagens dos Sonhos',
      version: '1.0.0',
      description: 'Documentacao da API REST para cadastro de viagens.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        Viagem: {
          type: 'object',
          required: ['destino', 'orcamento', 'atividades', 'dias', 'status'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            destino: {
              type: 'string',
              maxLength: 50,
              example: 'Paris, Franca',
            },
            orcamento: {
              type: 'number',
              exclusiveMinimum: 0,
              example: 5000,
            },
            atividades: {
              type: 'array',
              minItems: 1,
              maxItems: 10,
              items: {
                type: 'string',
              },
              example: ['Visitar a Torre Eiffel', 'Passear pelo Louvre'],
            },
            dias: {
              type: 'integer',
              minimum: 1,
              example: 7,
            },
            status: {
              type: 'boolean',
              example: true,
            },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        ConflictErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Ja existe uma viagem cadastrada para esse destino.',
            },
          },
        },
      },
      responses: {
        ValidationError: {
          description: 'Erro de validacao',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        DuplicateTrip: {
          description: 'Viagem duplicada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictErrorResponse',
              },
            },
          },
        },
      },
    },
    paths: {
      '/viagens': {
        get: {
          tags: ['Viagens'],
          summary: 'Lista todas as viagens',
          responses: {
            200: {
              description: 'Lista de viagens cadastradas',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Viagem',
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Viagens'],
          summary: 'Cria uma nova viagem',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Viagem',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Viagem criada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Viagem',
                  },
                },
              },
            },
            400: {
              $ref: '#/components/responses/ValidationError',
            },
            409: {
              $ref: '#/components/responses/DuplicateTrip',
            },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJSDoc(options);
