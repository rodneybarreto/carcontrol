const version  = 1;
const dbName   = 'carcontrol';

let stores     = ['abastecimentos'];
let connection = null;
let close      = null;

class ConnectionFactory {

  constructor() {
    throw new Error('ConnectionFactory é uma classe estática, não pode ser instanciada.');
  }

  static getConnection() {
    return new Promise((resolve, reject) => { 
      let request = window.indexedDB.open(dbName, version);

      request.onupgradeneeded = evt => {
        ConnectionFactory._createStores(evt.target.result);
      };
      
      request.onsuccess = evt => {
        if (!connection) {
          connection = evt.target.result;
          close = connection.close.bind(connection);
          
          connection.close = () => { 
            throw new Error('A conexão não pode ser fechada diretamente.'); 
          }; 
        }
        resolve(connection);
      };
      
      request.onerror = evt => {
        console.log(evt.target.error);
        reject(evt.target.error.name);
      };
    });
  }

  static _createStores(connection) {
    stores.forEach(store => {
      if (connection.objectStoreNames.contains(store)) {
        connection.deleteObjectStore(store);
      }
      connection.createObjectStore(store, { keyPath: '_id' });
    });
  }

  static closeConnection() {
    if (connection) {
      close();
      connection = null;
      close = null;
    }
  }

}