var app = app || {};
app.controller = app.controller || {};
app.controller.abastecimento = app.controller.abastecimento || {};

app.controller.abastecimento = (function(app, global){

  let _service = new AbastecimentoService();

  _abreDialog = (evt, id) => { 
    evt.preventDefault();
    app.dialog.querySelector('div p:nth-child(1)').textContent = 'Deseja excluir o abastecimento?';
    app.dialog.querySelector('div p:nth-child(2)').textContent = id;
    app.dialog
      .querySelector('div button:nth-child(2)')
      .setAttribute('onclick', 'app.controller.abastecimento.removeAbastecimento(event)');
    app.dialog.style.display = 'block';
  };

  _listaTodos = evt => {
    evt.preventDefault();

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

  _abreFormInclusao = evt => {
    evt.preventDefault();

    fetch('html/abastecimento/formulario.html')
      .then(res => res.text())
      .then(res => {
        app.containerForm.innerHTML = res;
        
        let frm = app.containerForm.querySelector('form');
        DateHelper.setDatepicker(frm);

        let data = new Date();
        frm.data.value = DateHelper.dataParaTexto(data);
        frm.hora.value = DateHelper.horaParaTexto(data);

        app.main.setAttribute('hidden', true);
        app.containerForm.removeAttribute('hidden');
      })
      .catch(err => console.log(err));
  };

  _abreFormEdicao = (evt, id) => { 
    evt.preventDefault();

    fetch('html/abastecimento/formulario.html')
      .then(res => res.text())
      .then(res => {
        app.containerForm.innerHTML = res;
        
        let frm = app.containerForm.querySelector('form');
        DateHelper.setDatepicker(frm);

        _service
          .busca(id)
          .then(abastecimento => new AbastecimentoView().populaForm(abastecimento, frm))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

    app.main.setAttribute('hidden', true);
    app.containerForm.removeAttribute('hidden');
  };

  _removeAbastecimento = evt => {
    evt.preventDefault();

    let paragrafo = evt.target.offsetParent.querySelector('div p:nth-child(2)');
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

  _fechaForm = evt => {
    evt.preventDefault();
    app.containerForm.setAttribute('hidden', true);
    app.containerForm.innerHTML = '';
    app.main.removeAttribute('hidden');
  };

  _submitForm = evt => {
    evt.preventDefault();
    
    try {
      let frm = evt.target.form;
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

  _abreFormGraficoCombustiveisUtilizados = evt => {
    evt.preventDefault();
    
    fetch('html/abastecimento/formulario-grafico-combustiveis-utilizados.html')
      .then(res => res.text())
      .then(res => {
        app.containerForm.innerHTML = res;
        
        let frm = app.containerForm.querySelector('form');
        DateHelper.setDatepicker(frm);

        let data = new Date();
        let dataIni = DateHelper.inicioDoMes(data);
        let dataFim = DateHelper.finalDoMes(data);
        frm.dataIni.value = DateHelper.dataParaTexto(dataIni);
        frm.dataFim.value = DateHelper.dataParaTexto(dataFim);

        _service
          .buscaAbastecimentosPorPeriodo(dataIni, dataFim)
          .then(abastecimentos => _geraGraficoCombustiveisUtilizados(abastecimentos))
          .catch(err => console.log(err));

        app.main.setAttribute('hidden', true);
        app.containerForm.removeAttribute('hidden');
        app.fechaSideBar();
      })
      .catch(err => console.log(err)); 
  };

  _buscaAbastecimentosPorPeriodo = evt => {
    evt.preventDefault();

    let frm = evt.target.form;
    let dataIni = DateHelper.textoParaData(frm.dataIni.value);
    let dataFim = DateHelper.textoParaData(frm.dataFim.value);

    _service
      .buscaAbastecimentosPorPeriodo(dataIni, dataFim)
      .then(abastecimentos => _geraGraficoCombustiveisUtilizados(abastecimentos))
      .catch(err => console.log(err));
  };
  
  _geraGraficoCombustiveisUtilizados = abastecimentos => {
    
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

  return {
    abreDialog         : _abreDialog,
    listaTodos         : _listaTodos,
    abreFormInclusao   : _abreFormInclusao,
    abreFormEdicao     : _abreFormEdicao,
    removeAbastecimento: _removeAbastecimento,
    fechaForm          : _fechaForm,
    submitForm         : _submitForm,
    abreFormGrafico    : _abreFormGraficoCombustiveisUtilizados,
    buscaAbastecimentosPorPeriodo: _buscaAbastecimentosPorPeriodo, 
    geraGrafico        : _geraGraficoCombustiveisUtilizados
  };

}(app, this));