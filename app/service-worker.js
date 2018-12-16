const VERSION = 25;
const CACHE_NAME = `carcontrol-v${VERSION}`;
const CACHE_FILES = [
  '/',
  'index.html',
  '404.html',
  'manifest.json',
  'libs/md-date-time-picker/dist/css/mdDateTimePicker.min.css',
  'css/app.css',
  'libs/md-date-time-picker/dist/images/ic_keyboard_arrow_left_black_24px.svg',
  'libs/md-date-time-picker/dist/images/ic_keyboard_arrow_left_black_disabled_24px.svg',
  'libs/md-date-time-picker/dist/images/ic_keyboard_arrow_left_white_24px.svg',
  'libs/md-date-time-picker/dist/images/ic_keyboard_arrow_left_white_disabled_24px.svg',
  'libs/md-date-time-picker/dist/images/ic_keyboard_arrow_right_black_24px.svg',
  'libs/md-date-time-picker/dist/images/ic_keyboard_arrow_right_black_disabled_24px.svg',
  'libs/md-date-time-picker/dist/images/ic_keyboard_arrow_right_white_24px.svg',
  'libs/md-date-time-picker/dist/images/ic_keyboard_arrow_right_white_disabled_24px.svg',
  'img/carcontrol-icon-128x128.png',
  'img/carcontrol-icon-144x144.png',
  'img/carcontrol-icon-152x152.png',
  'img/carcontrol-icon-192x192.png',
  'html/abastecimento/formulario.html',
  'html/abastecimento/formulario-grafico-combustiveis-utilizados.html',
  'html/abastecimento/graficos-abastecimento.html',
  'libs/md-date-time-picker/dist/js/moment.min.js',
  'libs/md-date-time-picker/dist/js/lang/pt-br.js',
  'libs/md-date-time-picker/dist/js/draggabilly.pkgd.min.js',
  'libs/md-date-time-picker/dist/js/mdDateTimePicker.min.js',
  'js/helper/DateHelper.js',
  'js/helper/NumberHelper.js',
  'js/service/ConnectionFactory.js',
  'js/abastecimento/Abastecimento.js',
  'js/abastecimento/AbastecimentoBuilder.js',
  'js/abastecimento/AbastecimentoDao.js',
  'js/abastecimento/AbastecimentoService.js',
  'js/abastecimento/AbastecimentoView.js',
  'js/abastecimento/graficos-abastecimento.js',
  'js/abastecimento/abastecimento.controller.js',
  'js/app-config.js',
  'js/app.js'
];

self.addEventListener('install', () => console.log('Service Worker instalado.'));

self.addEventListener('activate', () => {
  caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Novo cache aberto.');
      console.log('Adicionando arquivos no cache...');
      return cache.addAll(CACHE_FILES);
    })
    .then(() => {
      console.log('Arquivos adicionados.');
      console.log('Removendo arquivos anteriores...');
      caches.keys()
        .then(arr => Promise.all(
          arr.map(strCacheName => { 
            if (CACHE_NAME.indexOf(strCacheName) === -1) {
              return caches.delete(strCacheName);
            }
          })
        ))
        .then(() => console.log('Arquivos anteriores removidos.'))
        .catch(err => console.log('Erro ao remover arquivos anteriores', err));
    })
    .catch(err => console.log('Erro ao adicionar arquivos no cache.', err));  
});

self.addEventListener('fetch', event => {
  let req = event.request;
  let pReq = caches.match(req).then(res => (res || fetch(req)));
  event.respondWith(pReq);
});
