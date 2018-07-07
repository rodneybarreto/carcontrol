'use strict';

class AbastecimentoView {

  constructor() {
    this._element = document.querySelector('main');
  }

  listaTodos(abastecimentos) {

    if (abastecimentos.length > 0) {
      this._element.innerHTML = `${abastecimentos.reverse().map((obj, key, arr) => {
        
        let distancia = ((key + 1) < arr.length) ? obj.odometro - arr[(key + 1)].odometro : 0;
        let kmPorLitro = (distancia !== 0 && ((key + 1) < arr.length)) ? distancia / arr[(key + 1)].litros : 0; 
        let total = obj.preco * obj.litros;
  
        return `
          <div class="w3-panel w3-white w3-text-theme w3-card-2 w3-display-container">
            <div class="w3-row">
              <div class="w3-col s6">
                <p>
                  ODO ${obj.odometro} Km<br>
                  ${obj.combustivel } (R$ ${NumberHelper.formatCurrency(obj.preco, 3, 3)})<br>
                  Volume: ${NumberHelper.formatCurrency(obj.litros, 3, 3)} L<br>
                  Total: R$ ${NumberHelper.formatCurrency(total, 2, 2)}
                </p>
              </div>
              <div class="w3-col s6">
                <p class="w3-right">
                  ${DateHelper.dataParaTexto(obj.data)} ${DateHelper.horaParaTexto(obj.hora)}<br>
                  Autonomia: ${distancia} Km<br>
                  Média: ${NumberHelper.formatCurrency(kmPorLitro, 1, 1)} Km/L
                </p>
              </div>
              <div class="w3-show-inline-block w3-right">
                <div class="w3-bar">
                  <a href="#" class="w3-button" onclick="app.controller.abastecimento.abreFormEdicao(event, ${obj.id})">
                    <i class="material-icons w3-large">edit</i>
                  </a>
                  <a href="#" class="w3-button" onclick="app.controller.abastecimento.abreDialog(event, ${obj.id})">
                    <i class="material-icons w3-large">delete</i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
      <footer class="w3-bottom cc-footer">
        <div class="w3-container" style="position: relative;">
          <a class="w3-button w3-xlarge w3-circle w3-theme-action" 
          style="position: absolute; top: -70px; right: 28px;" 
          href="#" onclick="app.controller.abastecimento.abreFormInclusao(event)">+</a>
        </div>
      </footer>`;
    } 
    else {
      this._element.innerHTML = `
        ${this.registroNaoEncontrado()}
        <footer class="w3-bottom cc-footer">
          <div class="w3-container" style="position: relative;">
            <a class="w3-button w3-xlarge w3-circle w3-theme-action" 
            style="position: absolute; top: -70px; right: 28px;" 
            href="#" onclick="app.controller.abastecimento.abreFormInclusao(event)">+</a>
          </div>
        </footer>
      `;
    }
  }

  registroNaoEncontrado() {
    return `
      <div class="w3-panel w3-white w3-text-theme w3-card-2 w3-display-container">
        <div class="w3-row">
          <div class="w3-col s12">
            <h4>Nenhum abastecimento encontrado.</h4>
          </div>
        </div>
      </div>
    `;
  }

  populaForm(abastecimento, frm) {
    frm.abastecimentoId.value = abastecimento.id;
    frm.data.value = DateHelper.dataParaTexto(abastecimento.data);
    frm.hora.value = DateHelper.horaParaTexto(abastecimento.hora);
    frm.preco.value = abastecimento.preco.toLocaleString('pt-BR', { minimumFractionDigits: 3 });
    frm.litros.value = abastecimento.litros.toLocaleString('pt-BR', { minimumFractionDigits: 3 });
    frm.odometro.value = abastecimento.odometro;
    frm.combustivel.value = abastecimento.combustivel;
  }

  validaForm(frm) {
    if (frm.data.value === '') {
      frm.data.nextElementSibling.nextElementSibling.textContent = 'é requerida';
      throw { field: frm.data, message: frm.data.nextElementSibling.nextElementSibling };
    } else {
      if (!/(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{4}/.test(frm.data.value)) {
        frm.data.nextElementSibling.nextElementSibling.textContent = 'inválida';
        throw { field: frm.data, message: frm.data.nextElementSibling.nextElementSibling };
      }
    } 
    if (frm.hora.value === '') {
      frm.hora.nextElementSibling.nextElementSibling.textContent = 'é requerida';
      throw { field: frm.hora, message: frm.hora.nextElementSibling.nextElementSibling };
    } else {
      if (!/(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9])/.test(frm.hora.value)) {
        frm.hora.nextElementSibling.nextElementSibling.textContent = 'inválida';
        throw { field: frm.hora, message: frm.hora.nextElementSibling.nextElementSibling };
      }
    }
    if (frm.preco.value === '') {
      frm.preco.nextElementSibling.nextElementSibling.textContent = 'é requerido';
      throw { field: frm.preco, message: frm.preco.nextElementSibling.nextElementSibling };
    } else {
      if (!/^[0-9]+,[0-9]{1,3}$/.test(frm.preco.value)) {
        frm.preco.nextElementSibling.nextElementSibling.textContent = 'inválido';
        throw { field: frm.preco, message: frm.preco.nextElementSibling.nextElementSibling };
      }
    }
    if (frm.litros.value === '') {
      frm.litros.nextElementSibling.nextElementSibling.textContent = 'é requerido';
      throw { field: frm.litros, message: frm.litros.nextElementSibling.nextElementSibling };
    } else {
      if (!/^[0-9]+,[0-9]{1,3}$/.test(frm.litros.value)) {
        frm.litros.nextElementSibling.nextElementSibling.textContent = 'inválido';
        throw { field: frm.litros, message: frm.litros.nextElementSibling.nextElementSibling };
      }
    }
    if (frm.odometro.value === '') {
      frm.odometro.nextElementSibling.nextElementSibling.textContent = 'é requerido';
      throw { field: frm.odometro, message: frm.odometro.nextElementSibling.nextElementSibling };
    } else {
      if (!/^[0-9]+$/.test(frm.odometro.value)) {
        frm.odometro.nextElementSibling.nextElementSibling.textContent = 'inválido';
        throw { field: frm.odometro, message: frm.odometro.nextElementSibling.nextElementSibling };
      }
    }
    if (frm.combustivel.value === '') {
      frm.combustivel.nextElementSibling.nextElementSibling.textContent = 'é requerido';
      throw { field: frm.combustivel, message: frm.combustivel.nextElementSibling.nextElementSibling };
    }
  }

}