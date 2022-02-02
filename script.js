let general, value;

(() => {
  let initial = document.querySelector('.initial');
  let create = document.querySelector('.create');
  let title = document.querySelector('.title');
  let subTitle = document.querySelector('.sub_title');
  let warn = document.querySelector('.warn');
  let count = document.querySelector('.count');
  
  create.addEventListener('click', () => {
    value = count.value;
    if (value > 121 || value < 10) {
      warn.innerHTML = 'Выберите доступное значение!';
    } else {
      initial.remove();
      create.remove();
      title.remove();
      subTitle.remove();
      warn.remove();
      count.remove();
  
      general = document.createElement('div');
      general.classList.add('general');
      document.body.appendChild(general);
  
      menuPart();
      startLife();

      general.addEventListener('click', clickDraw);

      general.addEventListener('mousedown', function() { // bad work
        this.addEventListener('mousemove', clickDraw);
      });
      general.addEventListener('mouseup', function() {
        this.removeEventListener('mousemove', clickDraw);
      });
    }
  });
})()

let gridsMatrix, cellMatrix;
function startLife() {
  [gridsMatrix, cellMatrix] = generateGrids(value);
  
  let time = 300;
  let interval = setInterval(() => {
    nextGen(gridsMatrix, cellMatrix);
  }, time);

  function generateGrids(n) {
    let rowsAndCols = '';
    let newSubGrid;
  
    let gridsMatrix = [];
    let cellMatrix = [];
  
    for (let i = 1; i <= n; i++) {
      gridsMatrix.push([]);
      cellMatrix.push([]);
  
      rowsAndCols += '1fr ';
  
      for (let j = 1; j <= n; j++) {
        newSubGrid = document.createElement('div');
        newSubGrid.classList.add(`subGrid${i}-${j}`);
  
        let random = Math.round(Math.random() * 0.7);
        if (random) {
          newSubGrid.classList.add('alive');
          cellMatrix[i-1].push({state: 'alive', deadNeighbors: 0, aliveNeighbors: 0});
        } else {
          newSubGrid.classList.add('dead');
          cellMatrix[i-1].push({state: 'dead', deadNeighbors: 0, aliveNeighbors: 0});
        }
  
        // newSubGrid.classList.add('dead'); // for glaider
  
        general.append(newSubGrid);
  
        gridsMatrix[i-1].push(newSubGrid);
      }
    }
  
    rowsAndCols.trim();
    general.style.gridTemplateRows = rowsAndCols;
    general.style.gridTemplateColumns = rowsAndCols;
  
    return [gridsMatrix, cellMatrix];
    // return gridsMatrix;
  }
  
  function calculateNeighbors(matrix) {
    matrix.forEach(arr => arr.forEach(el => {
      el.deadNeighbors = 0;
      el.aliveNeighbors = 0;
    }))
  
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        let currCell = matrix[i][j];
        let neighbors = getNeighbors(i, j, matrix.length - 1);
        neighbors = neighbors.map(el => el = matrix[el[0]][el[1]]);
        neighbors.forEach(el => {
          if (el.state === 'alive') {
            ++currCell.aliveNeighbors;
          } else ++currCell.deadNeighbors;
        });
      }
    }

    return matrix
  }
  
  function getNeighbors(i, j, len) {
    let neighbors = [
      [i - 1, j - 1],
      [i - 1, j],
      [i - 1, j + 1],
      [i, j - 1],
      // without center
      [i, j + 1],
      [i + 1, j - 1],
      [i + 1, j],
      [i + 1, j + 1],
    ];
  
    return neighbors.map(el => {
      return el.map(sub => {
        if (sub < 0) {
          return len;
        } else if (sub > len) {
          return 0;
        } return sub;
      });
    })
  }
  
  function nextGen(gridsMatrix, cellMatrix) {
    cellMatrix = calculateNeighbors(cellMatrix);
  
    for (let i = 0; i < gridsMatrix.length; i++) {
      for (let j = 0; j < gridsMatrix[i].length; j++) {
        let current = cellMatrix[i][j];
        if (current.state === 'dead' && current.aliveNeighbors === 3) {
          current.state = 'alive';
          gridsMatrix[i][j].classList.remove('dead');
          gridsMatrix[i][j].classList.add('alive');
        } else if (current.state === 'alive' && (current.aliveNeighbors > 3 || current.aliveNeighbors < 2)) {
          current.state = 'dead';
          gridsMatrix[i][j].classList.remove('alive');
          gridsMatrix[i][j].classList.add('dead');
        }
      }
    }
  }

  window.addEventListener('keypress', (e) => {
    if (e.key === ' ') {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      } else {
        interval = setInterval(() => {
          nextGen(gridsMatrix, cellMatrix);
        }, time);
      }
    } else if (e.key === '+') {
      time = time <= 0 ? 0 : time - 50;
      createNewInterval();
    } else if (e.key === '-') {
      time += 50;
      createNewInterval();
    } 

    function createNewInterval() {
      clearInterval(interval);
      interval = undefined;
      interval = setInterval(() => {
        nextGen(gridsMatrix, cellMatrix);
      }, time);
    }
  });
};


