var CarcontrolApp = CarcontrolApp || {};

(function(app, global){

  app.controller = app.controller || {};
  app.controller.abastecimento = app.controller.abastecimento || {};

  let containerChart = document.querySelector('.cc-container-chart');
  let frm = document.querySelector('form');

  let data = new Date();
  let dataIni = DateHelper.inicioDoMes(data);
  let dataFim = DateHelper.finalDoMes(data);
  frm.dataIni.value = DateHelper.dataParaTexto(dataIni);
  frm.dataFim.value = DateHelper.dataParaTexto(dataFim);

  let dtIni = new mdDateTimePicker.default({
    type: 'date',
    orientation: 'PORTRAIT',
    trigger: frm.dataIni
  });
  frm.dataIni.addEventListener('focus', function(){ 
    dtIni.toggle(); 
  });
  frm.dataIni.addEventListener('onOk', function(){ 
    this.value = moment(dtIni.time.toString()).format('DD/MM/YYYY');
  });        

  let dtFim = new mdDateTimePicker.default({
    type: 'date',
    future: moment().add(1, 'years'),
    orientation: 'PORTRAIT',
    trigger: frm.dataFim
  });
  frm.dataFim.addEventListener('focus', function(){ 
    dtFim.toggle(); 
  });
  frm.dataFim.addEventListener('onOk', function(){ 
    this.value = moment(dtFim.time.toString()).format('DD/MM/YYYY');
  });
  
  const dataI = DateHelper.textoParaData(frm.dataIni.value);
  const dataF = DateHelper.textoParaData(frm.dataFim.value);

  const _service = new AbastecimentoService();
  _service.buscaAbastecimentosPorPeriodo(dataI, dataF)
    .then(abastecimentos => app.controller.abastecimento.geraGrafico(abastecimentos))
    .catch(err => console.log(err));

  app.controller.abastecimento.geraGrafico = function(abastecimentos) {
    
    if (abastecimentos.length > 0) {
      let GC = abastecimentos.map(gascomum => gascomum.combustivel === 'Gas. comum')
                             .reduce((sum, value) => sum + value, 0);
  
      let GA = abastecimentos.map(gasaditivada => gasaditivada.combustivel === 'Gas. aditivada')
                             .reduce((sum, value) => sum + value, 0);
  
      let ET = abastecimentos.map(etanol => etanol.combustivel === 'Etanol')
                             .reduce((sum, value) => sum + value, 0);
                             
      google.charts.setOnLoadCallback(function(){
        // Create the data table.
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'combustiveis');
        data.addColumn('number', 'abastecimentos');
        data.addRows([
          ['Gas. Comum', GC],
          ['Gas. Aditivada', GA],
          ['Etanol', ET]
        ]);
        // Set chart options
        let options = { title: 'Combustíveis utilizados no período' };
        // Instantiate and draw our chart, passing in some options.
        containerChart.innerHTML = '';
        let chart = new google.visualization.PieChart(containerChart);
        chart.draw(data, options);
      });
    } else {
      containerChart.innerHTML = new AbastecimentoView().registroNaoEncontrado();
    }
  };  
  
}(CarcontrolApp, this));
