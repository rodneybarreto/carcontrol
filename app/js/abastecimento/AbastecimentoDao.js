'use strict';

class AbastecimentoDao {

  constructor(connection) {
    this._connection = connection;
    this._store = 'abastecimentos';
  }

  adiciona(abastecimento) {
    return new Promise((resolve, reject) => {

      let request = this._connection
        .transaction([this._store], 'readwrite')
        .objectStore(this._store)
        .add(abastecimento);
      
      request.onerror = evt => { 
        console.log(evt.target.error);
        reject('Não foi possível cadastrar o abastecimento.');
      };
      
      request.onsuccess = evt => resolve('Abastecimento cadastrado com sucesso.');
    });
  }

  edita(abastecimento) {
    return new Promise((resolve, reject) => {

      let store = this._connection.transaction([this._store], 'readwrite').objectStore(this._store);
      let request = store.get(abastecimento.id);

      request.onerror = evt => {
        console.log(evt.target.error);
        reject('Não foi possível localizar o abastecimento para atualização.');          
      };

      request.onsuccess = evt => {
        let obj = evt.target.result;

        obj._data = abastecimento.data;
        obj._hora = abastecimento.hora;
        obj._odometro = abastecimento.odometro;
        obj._preco = abastecimento.preco;
        obj._litros = abastecimento.litros;
        obj._combustivel = abastecimento.combustivel;
        
        let reqUpdate = store.put(obj);
        
        reqUpdate.onerror = evt => {
          console.log(evt.target.error);
          reject('Não foi possível atualizar o abastecimento.');          
        }; 
        
        reqUpdate.onsuccess = evt => {
          resolve('Abastecimento atualizado com sucesso.');
        };
      };
    });
  }

  remove(id) {
    return new Promise((resolve, reject) => {

      let store = this._connection.transaction([this._store], 'readwrite').objectStore(this._store);
      let request = store.delete(id);
      
      request.onerror = evt => {
        console.log(evt.target.error);
        reject('Não foi possível apagar o abastecimento.');
      };

      request.onsuccess = evt => {
        resolve('Abastecimento apagado com sucesso.');
      };
    });
  }

  busca(id) {
    return new Promise((resolve, reject) => {

      let store = this._connection.transaction([this._store], 'readwrite').objectStore(this._store);
      let request = store.get(id);

      request.onerror = evt => {
        console.log(evt.target.error);
        reject('Não foi possível localizar o abastecimento.');          
      };

      request.onsuccess = evt => {
        let obj = evt.target.result;

        let abastecimento = new Abastecimento(
          obj._id,
          obj._data,
          obj._hora,
          obj._odometro,
          obj._preco,
          obj._litros,
          obj._combustivel
        );
        resolve(abastecimento);
      };
    });
  }

  buscaAbastecimentos() {
    return new Promise((resolve, reject) => { 
      let abastecimentos = [];
      
      let cursor = this._connection
        .transaction([this._store], 'readwrite')
        .objectStore(this._store)
        .openCursor();
      
      cursor.onerror = evt => {
        console.log(evt.target.error);
        reject('Nenhum abastecimento encontrado.');
      };

      cursor.onsuccess = evt => {
        let ponteiro = evt.target.result;

        if (ponteiro) {
          let obj = ponteiro.value;

          abastecimentos.push(
            new Abastecimento(
              obj._id,
              obj._data,
              obj._hora,
              obj._odometro,
              obj._preco,
              obj._litros,
              obj._combustivel
            )
          );
          ponteiro.continue();
        } 
        else {
          resolve(abastecimentos);
        }
      };
    });
  }

}