function menuPart() {
  let [btn, select, checkbox] = createMenu();

  btn.addEventListener('click', () => {
    let value = select.options[select.options.selectedIndex].value;
    if (value === 'glaider') {
      createGlaider();
    } else if (value === 'strange1') {
      strangeThing1()
    } else if (value === 'clear') {
      clearGeneral();
    } else if (value === 'random') {
      createChaos();
    } else if (value === 'gun') {
      createGun();
    } else if (value === 'spaceShip1') {
      createSpaceShip1()
    } else if (value === 'gun&Destroyer1') {
      createGunAndDestroyer1()
    } else if (value === 'clock') {
      createClock();
    }
  });

  checkbox.addEventListener('click', function(e) {
    let value = this.children[0].checked;
    this.children[0].checked = value = e.target.type ? value : !value;

    gridsMatrix.forEach(row => {
      row.forEach(col => {
        if (value) {
          col.classList.add('border');
        } else col.classList.remove('border'); 
      })
    })
  })

  function createMenu() {
    let menu = document.createElement('div');
    menu.classList.add('menu');

    let checkboxBlock = document.createElement('div');
    checkboxBlock.classList.add('checkboxBlock');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkboxBlock.appendChild(checkbox);
    let checkboxTitle = document.createElement('span');
    checkboxTitle.innerText = 'Сетка вкл/выкл';
    checkboxBlock.appendChild(checkboxTitle);
    menu.appendChild(checkboxBlock);
  
    let btn = document.createElement('button');
    btn.innerText = 'Применить'
    menu.appendChild(btn);
  
    let select = document.createElement('select');
    let options = [
      {name: 'Создать хаос', value: 'random', minGrid: 0},
      {name: 'Очистить поле', value: 'clear', minGrid: 0},
      {name: 'Создать глайдер', value: 'glaider', minGrid: 0},
      {name: 'Космический корабль v1', value: 'spaceShip1', minGrid: 20},
      {name: 'Пушка и аннигилятор', value: 'gun&Destroyer1', minGrid: 50},
      {name: 'Создать пушку', value: 'gun', minGrid: 50},
      {name: 'Часы', value: 'clock', minGrid: 20},
      {name: 'Непонятная штука 1', value: 'strange1', minGrid: 0},
      
      // {name: '', value: '', minGrid: 0},
      // {name: '', value: '', minGrid: 0},
    ];
    for (let i = 0; i < options.length; i++) {
      if (value >= options[i].minGrid) {
        let option = document.createElement('option');
        option.innerText = options[i].name;
        option.value = options[i].value;
        select.appendChild(option);
      }
    };
    menu.appendChild(select);

    let info = document.createElement('div');
    info.classList.add('info');
    info.innerText = `Доп возможности:
    \n Клавиша "+" увеличит скорость
    \n Клавиша "-" уменьшит скорость
    \n Клавиша "пробел" стоп/продолжить
    \n alt-клик скроет/покажет эту панель 
    \n клик по ячейки - создание/удаление жизни
    \n\n`;
    menu.insertAdjacentElement('afterbegin', info);
  
    document.body.insertAdjacentElement('afterbegin', menu);

    window.addEventListener('click', (e) => { // menu виден благодаря замыканию
      if (e.altKey) {
        let prevLeft = menu.style.left;
        if (prevLeft === '' || prevLeft === '10px') {
          menu.style.left = '-100vw';
        } else menu.style.left = '10px';
      }
    })

    return [btn, select, checkboxBlock];
  }

  function createChaos() {
    gridsMatrix.forEach(row => row.forEach(col => {
    if (Math.round(Math.random())) {
      col.classList.remove('alive');
      col.classList.add('dead');
    } else {
      col.classList.remove('dead');
      col.classList.add('alive');
    }
    }));

    cellMatrix.forEach(row => row.forEach(col => {
      col.state = Math.round(Math.random()) ? 'alive' : 'dead';
    }));
  }

  function clearGeneral() {
    gridsMatrix.forEach(row => row.forEach(col => {
      col.classList.remove('alive');
      col.classList.add('dead');
    }));

    cellMatrix.forEach(row => row.forEach(col => {
      col.state = 'dead';
    }));
  }
} // нужен чекбокс для сетки вкл/выкл

