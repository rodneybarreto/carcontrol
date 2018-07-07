'use strict';

class AbastecimentoService {

  constructor() { }

  adiciona(abastecimento) {
    return ConnectionFactory.getConnection()
      .then(connection => new AbastecimentoDao(connection))
      .then(dao => dao.adiciona(abastecimento))
      .then(msg => msg)
      .catch(err => err);
  }

  edita(abastecimento) {
    return ConnectionFactory.getConnection()
      .then(connection => new AbastecimentoDao(connection))
      .then(dao => dao.edita(abastecimento))
      .then(msg => msg)
      .catch(err => err);
  }

  remove(id) {
    return ConnectionFactory.getConnection()
      .then(connection => new AbastecimentoDao(connection))
      .then(dao => dao.remove(id))
      .then(msg => msg)
      .catch(err => err);
  }

  busca(id) {
    return ConnectionFactory.getConnection()
      .then(connection => new AbastecimentoDao(connection))
      .then(dao => dao.busca(id))
      .catch(err => err);
  }
  
  buscaAbastecimentos() {
    return ConnectionFactory.getConnection()
      .then(connection => new AbastecimentoDao(connection))
      .then(dao => dao.buscaAbastecimentos())
      .catch(err => err);
  }

  buscaAbastecimentosPorPeriodo(dataIni, dataFim) {
    return this.buscaAbastecimentos()
      .then(abastecimentos => abastecimentos.filter(abast => 
          abast.data.getTime() >= dataIni.getTime() && abast.data.getTime() <= dataFim.getTime()
        )
      )
      .catch(err => err);
  }

}