const CACHE_NAME = 'carcontrol-arquivos';

let version = 15;
let arquivos = [
  '/',
  'index.html',
  '404.html',
  'manifest.json',
  'cache.manifest',
  'libs/pikaday/pikaday.css',
  'css/app.css',
  'img/carcontrol-icon-128x128.png',
  'img/carcontrol-icon-144x144.png',
  'img/carcontrol-icon-152x152.png',
  'img/carcontrol-icon-192x192.png',
  'html/abastecimento/formulario.html',
  'html/abastecimento/formulario-grafico-combustiveis-utilizados.html',
  'libs/pikaday/pikaday.js',
  'js/helper/DateHelper.js',
  'js/helper/NumberHelper.js',
  'js/service/ConnectionFactory.js',
  'js/abastecimento/Abastecimento.js',
  'js/abastecimento/AbastecimentoBuilder.js',
  'js/abastecimento/AbastecimentoDao.js',
  'js/abastecimento/AbastecimentoService.js',
  'js/abastecimento/AbastecimentoView.js',
  'js/app-config.js',
  'js/app.js',
  'js/abastecimento/abastecimento.controller.js'
];

self.addEventListener('install', () => console.log('Service Worker instalado.'));

self.addEventListener('activate', () => {
  caches.open(CACHE_NAME +'-'+ version).then(cache => {
    cache.addAll(arquivos)
      .then(() => {
        caches.delete(CACHE_NAME +'-'+ (version - 1));
        caches.delete(CACHE_NAME);
      });
  });
});

self.addEventListener('fetch', evt => {
  let req = evt.request;
  let pReq = caches.match(req).then(res => (res || fetch(req)));
  evt.respondWith(pReq);
});
