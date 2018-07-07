'use strict';

class Abastecimento {

  constructor(id, data, hora, odometro, preco, litros, combustivel) {
    this._id = id;
    this._data = new Date(data.getTime());
    this._hora = new Date(hora.getTime());
    this._odometro = odometro;
    this._preco = preco;
    this._litros = litros;
    this._combustivel = combustivel;
  }

  get id() {
    return this._id;
  }

  get data() {
    return new Date(this._data.getTime());
  }

  get hora() {
    return new Date(this._hora.getTime());
  }

  get odometro() {
    return this._odometro;
  }

  get preco() {
    return this._preco;
  }

  get litros() {
    return this._litros;
  }

  get combustivel() {
    return this._combustivel;
  }

}