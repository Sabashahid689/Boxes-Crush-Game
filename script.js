const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const width = 8;
const squares = [];
let score = 0;

const candyColors = [
  'candy1',
  'candy2',
  'candy3',
  'candy4',
  'candy5',
  'candy6'
];

// Create Board
function createBoard() {
  for (let i = 0; i < width*width; i++) {
    const square = document.createElement('div');
    let randomColor = Math.floor(Math.random() * candyColors.length);
    square.classList.add('candy', candyColors[randomColor]);
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    grid.appendChild(square);
    squares.push(square);
  }
}

createBoard();

// Dragging candies
let colorBeingDragged;
let colorBeingReplaced;
let squareIdBeingDragged;
let squareIdBeingReplaced;

squares.forEach(square => square.addEventListener('dragstart', dragStart));
squares.forEach(square => square.addEventListener('dragend', dragEnd));
squares.forEach(square => square.addEventListener('dragover', dragOver));
squares.forEach(square => square.addEventListener('dragenter', dragEnter));
squares.forEach(square => square.addEventListener('dragleave', dragLeave));
squares.forEach(square => square.addEventListener('drop', dragDrop));

function dragStart() {
  colorBeingDragged = this.className;
  squareIdBeingDragged = parseInt(this.id);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {
}

function dragDrop() {
  colorBeingReplaced = this.className;
  squareIdBeingReplaced = parseInt(this.id);
  this.className = colorBeingDragged;
  squares[squareIdBeingDragged].className = colorBeingReplaced;
}

function dragEnd() {
  // valid moves
  let validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + 1,
    squareIdBeingDragged + width
  ];

  let validMove = validMoves.includes(squareIdBeingReplaced);

  if (squareIdBeingReplaced && validMove) {
    squareIdBeingReplaced = null;
  } else if (squareIdBeingReplaced && !validMove) {
    squares[squareIdBeingReplaced].className = colorBeingReplaced;
    squares[squareIdBeingDragged].className = colorBeingDragged;
  } else squares[squareIdBeingDragged].className = colorBeingDragged;
}

// Checking for matches
function checkRowForThree() {
  for (let i = 0; i < 64; i++) {
    let rowOfThree = [i, i+1, i+2];
    let decidedColor = squares[i].className;
    const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55];
    if (notValid.includes(i)) continue;

    if (rowOfThree.every(index => squares[index].className === decidedColor && squares[index].className.includes('candy'))) {
      rowOfThree.forEach(index => {
        squares[index].className = '';
      });
      score += 3;
      scoreDisplay.textContent = score;
    }
  }
}

function checkColumnForThree() {
  for (let i = 0; i < 48; i++) {
    let columnOfThree = [i, i+width, i+width*2];
    let decidedColor = squares[i].className;

    if (columnOfThree.every(index => squares[index].className === decidedColor && squares[index].className.includes('candy'))) {
      columnOfThree.forEach(index => {
        squares[index].className = '';
      });
      score += 3;
      scoreDisplay.textContent = score;
    }
  }
}

// Move candies down
function moveDown() {
  for (let i = 0; i < 56; i++) {
    if (squares[i + width].className === '') {
      squares[i + width].className = squares[i].className;
      squares[i].className = '';
    }

    const firstRow = [0,1,2,3,4,5,6,7];
    firstRow.forEach(index => {
      if (squares[index].className === '') {
        let randomColor = Math.floor(Math.random() * candyColors.length);
        squares[index].className = 'candy ' + candyColors[randomColor];
      }
    });
  }
}

// Game loop
window.setInterval(function() {
  checkRowForThree();
  checkColumnForThree();
  moveDown();
}, 100);
