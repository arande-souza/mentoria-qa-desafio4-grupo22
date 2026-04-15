const request = require('supertest');
const app = require('../../src/app');
const { makeViagem, makeAtividades } = require('../fixtures/viagem.fixture');

describe('API de Viagens', () => {
  describe('POST /viagens', () => {

    // =========================
    // CENÁRIOS PRINCIPAIS
    // =========================

    it('CT17 - deve criar uma nova viagem com dados validos', async () => {
      const viagemData = makeViagem();

      const response = await request(app)
        .post('/viagens')
        .send(viagemData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('number');
      expect(response.body.destino).toBe('Paris, Franca');
      expect(response.body.orcamento).toBe(5000);
      expect(response.body.atividades).toEqual([
        'Visitar a Torre Eiffel',
        'Passear pelo Louvre',
      ]);
      expect(response.body.dias).toBe(7);
      expect(response.body.status).toBe(true);
    });

    it('CT04 - deve retornar erro 409 para destino duplicado', async () => {
      const viagemData = makeViagem({
        destino: 'Destino Duplicado Teste',
        atividades: ['Visitar a Torre Eiffel'],
      });

      const primeira = await request(app).post('/viagens').send(viagemData);
      const response = await request(app).post('/viagens').send(viagemData);

      expect(primeira.status).toBe(201);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'error',
        'Ja existe uma viagem cadastrada para esse destino.'
      );
    });

    it('CT11 - deve retornar sucesso para status = false', async () => {
      const response = await request(app).post('/viagens').send(
        makeViagem({
          destino: 'Viagem ainda nao realizada Teste',
          orcamento: 10,
          atividades: ['Atividade Teste'],
          dias: 5,
          status: false,
        })
      );

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(false);
    });

    it('CT12 - deve retornar sucesso para status = true', async () => {
      const response = await request(app).post('/viagens').send(
        makeViagem({
          destino: 'Viagem realizada Teste',
          orcamento: 10,
          atividades: ['Atividade Teste'],
          dias: 5,
          status: true,
        })
      );

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true);
    });

    it('CT16 - deve retornar erros ao enviar campos vazios', async () => {
      const response = await request(app).post('/viagens').send(
        makeViagem({
          destino: '',
          orcamento: null,
          atividades: [],
          dias: null,
          status: null,
        })
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          "O campo 'destino' nao pode ser vazio.",
          "O campo 'orcamento' deve ser um numero valido.",
          "O campo 'atividades' deve conter entre 1 e 10 itens.",
          "O campo 'dias' deve ser um numero inteiro.",
          "O campo 'status' deve ser um boolean.",
        ])
      );
    });

    // =========================
    // BVA - DESTINO
    // =========================

    const casosDestino = [
      { ct: 'CT01', tamanho: 49, esperado: 201 },
      { ct: 'CT02', tamanho: 50, esperado: 201 },
      { ct: 'CT03', tamanho: 51, esperado: 400 },
    ];

    it.each(casosDestino)(
      '$ct - deve validar destino com $tamanho caracteres',
      async ({ tamanho, esperado }) => {
        const response = await request(app).post('/viagens').send(
          makeViagem({
            destino: 'A'.repeat(tamanho),
            orcamento: 1000,
            atividades: ['Teste'],
            dias: 1,
            status: false,
          })
        );

        expect(response.status).toBe(esperado);
      }
    );

    // =========================
    // BVA - ORÇAMENTO
    // =========================

    const casosOrcamento = [
      { ct: 'CT05', valor: -1, esperado: 400 },
      { ct: 'CT06', valor: 0, esperado: 400 },
      { ct: 'CT07', valor: 0.01, esperado: 201 },
    ];

    it.each(casosOrcamento)(
      '$ct - deve validar orcamento $valor',
      async ({ valor, esperado, ct }) => {
        const response = await request(app).post('/viagens').send(
          makeViagem({
            destino: `Destino-Orcamento-${ct}`,
            orcamento: valor,
            atividades: ['Teste'],
            dias: 1,
            status: false,
          })
        );

        expect(response.status).toBe(esperado);
      }
    );

    // =========================
    // BVA - DIAS
    // =========================

    const casosDias = [
      { ct: 'CT08', dias: 0, esperado: 400 },
      { ct: 'CT09', dias: 1, esperado: 201 },
      { ct: 'CT10', dias: 2, esperado: 201 },
    ];

    it.each(casosDias)(
      '$ct - deve validar dias = $dias',
      async ({ dias, esperado, ct }) => {
        const response = await request(app).post('/viagens').send(
          makeViagem({
            destino: `Destino-Dias-${ct}`,
            orcamento: 1000,
            atividades: ['Teste'],
            dias,
            status: false,
          })
        );

        expect(response.status).toBe(esperado);
      }
    );

    // =========================
    // BVA - ATIVIDADES
    // =========================

    const casosAtividades = [
      { ct: 'CT18', qtd: 0, esperado: 400 },
      { ct: 'CT19', qtd: 1, esperado: 201 },
      { ct: 'CT13', qtd: 9, esperado: 201 },
      { ct: 'CT14', qtd: 10, esperado: 201 },
      { ct: 'CT15', qtd: 11, esperado: 400 },
    ];

    it.each(casosAtividades)(
      '$ct - deve validar quantidade de atividades = $qtd',
      async ({ qtd, esperado, ct }) => {
        const response = await request(app).post('/viagens').send(
          makeViagem({
            destino: `Destino-${ct}`,
            orcamento: 1000,
            atividades: makeAtividades(qtd),
            dias: 5,
            status: false,
          })
        );

        expect(response.status).toBe(esperado);
      }
    );

    // =========================
    // CAMPOS OBRIGATÓRIOS
    // =========================

    const camposObrigatorios = [
      { ct: 'CT20', campo: 'destino' },
      { ct: 'CT21', campo: 'orcamento' },
      { ct: 'CT22', campo: 'atividades' },
      { ct: 'CT23', campo: 'dias' },
      { ct: 'CT24', campo: 'status' },
    ];

    it.each(camposObrigatorios)(
      '$ct - deve retornar erro quando $campo está ausente',
      async ({ campo }) => {
        const viagem = makeViagem();
        delete viagem[campo];

        const response = await request(app).post('/viagens').send(viagem);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(JSON.stringify(response.body.errors)).toContain(campo);
      }
    );

    // =========================
    // VALIDAÇÃO DE TIPOS
    // =========================

    const tiposInvalidos = [
      { ct: 'CT25', campo: 'destino', valor: 123 },
      { ct: 'CT26', campo: 'orcamento', valor: 'quinze mil' },
      { ct: 'CT27', campo: 'atividades', valor: 'Templos' },
      { ct: 'CT28', campo: 'dias', valor: 7.5 },
      { ct: 'CT29', campo: 'status', valor: 'false' },
    ];

    it.each(tiposInvalidos)(
      '$ct - deve validar tipo inválido de $campo',
      async ({ campo, valor }) => {
        const response = await request(app).post('/viagens').send(
          makeViagem({
            [campo]: valor,
          })
        );

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(JSON.stringify(response.body.errors)).toContain(campo);
      }
    );

    // =========================
    // VALIDAÇÕES ESPECÍFICAS
    // =========================

    it('CT30 - atividade vazia', async () => {
      const response = await request(app).post('/viagens').send(
        makeViagem({
          atividades: ['Templos', '   '],
        })
      );

      expect(response.status).toBe(400);
      expect(JSON.stringify(response.body.errors)).toContain('posicao 1');
    });

    it('CT31 - atividade não string', async () => {
      const response = await request(app).post('/viagens').send(
        makeViagem({
          atividades: ['Templos', 99],
        })
      );

      expect(response.status).toBe(400);
      expect(JSON.stringify(response.body.errors)).toContain('posicao 1');
    });

    it('CT34 - destino apenas espaços', async () => {
      const response = await request(app).post('/viagens').send(
        makeViagem({
          destino: '     ',
        })
      );

      expect(response.status).toBe(400);
      expect(JSON.stringify(response.body.errors)).toContain('destino');
    });

    it('CT35 - JSON inválido', async () => {
      const response = await request(app)
        .post('/viagens')
        .set('Content-Type', 'application/json')
        .send('{ destino: Japao, orcamento: }');

      expect(response.status).toBe(400);
    });
  });
});