function validateTripPayload(body) {
  const errors = [];

  if (body.destino === undefined) {
    errors.push("O campo 'destino' e obrigatorio.");
  } else if (typeof body.destino !== 'string') {
    errors.push("O campo 'destino' deve ser uma string.");
  } else {
    const destino = body.destino.trim();

    if (!destino) {
      errors.push("O campo 'destino' nao pode ser vazio.");
    }

    if (destino.length > 50) {
      errors.push("O campo 'destino' deve ter no maximo 50 caracteres.");
    }
  }

  if (body.orcamento === undefined) {
    errors.push("O campo 'orcamento' e obrigatorio.");
  } else if (typeof body.orcamento !== 'number' || Number.isNaN(body.orcamento)) {
    errors.push("O campo 'orcamento' deve ser um numero valido.");
  } else if (body.orcamento <= 0) {
    errors.push("O campo 'orcamento' deve ser maior que 0.");
  }

  if (body.atividades === undefined) {
    errors.push("O campo 'atividades' e obrigatorio.");
  } else if (!Array.isArray(body.atividades)) {
    errors.push("O campo 'atividades' deve ser um array.");
  } else {
    if (body.atividades.length < 1 || body.atividades.length > 10) {
      errors.push("O campo 'atividades' deve conter entre 1 e 10 itens.");
    }

    body.atividades.forEach((atividade, index) => {
      if (typeof atividade !== 'string') {
        errors.push(`A atividade na posicao ${index} deve ser uma string.`);
        return;
      }

      if (!atividade.trim()) {
        errors.push(`A atividade na posicao ${index} nao pode ser vazia.`);
      }
    });
  }

  if (body.dias === undefined) {
    errors.push("O campo 'dias' e obrigatorio.");
  } else if (typeof body.dias !== 'number' || Number.isNaN(body.dias)) {
    errors.push("O campo 'dias' deve ser um numero inteiro.");
  } else if (!Number.isInteger(body.dias)) {
    errors.push("O campo 'dias' deve ser um numero inteiro.");
  } else if (body.dias < 1) {
    errors.push("O campo 'dias' deve ser maior ou igual a 1.");
  }

  if (body.status === undefined) {
    errors.push("O campo 'status' e obrigatorio.");
  } else if (typeof body.status !== 'boolean') {
    errors.push("O campo 'status' deve ser um boolean.");
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    sanitizedData: {
      destino: body.destino.trim(),
      orcamento: body.orcamento,
      atividades: body.atividades.map((atividade) => atividade.trim()),
      dias: body.dias,
      status: body.status,
    },
  };
}

module.exports = {
  validateTripPayload,
};
