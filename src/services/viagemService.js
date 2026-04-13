const viagens = [];
const nextId = { value: 1 };
const allowedSortFields = ['id', 'destino', 'orcamento', 'dias', 'status'];

function findTripByDestination(destino) {
  return viagens.find((viagem) => viagem.destino.toLowerCase() === destino.toLowerCase());
}

function createTrip(sanitizedData) {
  if (findTripByDestination(sanitizedData.destino)) {
    return {
      success: false,
    };
  }

  const novaViagem = {
    id: nextId.value++,
    ...sanitizedData,
  };

  viagens.push(novaViagem);

  return {
    success: true,
    trip: novaViagem,
  };
}

function listTrips({ sortBy = 'id', order = 'asc' } = {}) {
  if (!allowedSortFields.includes(sortBy)) {
    return {
      success: false,
      error: `Campo sortBy invalido. Valores aceitos: ${allowedSortFields.join(', ')}`,
    };
  }

  const normalizedOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';

  const sortedViagens = [...viagens].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return normalizedOrder === 'asc' ? valueA.localeCompare(valueB, 'pt-BR') : valueB.localeCompare(valueA, 'pt-BR');
    }

    if (valueA < valueB) return normalizedOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return normalizedOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return {
    success: true,
    data: sortedViagens,
  };
}

module.exports = {
  viagens,
  nextId,
  allowedSortFields,
  findTripByDestination,
  createTrip,
  listTrips,
};
