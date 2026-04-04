const request = require('supertest');
const { app } = require('../app');

describe('API de Viagens', () => {
  describe('POST /viagens', () => {
    it('deve criar uma nova viagem com dados validos', async () => {
      const viagemData = {
        destino: 'Paris, Franca',
        orcamento: 5000.0,
        atividades: ['Visitar a Torre Eiffel', 'Passear pelo Louvre'],
        dias: 7,
        status: true,
      };

      const response = await request(app).post('/viagens').send(viagemData).set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('number');
      expect(response.body.destino).toBe('Paris, Franca');
      expect(response.body.orcamento).toBe(5000);
      expect(response.body.atividades).toEqual(['Visitar a Torre Eiffel', 'Passear pelo Louvre']);
      expect(response.body.dias).toBe(7);
      expect(response.body.status).toBe(true);
    });

    it('deve retornar erro 409 para destino duplicado', async () => {
      const viagemData = {
        destino: 'Destino Duplicado Teste',
        orcamento: 5000.0,
        atividades: ['Visitar a Torre Eiffel'],
        dias: 7,
        status: true,
      };

      const primeiraResposta = await request(app).post('/viagens').send(viagemData);

      const response = await request(app).post('/viagens').send(viagemData).set('Content-Type', 'application/json');

      expect(primeiraResposta.status).toBe(201);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Ja existe uma viagem cadastrada para esse destino.');
    });
  });

  describe('BVA - campos de validacao', () => {
    const casosDestino = [
      { index: 0, tamanho: 49, esperado: 201 },
      { index: 1, tamanho: 50, esperado: 201 },
      { index: 2, tamanho: 51, esperado: 400 },
    ];

    it.each(casosDestino)('deve validar destino com $tamanho caracteres', async ({ tamanho, esperado, index }) => {
      const destino = `${'A'.repeat(tamanho)}`;

      const response = await request(app)
        .post('/viagens')
        .send({
          destino,
          orcamento: 1000,
          atividades: ['Teste'],
          dias: 1,
          status: false,
        });

      expect(response.status).toBe(esperado);
    });

    const casosOrcamento = [
      { index: 0, valor: 0.0, esperado: 400 },
      { index: 1, valor: 0.01, esperado: 201 },
      { index: 2, valor: -1.0, esperado: 400 },
    ];

    it.each(casosOrcamento)('deve validar orcamento de $valor reais', async ({ valor, esperado, index }) => {
      const response = await request(app)
        .post('/viagens')
        .send({
          destino: `Destino-Orcamento-${index}`,
          orcamento: valor,
          atividades: ['Teste'],
          dias: 1,
          status: false,
        });

      expect(response.status).toBe(esperado);
    });

    const casosDias = [
      { index: 0, dias: 0, esperado: 400 },
      { index: 1, dias: 1, esperado: 201 },
      { index: 2, dias: 2, esperado: 201 },
    ];

    it.each(casosDias)('deve validar dias = $dias', async ({ dias, esperado, index }) => {
      const response = await request(app)
        .post('/viagens')
        .send({
          destino: `Destino-Dias-${index}`,
          orcamento: 1000,
          atividades: ['Teste'],
          dias,
          status: false,
        });

      expect(response.status).toBe(esperado);
    });
  });
});