function strangeThing1() {
  gridsMatrix[0].map((el, ind) => {
    if (ind < 5) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[1][2].classList.remove('alive');
  gridsMatrix[1][2].classList.add('dead');
  gridsMatrix[2][3].classList.remove('alive');
  gridsMatrix[2][3].classList.add('dead');

  gridsMatrix[3].map((el, ind) => {
    if (ind === 0 || ind === 4) {
      el.classList.remove('alive');
      el.classList.add('dead');
    } else if (ind > 0 && ind < 4) {
      el.classList.remove('dead');
      el.classList.add('alive');
    }
  });


  cellMatrix[0].map((el, ind) => {
    if (ind < 5) {
      el.state === 'dead';
    }
  });

  cellMatrix[1][2].state = 'alive';
  cellMatrix[2][3].state = 'dead';

  cellMatrix[3].map((el, ind) => {
    if (ind === 0 || ind === 4) {
      el.state = 'dead';
    } else if (ind > 0 && ind < 4) {
      el.state = 'alive';
    }
  });
}

function createGlaider() {
  gridsMatrix[0].map((el, ind) => {
    if (ind < 5) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[1].map((el, ind) => {
    if (ind === 2) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 5) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[2].map((el, ind) => {
    if (ind === 3) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 5) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  })

  gridsMatrix[3].map((el, ind) => {
    if (ind === 0 || ind === 4) {
      el.classList.remove('alive');
      el.classList.add('dead');
    } else if (ind > 0 && ind < 4) {
      el.classList.remove('dead');
      el.classList.add('alive');
    }
  });


  cellMatrix[0].map((el, ind) => {
    if (ind < 5) {
      el.state = 'dead';
    }
  });

  cellMatrix[1].map((el, ind) => {
    if (ind === 2) {
      el.state = 'alive';
    } else if (ind < 5) {
      el.state = 'dead';
    }
  });

  cellMatrix[2].map((el, ind) => {
    if (ind === 3) {
      el.state = 'alive';
    } else if (ind < 5) {
      el.state = 'dead';
    }
  })

  cellMatrix[3].map((el, ind) => {
    if (ind === 0 || ind === 4) {
      el.state = 'dead';
    } else if (ind > 0 && ind < 4) {
      el.state = 'alive';
    }
  });
};

function createSpaceShip1() { // 6x7 === 5x6
  let limit = gridsMatrix.length;
  let requiredSpace = 6;
  let randRowGrid = randRowCell = Math.round(Math.random() * (limit - requiredSpace));

  gridsMatrix[++randRowGrid].map((el, ind) => {
    if (ind < 7) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[++randRowGrid].map((el, ind) => {
    if (ind === 4) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 7) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[++randRowGrid].map((el, ind) => {
    if (ind === 5) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 7) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[++randRowGrid].map((el, ind) => {
    if (ind === 1 || ind === 5) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 7) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[++randRowGrid].map((el, ind) => {
    let registry = [2, 3, 4, 5]
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 7) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[++randRowGrid].map((el, ind) => {
    if (ind < 7) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  cellMatrix[++randRowCell].map((el, ind) => {
    if (ind < 7) {
      el.state = 'dead';
    }
  });

  cellMatrix[++randRowCell].map((el, ind) => {
    if (ind === 4) {
      el.state = 'alive';
    } else if (ind < 7) {
      el.state = 'dead';
    }
  });

  cellMatrix[++randRowCell].map((el, ind) => {
    if (ind === 5) {
      el.state = 'alive';
    } else if (ind < 7) {
      el.state = 'dead';
    }
  });

  cellMatrix[++randRowCell].map((el, ind) => {
    if (ind === 1 || ind === 5) {
      el.state = 'alive';
    } else if (ind < 7) {
      el.state = 'dead';
    }
  });

  cellMatrix[++randRowCell].map((el, ind) => {
    let registry = [2, 3, 4, 5]
    if (registry.includes(ind)) {
      el.state = 'alive';
    } else if (ind < 7) {
      el.state = 'dead';
    }
  });

  cellMatrix[++randRowCell].map((el, ind) => {
    if (ind < 7) {
      el.state = 'dead';
    }
  });
}

function createGun() { // 11x38 === 10x37
  gridsMatrix[0].map((el, ind) => {
    if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[1].map((el, ind) => {
    if (ind === 25) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[2].map((el, ind) => {
    if (ind === 25 || ind === 23) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[3].map((el, ind) => {
    let registry = [13, 14, 21, 22, 35, 36];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[4].map((el, ind) => {
    let registry = [12, 16, 21, 22, 35, 36];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[5].map((el, ind) => {
    let registry = [1, 2, 11, 17, 21, 22];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });
  
  gridsMatrix[6].map((el, ind) => {
    let registry = [1, 2, 11, 15, 17, 18, 23, 25];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[7].map((el, ind) => {
    let registry = [11, 17, 25];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });
  
  gridsMatrix[8].map((el, ind) => {
    let registry = [12, 16];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[9].map((el, ind) => {
    let registry = [13, 14];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[0].map((el, ind) => {
    if (ind < 38) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });


  cellMatrix[0].map((el, ind) => {
    if (ind < 38) {
      el.state = 'dead'
    }
  });

  cellMatrix[1].map((el, ind) => {
    if (ind === 25) {
      el.state = 'alive'
    } else if (ind < 38) {
      el.state = 'dead'
    }
  });

  cellMatrix[2].map((el, ind) => {
    if (ind === 25 || ind === 23) {
      el.state = 'alive'
    } else if (ind < 38) {
      el.state = 'dead'
    }
  });

  cellMatrix[3].map((el, ind) => {
    let registry = [13, 14, 21, 22, 35, 36];
    if (registry.includes(ind)) {
      el.state = 'alive'
    } else if (ind < 38) {
      el.state = 'dead'
    }
  });

  cellMatrix[4].map((el, ind) => {
    let registry = [12, 16, 21, 22, 35, 36];
    if (registry.includes(ind)) {
      el.state = 'alive'
    } else if (ind < 38) {
      el.state = 'dead'
    }
  });

  cellMatrix[5].map((el, ind) => {
    let registry = [1, 2, 11, 17, 21, 22];
    if (registry.includes(ind)) {
      el.state = 'alive'
    } else if (ind < 38) {
      el.state = 'dead'
    }
  });
  
  cellMatrix[6].map((el, ind) => {
    let registry = [1, 2, 11, 15, 17, 18, 23, 25];
    if (registry.includes(ind)) {
      el.state = 'alive'
    } else if (ind < 38) {
      el.state = 'dead'
    }
  });

  cellMatrix[7].map((el, ind) => {
    let registry = [11, 17, 25];
    if (registry.includes(ind)) {
      el.state = 'alive'
    } else if (ind < 38) {
      el.state = 'dead'
    }
  });
  
  cellMatrix[8].map((el, ind) => {
    let registry = [12, 16];
    if (registry.includes(ind)) {
      el.state = 'alive'
    } else if (ind < 38) { 
      el.state = 'dead'
    }
  });

  cellMatrix[9].map((el, ind) => {
    let registry = [13, 14];
    if (registry.includes(ind)) {
      el.state = 'alive'
    } else if (ind < 38) {
      el.state = 'dead'
    }
  });

  cellMatrix[0].map((el, ind) => {
    if (ind < 38) {
      el.state = 'dead'
    }
  });
}

function createGunAndDestroyer1() { //20x43 === 19x42
  let max = 43;

  gridsMatrix[0].map((el, ind) => {
    if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[1].map((el, ind) => {
    if (ind === 24) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[2].map((el, ind) => {
    if (ind === 24 || ind === 22) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[3].map((el, ind) => {
    let registry = [13, 21, 23, 35, 36];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[4].map((el, ind) => {
    let registry = [12, 13, 20, 23, 35, 36];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[5].map((el, ind) => {
    let registry = [1, 2, 11, 12, 17, 18, 21, 23];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[6].map((el, ind) => {
    let registry = [1, 2, 10, 11, 12, 17, 18, 22, 24];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[7].map((el, ind) => {
    let registry = [11, 12, 17, 18, 24];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[8].map((el, ind) => {
    if (ind === 12 || ind === 13) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[9].map((el, ind) => {
    if (ind === 13) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix.slice(10, 16).forEach(
    row => row.map((el, ind) => {
      if (ind < max) {
        el.classList.remove('alive');
        el.classList.add('dead');
      }
    })
  );

  gridsMatrix[16].map((el, ind) => {
    let registry = [34, 35, 36, 37, 38, 39, 40, 41];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[17].map((el, ind) => {
    let registry = [34, 36, 37, 38, 39, 41];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[18].map((el, ind) => {
    let registry = [34, 35, 36, 37, 38, 39, 40, 41];
    if (registry.includes(ind)) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[19].map((el, ind) => {
    if (ind < max) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });


  cellMatrix[0].map((el, ind) => {
    if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[1].map((el, ind) => {
    if (ind === 24) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[2].map((el, ind) => {
    if (ind === 24 || ind === 22) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[3].map((el, ind) => {
    let registry = [13, 21, 23, 35, 36];
    if (registry.includes(ind)) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[4].map((el, ind) => {
    let registry = [12, 13, 20, 23, 35, 36];
    if (registry.includes(ind)) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[5].map((el, ind) => {
    let registry = [1, 2, 11, 12, 17, 18, 21, 23];
    if (registry.includes(ind)) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[6].map((el, ind) => {
    let registry = [1, 2, 10, 11, 12, 17, 18, 22, 24];
    if (registry.includes(ind)) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[7].map((el, ind) => {
    let registry = [11, 12, 17, 18, 24];
    if (registry.includes(ind)) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[8].map((el, ind) => {
    if (ind === 12 || ind === 13) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[9].map((el, ind) => {
    if (ind === 13) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix.slice(10, 16).forEach(
    row => row.map((el, ind) => {
      if (ind < max) {
        el.state = 'dead';
      }
    })
  );

  cellMatrix[16].map((el, ind) => {
    let registry = [34, 35, 36, 37, 38, 39, 40, 41];
    if (registry.includes(ind)) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[17].map((el, ind) => {
    let registry = [34, 36, 37, 38, 39, 41];
    if (registry.includes(ind)) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[18].map((el, ind) => {
    let registry = [34, 35, 36, 37, 38, 39, 40, 41];
    if (registry.includes(ind)) {
      el.state = 'alive';
    } else if (ind < max) {
      el.state = 'dead';
    }
  });

  cellMatrix[19].map((el, ind) => {
    if (ind < max) {
      el.state = 'dead';
    }
  });
}

function createClock() { //13x13 === 14x14
  let limit = 13;
  let mid = Math.floor(gridsMatrix.length / 2 - limit / 2);
  let i = j = 0;
  let ifFlag = (ind) => ind < mid + limit && ind > mid - limit;
  
  gridsMatrix[mid + i++].map((el, ind) => {
    if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  })
  
  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 7 || ind === mid + 8) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 7 || ind === mid + 8) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  })

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 5 || ind === mid + 6 || ind === mid + 7 || ind === mid + 8) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 1 || ind === mid + 2 || ind === mid + 4 || ind === mid + 9) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 1 || ind === mid + 2 || ind === mid + 4 || ind === mid + 5 || ind === mid + 9) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 4 || ind === mid + 7 || ind === mid + 9 || ind === mid + 11 || ind === mid + 12) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 4 || ind === mid + 6 || ind === mid + 9 || ind === mid + 11 || ind === mid + 12) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 5 || ind === mid + 6 || ind === mid + 7 || ind === mid + 8) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 5 || ind === mid + 6) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i++].map((el, ind) => {
    if (ind === mid + 5 || ind === mid + 6) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[mid + i].map((el, ind) => {
    if (ifFlag(ind)) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ifFlag(ind)) {
      el.state = 'dead';
    }
  })
  
  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 7 || ind === mid + 8) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 7 || ind === mid + 8) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ifFlag(ind)) {
      el.state = 'dead';
    }
  })

  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 5 || ind === mid + 6 || ind === mid + 7 || ind === mid + 8) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 1 || ind === mid + 2 || ind === mid + 4 || ind === mid + 9) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 1 || ind === mid + 2 || ind === mid + 4 || ind === mid + 5 || ind === mid + 9) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 4 || ind === mid + 7 || ind === mid + 9 || ind === mid + 11 || ind === mid + 12) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 4 || ind === mid + 6 || ind === mid + 9 || ind === mid + 11 || ind === mid + 12) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 5 || ind === mid + 6 || ind === mid + 7 || ind === mid + 8) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 5 || ind === mid + 6) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j++].map((el, ind) => {
    if (ind === mid + 5 || ind === mid + 6) {
      el.state = 'alive';
    } else if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });

  cellMatrix[mid + j].map((el, ind) => {
    if (ifFlag(ind)) {
      el.state = 'dead';
    }
  });
}


function clickDraw(e) {
  let target = e.target;
  let [row, col] = target.classList[0].split('subGrid')[1].split('-');
  if (target.classList.contains('alive')) {
    target.classList.remove('alive');
    target.classList.add('dead');
    cellMatrix[row - 1][col - 1].state = 'dead';
  } else if (target.classList.contains('dead')) {
    target.classList.remove('dead');
    target.classList.add('alive');
    cellMatrix[row - 1][col - 1].state = 'alive';
  }
}
