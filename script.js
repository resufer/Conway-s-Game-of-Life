let general, value;

(() => {
  let initial = document.querySelector('.initial');
  let create = document.querySelector('.create');
  let title = document.querySelector('.title');
  let warn = document.querySelector('.warn');
  let count = document.querySelector('.count');
  
  create.addEventListener('click', () => {
    value = count.value;
    if (value > 100 || value < 10) {
      warn.innerHTML = 'Выберите доступное значение!';
    } else {
      initial.remove();
      create.remove();
      title.remove();
      warn.remove();
      count.remove();
  
      general = document.createElement('div');
      general.classList.add('general');
      document.body.appendChild(general);
  
      menuPart();
      startLife();
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
      time -= 100;
      createNewInterval();
    } else if (e.key === '-') {
      time += 100;
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
  let [btn, select] = createMenu();

  btn.addEventListener('click', () => {
    let value = select.options[select.options.selectedIndex].value;
    if (value === 'glaider') {
      createGlaider();
    } else if (value === 'strange1') {
      strangeThing1()
    } else if (value === 'clear') {
      clearGeneral();
    } else if (value === 'random') {
      clearGeneral();
      startLife();
    }
  });

  function createMenu() {
    let menu = document.createElement('div');
    menu.classList.add('menu');
  
    let btn = document.createElement('button');
    btn.innerText = 'Применить'
    menu.appendChild(btn);
  
    let select = document.createElement('select');
    let options = [
      {name: 'Создать хаос', value: 'random'},
      {name: 'Очистить поле', value: 'clear'},
      {name: 'Создать глайдер', value: 'glaider'},
      {name: 'Непонятная штука 1', value: 'strange1'},
      // {name: '', value: 'strange1'},
    ];
    for (let i = 0; i < options.length; i++) {
      let option = document.createElement('option');
      option.innerText = options[i].name;
      option.value = options[i].value;
      select.appendChild(option);
    };
    menu.appendChild(select);

    let info = document.createElement('div');
    info.classList.add('info');
    info.innerText = `Доп возможности:
    \n Клавиша "+" увеличит скорость
    \n Клавиша "-" уменьшит скорость
    \n Клавиша "пробел" стоп/продолжить
    \n\n`;
    menu.insertAdjacentElement('afterbegin', info);
  
    document.body.insertAdjacentElement('afterbegin', menu);
    return [btn, select];
  }

  function clearGeneral() {
    let kids = [...general.children];
    kids.map(kid => kid.remove());
  }
}

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
    } else if (ind !== 2 && ind < 5) {
      el.classList.remove('alive');
      el.classList.add('dead');
    }
  });

  gridsMatrix[2].map((el, ind) => {
    if (ind === 3) {
      el.classList.remove('dead');
      el.classList.add('alive');
    } else if (ind !== 3 && ind < 5) {
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
    } else if (ind !== 2 && ind < 5) {
      el.state = 'dead';
    }
  });

  cellMatrix[2].map((el, ind) => {
    if (ind === 3) {
      el.state = 'alive';
    } else if (ind !== 3 && ind < 5) {
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
}
