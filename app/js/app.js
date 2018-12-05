var CarcontrolApp = CarcontrolApp || {};

(function(app, global){

  app.abreSideBar = event => {
    app.w3sidebar.style.display = 'block';
    app.w3overlay.style.display = 'block';
  };
  
  app.fechaSideBar = event => {
    app.w3sidebar.style.display = 'none';
    app.w3overlay.style.display = 'none';
  };

  app.menuGrafico = event => {
    event.preventDefault();

    let menu = event.target;
    let subMenu = menu.nextElementSibling;

    if (subMenu.classList.toggle('w3-show')) {
      menu.children[0].classList.remove('fa-caret-up');
      menu.children[0].classList.add('fa-caret-down');
    } else {
      menu.children[0].classList.remove('fa-caret-down');
      menu.children[0].classList.add('fa-caret-up');
    }
  };

  app.btnDialogClose.forEach(btn => {
    btn.addEventListener('click', () => {
      app.dialog.style.display = 'none';
      app.dialog.querySelector('div p:nth-child(1)').textContent = '';
      app.dialog.querySelector('div p:nth-child(2)').textContent = '';
      app.dialog.querySelector('div button:nth-child(2)').removeAttribute('onclick');
    });
  });

}(CarcontrolApp, this));
