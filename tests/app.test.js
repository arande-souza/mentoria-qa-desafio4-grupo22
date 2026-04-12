const request = require('supertest');
const { app } = require('../app');

describe('API de Viagens', () => {
  describe('POST /viagens', () => {
    it('CT17 - deve criar uma nova viagem com dados validos', async () => {
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

    it('CT04 - deve retornar erro 409 para destino duplicado', async () => {
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

    it('CT12 - deve retornar sucesso para status viagem realizada = true', async () => {
      const viagemData = {
        destino: 'Viagem realizada Teste',
        orcamento: 10.000,
        atividades: ['Atividade Teste'],
        dias: 5,
        status: true,
      };

      const response = await request(app).post('/viagens').send(viagemData).set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true)
    });

    it('CT11 - deve retornar sucesso para status viagem realizada = false', async () => {
      const viagemData = {
        destino: 'Viagem ainda não realizada Teste',
        orcamento: 10.000,
        atividades: ['Atividade Teste'],
        dias: 5,
        status: false,
      };

      const response = await request(app).post('/viagens').send(viagemData).set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(false)
    });

    it('CT16 - deve retornar erros ao enviar campos vazios', async () => {
      const response = await request(app)
        .post('/viagens')
        .send({
          destino: '',
          orcamento: null,
          atividades: [],
          dias: null,
          status: null,
        });

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          "O campo 'destino' nao pode ser vazio.",
          "O campo 'orcamento' deve ser um numero valido.",
          "O campo 'atividades' deve conter entre 1 e 10 itens.",
          "O campo 'dias' deve ser um numero inteiro.",
          "O campo 'status' deve ser um boolean."
        ])
      );
    });
  });

  describe('BVA - campos de validacao', () => {
    const casosDestino = [
      { index: 0, ct: 'CT01', tamanho: 49, esperado: 201 },
      { index: 1, ct: 'CT02', tamanho: 50, esperado: 201 },
      { index: 2, ct: 'CT03', tamanho: 51, esperado: 400 },
    ];

    it.each(casosDestino)('$ct - deve validar destino com $tamanho caracteres', async ({ tamanho, esperado, index }) => {
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
      { index: 0, ct: 'CT06', valor: 0.0, esperado: 400 },
      { index: 1, ct: 'CT07', valor: 0.01, esperado: 201 },
      { index: 2, ct: 'CT05', valor: -1.0, esperado: 400 },
    ];

    it.each(casosOrcamento)('$ct - deve validar orcamento de $valor reais', async ({ valor, esperado, index }) => {
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
      { index: 0, ct: 'CT08', dias: 0, esperado: 400 },
      { index: 1, ct: 'CT09', dias: 1, esperado: 201 },
      { index: 2, ct: 'CT10', dias: 2, esperado: 201 },
    ];

    it.each(casosDias)('$ct - deve validar dias = $dias', async ({ dias, esperado, index }) => {
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

    const casosAtividades = [
      { index: 0, titulo: 'CT18 - deve validar cadastro com 0 atividades', qtd: 0, esperado: 400 },
      { index: 1, titulo: 'CT19 - deve validar cadastro com 1 atividades', qtd: 1, esperado: 201 },
      { index: 2, titulo: 'CT13 - deve validar cadastro com 9 atividades', qtd: 9, esperado: 201 },
      { index: 3, titulo: 'CT14 - deve validar cadastro com 10 atividades', qtd: 10, esperado: 201 },
      { index: 4, titulo: 'CT15 - deve validar cadastro com 11 atividades', qtd: 11, esperado: 400 },
    ];
    const gerarAtividades = (qtd) =>
      Array.from({ length: qtd }, (_, i) => `Atividade ${i + 1}`);

    it.each(casosAtividades)('$titulo', async ({ qtd, esperado, index }) => {
      const response = await request(app)
        .post('/viagens')
        .send({
          destino: `Destino-${index}`,
          orcamento: 1000,
          atividades: gerarAtividades(qtd),
          dias: 5,
          status: false,
        });

      expect(response.status).toBe(esperado);
    });
  });


});
