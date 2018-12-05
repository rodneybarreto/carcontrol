var CarcontrolApp = CarcontrolApp || {};

(function(app, global){

  app.controller = app.controller || {};
  app.controller.abastecimento = app.controller.abastecimento || {};

  let _service = new AbastecimentoService();

  app.controller.abastecimento.abreDialog = function(event, id) { 
    event.preventDefault();
    app.dialog.querySelector('div p:nth-child(1)').textContent = 'Deseja excluir o abastecimento?';
    app.dialog.querySelector('div p:nth-child(2)').textContent = id;
    app.dialog
      .querySelector('div button:nth-child(2)')
      .setAttribute('onclick', 'CarcontrolApp.controller.abastecimento.removeAbastecimento(event)');
    app.dialog.style.display = 'block';
  };

  app.controller.abastecimento.listaTodos = function(event) {
    event.preventDefault();

    _service
      .buscaAbastecimentos()
      .then(abastecimentos => {
        new AbastecimentoView().listaTodos(abastecimentos);

        app.containerForm.setAttribute('hidden', true);
        app.containerForm.innerHTML = '';
        app.containerChart.setAttribute('hidden', true);
        app.containerChart.innerHTML = '';
        app.main.removeAttribute('hidden');
        app.fechaSideBar();
      })
      .catch(err => console.log(err));
  };

  app.controller.abastecimento.abreFormInclusao = function(event) {
    event.preventDefault();

    fetch('html/abastecimento/formulario.html')
      .then(res => res.text())
      .then(res => {
        app.containerForm.innerHTML = res;
        
        let frm = app.containerForm.querySelector('form');
        frm.data.value = moment().format('DD/MM/YYYY');
        frm.hora.value = moment().format('HH:mm');

        let dt = new mdDateTimePicker.default({
          type: 'date',
          orientation: 'PORTRAIT',
          trigger: frm.data
        });
        frm.data.addEventListener('focus', function(){
          dt.toggle();
        });
        frm.data.addEventListener('onOk', function(){
          this.value = moment(dt.time.toString()).format('DD/MM/YYYY');
        });

        let tm = new mdDateTimePicker.default({
          type: 'time',
          mode: true,
          orientation: 'PORTRAIT',
          trigger: frm.hora
        });
        frm.hora.addEventListener('focus', function(){
          tm.toggle();
        });
        frm.hora.addEventListener('onOk', function(){
          this.value = moment(tm.time.toString()).format('HH:mm');
        });

        app.main.setAttribute('hidden', true);
        app.containerForm.removeAttribute('hidden');
      })
      .catch(err => console.log(err));
  };

  app.controller.abastecimento.abreFormEdicao = function(event, id) { 
    event.preventDefault();

    fetch('html/abastecimento/formulario.html')
      .then(res => res.text())
      .then(res => {
        app.containerForm.innerHTML = res;

        let frm = app.containerForm.querySelector('form');

        let dt = new mdDateTimePicker.default({
          type: 'date',
          orientation: 'PORTRAIT',
          trigger: frm.data
        });
        frm.data.addEventListener('focus', function(){
          dt.toggle();
        });
        frm.data.addEventListener('onOk', function(){
          this.value = moment(dt.time.toString()).format('DD/MM/YYYY');
        });

        let tm = new mdDateTimePicker.default({
          type: 'time',
          mode: true,
          orientation: 'PORTRAIT',
          trigger: frm.hora
        });
        frm.hora.addEventListener('focus', function(){
          tm.toggle();
        });
        frm.hora.addEventListener('onOk', function(){
          this.value = moment(tm.time.toString()).format('HH:mm');
        });

        _service.busca(id)
                .then(abastecimento => new AbastecimentoView().populaForm(abastecimento, frm))
                .catch(err => console.log(err));

        app.main.setAttribute('hidden', true);
        app.containerForm.removeAttribute('hidden');
      })
      .catch(err => console.log(err));
  };

  app.controller.abastecimento.removeAbastecimento = function(event) {
    event.preventDefault();

    let paragrafo = event.target.offsetParent.querySelector('div p:nth-child(2)');
    let id = parseInt(paragrafo.textContent, 10);

    _service
      .remove(id)
      .then(msg => {
        console.log(msg);
        return _service.buscaAbastecimentos();
      })
      .then(abastecimentos => new AbastecimentoView().listaTodos(abastecimentos))
      .catch(err => console.log(err));

    paragrafo.textContent = '';
    app.dialog.style.display = 'none';
  };

  app.controller.abastecimento.fechaForm = function(event) {
    event.preventDefault();
    app.containerForm.setAttribute('hidden', true);
    app.containerForm.innerHTML = '';
    app.main.removeAttribute('hidden');
  };

  app.controller.abastecimento.submitForm = function(event) {
    event.preventDefault();
    
    try {
      let frm = event.target.form;
      new AbastecimentoView().validaForm(frm);
  
      // Cadastra
      if (frm.abastecimentoId.value === '') {
        let abastecimento = AbastecimentoBuilder.criaAbastecimento(frm);

        _service
          .adiciona(abastecimento)
          .then(msg => {
            console.log(msg);
            return _service.buscaAbastecimentos();
          })
          .then(abastecimentos => new AbastecimentoView().listaTodos(abastecimentos))
          .catch(err => console.log(err));
      } 
      // Atualiza
      else {
        let abastecimento = AbastecimentoBuilder.criaAbastecimento(frm, frm.abastecimentoId.value);

        _service
          .edita(abastecimento)
          .then(msg => {
            console.log(msg);
            return _service.buscaAbastecimentos();
          })
          .then(abastecimentos => new AbastecimentoView().listaTodos(abastecimentos))
          .catch(err => console.log(err));
      }

      app.containerForm.setAttribute('hidden', true);
      app.containerForm.innerHTML = '';
      app.main.removeAttribute('hidden');
    } 
    catch(e) {
      e.field.focus();
      e.message.style = 'display: inline-block';
    }
  };

  app.controller.abastecimento.abreFormGrafico = function(event) {
    event.preventDefault();
    
    fetch('html/abastecimento/formulario-grafico-combustiveis-utilizados.html')
      .then(res => res.text())
      .then(res => {
        app.containerForm.innerHTML = res;
        
        let frm = app.containerForm.querySelector('form');

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

        _service.buscaAbastecimentosPorPeriodo(dataIni, dataFim)
                .then(abastecimentos => app.controller.abastecimento.geraGrafico(abastecimentos))
                .catch(err => console.log(err));

        app.main.setAttribute('hidden', true);
        app.containerForm.removeAttribute('hidden');
        app.fechaSideBar();
      })
      .catch(err => console.log(err)); 
  };

  app.controller.abastecimento.buscaAbastecimentosPorPeriodo = function(event) {
    event.preventDefault();

    let frm = event.target.form;
    let dataIni = DateHelper.textoParaData(frm.dataIni.value);
    let dataFim = DateHelper.textoParaData(frm.dataFim.value);

    _service
      .buscaAbastecimentosPorPeriodo(dataIni, dataFim)
      .then(abastecimentos => app.controller.abastecimento.geraGrafico(abastecimentos))
      .catch(err => console.log(err));
  };
  
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
        app.containerChart.innerHTML = '';
        let chart = new google.visualization.PieChart(app.containerChart);
        chart.draw(data, options);
      });
    } else {
      app.containerChart.innerHTML = new AbastecimentoView().registroNaoEncontrado();
    }
    app.containerChart.removeAttribute('hidden');
  };

}(CarcontrolApp, this));
