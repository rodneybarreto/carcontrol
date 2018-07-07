'use strict';

class DateHelper {

  constructor() {
    throw new Error('DateHelper é uma classe estática e não pode ser instanciada.');
  }
  
  static get BACKSPACE() { return 8; }

  static formataData(evt) {
    let data = evt.target;

    if (evt.keyCode !== this.BACKSPACE) {
      if (data.value.length === 2 || data.value.length === 5) 
        data.value = `${data.value}/`;
    }
  }

  static formataHora(evt) {
    let hora = evt.target;

    if (evt.keyCode !== this.BACKSPACE) {
      if (hora.value.length === 2) 
        hora.value = `${hora.value}:`;
    }
  }

  static textoParaData(texto) {
    return new Date(...texto.split('/').reverse().map((item, indice) => item - indice % 2));
  }

  static dataParaTexto(data) {
    let dd = '';
    if (data.getDate().toString().length === 1)
      dd = `0${data.getDate()}`;
    else
      dd = data.getDate().toString();

    let mm = '';
    if ((data.getMonth()+1).toString().length === 1)
      mm = `0${data.getMonth()+1}`;
    else 
      mm = data.getMonth()+1;

    return `${dd}/${mm}/${data.getFullYear()}`;
  }

  static inicioDoMes(data) {
    return new Date(data.getFullYear(), data.getMonth(), 1);
  }

  static finalDoMes(data) {
    return new Date(data.getFullYear(), (data.getMonth()+1), 0);
  }

  static textoParaHora(textoData, textoHora) {
    return new Date(
      ...textoData.split('/').reverse().map((item, indice) => item - indice % 2), 
      ...textoHora.split(':'),
      0,
      0
    );
  }

  static horaParaTexto(hora) {
    let hh = '';
    if (hora.getHours().toString().length === 1)
      hh = `0${hora.getHours()}`;
    else
      hh = hora.getHours().toString();

    let mm = '';
    if (hora.getMinutes().toString().length === 1)
      mm = `0${hora.getMinutes()}`;
    else 
      mm = hora.getMinutes().toString();

    return `${hh}:${mm}`;
  }

  static setDatepicker(frm) {
    let fieldData = frm.querySelectorAll('.cc-field-data');

    fieldData.forEach(elemento => {
      return new Pikaday({
        field: elemento,
        firstDay: 0,
        format: 'DD/MM/YYYY',
        i18n: {
          previousMonth: 'Anterior',
          nextMonth: 'Próximo',
          months: [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'
          ],
          weekdays: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
          weekdaysShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
        }
      }); 
    });
  }
  
}