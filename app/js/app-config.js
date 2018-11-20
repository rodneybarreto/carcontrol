'use strict';

var CarcontrolApp = ({

  isLoading: true,

  w3sidebar: document.querySelector('#w3sidebar'),
  w3overlay: document.querySelector('#w3overlay'),

  loader: document.querySelector('.cc-loader'),
  dialog: document.querySelector('.w3-modal'),
  btnDialogClose: document.querySelectorAll('.cc-btn-dialog-close'),
  
  containerForm: document.querySelector('.cc-container-form'),
  containerChart: document.querySelector('.cc-container-chart'),

  main: document.querySelector('main'),
    
  init: function() {
    // Checa se o ambiente e um local seguro e
    // se o navegador suporta serviceworker
    let isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );

    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
      navigator.serviceWorker
        .register('./service-worker.js')
        .then(() => console.log('Service Worker Registirado'));
    }  

    // Configuracao para loader e footer
    if (this.isLoading) {
      this.loader.setAttribute('hidden', true);
      this.isLoading = false;
    }
    return this;
  }
}).init();