const playerSquares = []
const aiSquares = []
const width = 10

const directions = ["horizontal", "vertical"]

const shipsArray = [
    {
        name: 'destroyer',
        directions: {
            horizontal: [0, 1],
            vertical: [0, width]
        }
    },
    {
        name: 'submarine',
        directions: {
            horizontal: [0, 1, 2],
            vertical: [0, width, width*2]
        }
    },
    {
        name: 'cruiser',
        directions: {
            horizontal: [0, 1, 2],
            vertical: [0, width, width*2]
        }
    },
    {
        name: 'battleship',
        directions: {
            horizontal: [0, 1, 2, 3],
            vertical: [0, width, width*2, width*3]
        }
    },
    {
        name: 'carrier',
        directions: {
            horizontal: [0, 1, 2, 3, 4],
            vertical: [0, width, width*2, width*3, width*4]
        }
    }
];

const game = {
    currentPlayer: "Player",
    score: {
        player: {
            destroyer: 2,
            submarine: 3,
            cruiser: 3, 
            battleship: 4,
            carrier: 5,
            total: 0
        },
        ai: {
            destroyer: 2,
            submarine: 3,
            cruiser: 3, 
            battleship: 4,
            carrier: 5,
            total: 0
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const playerGrid = document.querySelector('.grid-player');
    const aiGrid = document.querySelector('.grid-ai');
    const shipsContainer = document.querySelector('ships-container');
    const ships = document.querySelectorAll('.ship');


    const startButton = document.querySelector('#start');
    const randomizeButton = document.querySelector('#randomize');
    const turnDisplay = document.querySelector('#whose-turn');
    const resetButton = document.querySelector('#reset');

    renderBoard(playerGrid, playerSquares, width);
    renderBoard(aiGrid, aiSquares, width);

    shipsContainer.addEventListener('click', e => {
        if(e.target.parentElement.matches('div.ship'))
        rotate(e.target.parentElement)
    });

    const target = {
        shipNameWithId:'',
        ship:'',
        shipLength: 0
    };

    shipsContainer.addEventListener('mousedown', e => {
        grabShip(e, target);
    });
console.log('first ship in ships array: ',ships[0]);
    ships.forEach(ship => ship.addEventListener('dragstart', e => {dragStart(e, target)}));

    playerGrid.addEventListener('dragover', dragOver);
    playerGrid.addEventListener('dragenter', dragEnter);
    playerGrid.addEventListener('dragleave', dragLeave);
    playerGrid.addEventListener('drop', e => {dragDrop(e, target, playerSquares, shipsContainer)});
    playerGrid.addEventListener('dragend', dragEnd);

    randomizeButton.addEventListener('click', e => {
        if(shipsContainer.childElementCount == 5){
            shipsArray.forEach(ship => generate(directions, ship, playerSquares));
            [...shipsContainer.childNodes].forEach(node => node.remove());
        }else{
            reset(e, shipsContainer);
            shipsArray.forEach(ship => generate(directions, ship, playerSquares));
            [...shipsContainer.childNodes].forEach(node => node.remove());
        }
    });

//Reset button functionality
    resetButton.addEventListener('click', e => {
        startButton.disabled = false;
        reset(e, shipsContainer)
    })
});

function reset (e, shipsContainer) {
    playerSquares.forEach(square => {
        if(square.classList.contains('taken')){
            square.className = '';
        }
    })
    if(shipsContainer){
        shipsContainer.innerHTML = `
        <div class="ship destroyer-container" draggable="true">
            <div id="destroyer-0></div>
            <div id="destroyer-1"></div>
        </div>
        <div class="ship submarine-container" draggable="true">
            <div id="submarine-0"></div>
            <div id="submarine-1"></div>
            <div id="submarine-2"></div>
        </div>
        <div class="ship cruiser-container" draggable="true">
            <div id="cruiser-0"></div>
            <div id="cruiser-1"></div>
            <div id="cruiser-2"></div>
        </div>
        <div class="ship battleship-container" draggable="true">
            <div id="battleship-0"></div>
            <div id="battleship-1"></div>
            <div id="battleship-2"></div>
            <div id="battleship-3"></div>
        </div>
        <div class="ship carrier-container" draggable="true">
            <div id="carrier-0"></div>
            <div id="carrier-1"></div>
            <div id="carrier-2"></div>
            <div id="carrier-3"></div>
            <div id="carrier-4"></div>
        </div>`
    }
};

// The following function is written to render the board by taking in
// parameters: the 'grid' which we need squares for,
// the 'squares' array is to keep record of the different squares created,
// and the 'width' of the board to know how many squares to create.
function renderBoard(grid, squares, width) {
    console.log('inside renderBoard:', grid)
    for(let i = 0; i < width * width; i++){
        const square = document.createElement('div');
        square.dataset.id = i;
        grid.appenChild(square);
        squares.push(square);
    }
};


function generate(dir, ship, squares){
    let randomDirection = dir[Math.floor(Math.random() * dir.length)];
    let current = ship.directions[randomDirection];

    let direction = randomDirection === "horizontal" ? 1 : 10;
    let randomStart = Math.abs(Math.floor(Math.random() * squares.length - (ship.directions["horizontal"].length * direction)));
    // console.log(randomStart)

    const isTaken = current.some(index => squares[randomStart + index].classList.contains('taken'));
    const isAtRightEdge = current.some(index => (randomStart + index) % 10 === 9)
    const isAtLeftEdge = current.some(index => (randomStart + index) % 10 === 0)

    if(!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => squares[randomStart + index].classList.add('taken', ship.name, 'ship'))
};

function rotate(ship){
    console.log(ship)
    console.log(ship.classList[1])
    ship.classList.toggle(`${ship.classList[1]}-vertical`)
};

function grabShip(e, target){
    console.log('grabShip e.target: ', e.target);
    target['shipNameWithId'] = e.target.id;
};

function dragOver(e){
    e.preventDefault();
};
function dragEnter(e){
    e.preventDefault();
};
function dragLeave(){
    console.warn('leaving')
};
function dragEnd(){
};

function dragDrop(e, target, squares, container){
    let draggedShipNameWithLastId = target.ship.lastElementChild.id;
    let draggedShipClass = draggedShipNameWithLastId.slice(0, -2);
    let draggedShipLastIndex = parseInt(draggedShipNameWithLastId.substr(-1));
    let draggedShipIndex = parseInt(target.shipNameWithId.substr(-1));
    let receivingSquare = parseInt(e.target.dataset.id);
    let droppedShipFirstId = receivingSquare - draggedShipIndex;
    let droppedShipLastId = draggedShipLastIndex - draggedShipIndex + receivingSquare;
    
    let isVertical = [...target.ship.classList].some(className => className.includes('vertical'));

    if(!isVertical){
        console.log('it is horizontal')
        let current = shipsArray.find(ship => ship.name === draggedShipClass).directions.horizontal;
        let isTaken = current.some(index => squares[droppedShipFirstId +index].classList.contains('taken', draggedShipClass, 'ship'));
        if(Math.floor(droppedShipLastId / 10) === Math.floor(receivingSquare / 10) && !isTaken){
            console.log('it fits on the same line and none of the squares are already taken');
            for(let i = 0; i < target.shipLength; i++){
                squares[receivingSquare - draggedShipIndex + i].classList.add('taken', draggedShipClass, 'ship')
            }
            container.removeChild(target.ship);
        }else{
            //error flag
            console.log('Warning, logic error please revise code.')
        }
    }else{
        let current = shipsArray.find(ship => ship.name === draggedShipClass).directions.vertical;
        let isTaken = current.some(index => squares[droppedShipFirstId +index].classList.contains('taken'));
    
        if(receivingSquare + (target.shipLength - 1)* 10 < 100 && !isTaken){
            for(let i = 0; i < target.shipLength; i++){
                squares[receivingSquare - draggedShipIndex + (10 * i)].classList.add('taken', draggedShipClass, 'ship')
            }
            container.removeChild(target.ship);
        }else{
            //error flag
            console.log('Warning, logic error please revise code.')
        }
    }
    if(!container.querySelector('.ship')) allShipsInPlace = true;
};

//This is some annoyingly tedious logic and im conflicted that this is all I managed to get done today.
//happy i got through it, dissapointed I couldnt get further