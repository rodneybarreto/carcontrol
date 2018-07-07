'use strict';

class NumberHelper {

  constructor() {
    throw new Error('NumberHelper é uma classe estática e não pode ser instanciada.');
  }

  static get BACKSPACE() { return 8; }

  static formataValor(evt, precisao) {
    let valor = evt.target;

    if (evt.keyCode !== this.BACKSPACE) {
      if (valor.value.length === precisao) 
        valor.value = `${valor.value},`;
    }
  }

  static formatCurrency(valor, precisaoMin, precisaoMax) {
    return valor.toLocaleString(
      'pt-BR', 
      { 
        minimumFractionDigits: precisaoMin,
        maximumFractionDigits: precisaoMax
      }
    );
  }
}