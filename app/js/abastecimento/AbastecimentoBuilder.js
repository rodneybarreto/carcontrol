'use strict';

class AbastecimentoBuilder {

  constructor() {
    throw new Error('AbastecimentoBuilder é uma classe estática e não pode ser instanciada.');
  }

  static criaAbastecimento(frm, id = new Date().getTime()) {
    return new Abastecimento(
      parseInt(id, 10),
      DateHelper.textoParaData(frm.data.value),
      DateHelper.textoParaHora(frm.data.value, frm.hora.value),
      parseInt(frm.odometro.value, 10),
      parseFloat(frm.preco.value.replace(',','.')),
      parseFloat(frm.litros.value.replace(',','.')),
      frm.combustivel.value
    );
  }

}