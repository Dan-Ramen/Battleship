const playerSquares = [];
const aiSquares = [];
const width = 10;

const directions = ["horizontal", "vertical"];

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
            vertical: [0, width, width * 2]
        }
    },
    {
        name: 'battleship',
        directions: {
            horizontal: [0, 1, 2, 3],
            vertical: [0, width, width * 2, width * 3]
        }
    },
    {
        name: 'carrier',
        directions: {
            horizontal: [0, 1, 2, 3, 4],
            vertical: [0, width, width * 2, width * 3, width * 4]
        }
    }
];

const game = {
    currentPlayer: "player",
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
    const shipsContainer = document.querySelector('.ships-container');
    const ships = document.querySelectorAll('.ship');

    const singlePlayerBtn = document.querySelector('#singlePlayerButton');

    let gameMode = "";
    let currentPlayer = "user";

    // Select Player Mode
    singlePlayerBtn.addEventListener('click', startSinglePlayer);

    // Single player Function
    function startSinglePlayer(){
        gameMode = 'singlePlayer';
        shipsArray.forEach(ship => generate(directions, ship, aiSquares));
        startButton.addEventListener('click', e => {
            if(shipsContainer.childElementCount == 0){
                aiGrid.addEventListener('click', e => revealSquare(e.target, game, turnsDisplay, aiGrid));
                playGameSingle(game, turnsDisplay, aiGrid);
                // debugger;
                startButton.disabled = true;
            }else{
                //show informative message asking player to place all his ships in Grid
            }
        })
    };

    const startButton = document.querySelector('#start');
    const randomizeButton = document.querySelector('#randomize');
    const turnsDisplay = document.querySelector('#whose-go');
    const resetButton = document.querySelector('#reset');

    renderBoard(playerGrid, playerSquares, width);
    renderBoard(aiGrid, aiSquares, width);

    //Click the ship to rotate it before placing it
    shipsContainer.addEventListener('click', e => {
        if(e.target.parentElement.matches('div.ship'))
            rotate(e.target.parentElement);
    });

    
    const target = {
        shipNameWithId:'',
        ship:'',
        shipLength: 0
    }
    
    //following event listeners are how the drag/drop work
    shipsContainer.addEventListener('mousedown', e => {
        grabShip(e, target);
    });

    ships.forEach(ship => ship.addEventListener('dragstart', e => {dragStart(e, target)}));

    playerGrid.addEventListener('dragover', dragOver);

    playerGrid.addEventListener('dragenter', dragEnter);

    playerGrid.addEventListener('dragleave', dragLeave);

    playerGrid.addEventListener('drop', e => {dragDrop(e, target, playerSquares, shipsContainer)});

    playerGrid.addEventListener('dragend', dragEnd);

    
    //Randomly places player ships within your board
    randomizeButton.addEventListener('click', e => {
        if(shipsContainer.childElementCount == 5){
            shipsArray.forEach(ship => generate(directions, ship, playerSquares));
            [...shipsContainer.childNodes].forEach(node => node.remove());
        }else {
            reset(e,shipsContainer);
            shipsArray.forEach(ship => generate(directions, ship, playerSquares));
            [...shipsContainer.childNodes].forEach(node => node.remove());
        }
    });

    //Reset button removes ships from play and places hem back in the container
    resetButton.addEventListener('click', e => {
        startButton.disabled = false;
        reset(e, shipsContainer);
    });
});

function reset (e,shipsContainer) {
    //one way to reset the game is to reload the page... but this cannot be reused for the randomize button
    playerSquares.forEach(square => {
        if(square.classList.contains('taken')){
            square.className = '';
        }
    });

    if(shipsContainer){
        shipsContainer.innerHTML = `
            <div class="ship destroyer-container" draggable="true">
                <div id="destroyer-0"></div>
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

// This function, renders the boards for the game,
// it takes in parameters the grid for which we want to create squares for,
// the squares array to keep record of the different squares created,
// and the width of the boards, so we know how many suqare to create.
function renderBoard(grid, squares, width) {
    console.log('inside renderBoard:', grid)
    for(let i = 0; i< width * width; i++){
        const square = document.createElement('div');
        square.dataset.id = i;
        grid.appendChild(square);
        squares.push(square);
    }
};

// This function, places the ships in random positions.
// so this serves as the computer as "ai" player.
function generate(dir, ship, squares){
    let randomDirection = dir[Math.floor(Math.random() * dir.length)];
    let current = ship.directions[randomDirection];

    let direction = randomDirection==="horizontal" ? 1 : 10;
    let randomStart = Math.abs(Math.floor(Math.random() * squares.length - (ship.directions["horizontal"].length * direction)));
    // console.log(randomStart)

    const isTaken = current.some(index => squares[randomStart +index].classList.contains('taken'));
    const isAtRightEdge = current.some(index => (randomStart + index) % 10 === 9)
    const isAtLeftEdge = current.some(index => (randomStart + index) % 10 === 0)

    if(!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => squares[randomStart + index].classList.add('taken',ship.name,'ship'))
    else generate(dir, ship, squares)
};

function rotate(ship){
    console.log(ship)
    console.log(ship.classList[1])
    ship.classList.toggle(`${ship.classList[1]}-vertical`)
}

function grabShip(e, target){
    // console.log('grabShip e.target: ', e.target);
    target['shipNameWithId'] = e.target.id;
}

function dragStart(e, target){
    // console.log('start e.target: ', e.target);
    target['ship'] = e.target;
    target['shipLength'] = e.target.childElementCount;
}

function dragOver(e){
    e.preventDefault();
}
function dragEnter(e){
    e.preventDefault();
}
function dragLeave(){
    console.log('leaving')
}

function dragEnd(){
}

function dragDrop(e, target, squares, container){
    let draggedShipNameWithLastId = target.ship.lastElementChild.id;
    let draggedShipClass = draggedShipNameWithLastId.slice(0, -2);
    let draggedShipLastIndex = parseInt(draggedShipNameWithLastId.substr(-1));
    let draggedShipIndex = parseInt(target.shipNameWithId.substr(-1));
    let receivingSquare = parseInt(e.target.dataset.id);
    let droppedShipFirstId =  receivingSquare - draggedShipIndex;
    let droppedShipLastId = draggedShipLastIndex - draggedShipIndex + receivingSquare;

    let isVertical = [...target.ship.classList].some(className => className.includes('vertical'));

    //To let you know if a ship is vertical or not when placing ships manually
    if(!isVertical){
        console.log('it is horizontal');
        let current = shipsArray.find(ship => ship.name === draggedShipClass).directions.horizontal;
        let isTaken = current.some(index => squares[droppedShipFirstId + index].classList.contains('taken'));
        if( Math.floor(droppedShipLastId / 10) === Math.floor(receivingSquare/10) && !isTaken){
            console.log('it fits on the same line and none of the squares are already taken');
            for(let i = 0; i < target.shipLength; i++){
                squares[receivingSquare - draggedShipIndex + i].classList.add('taken', draggedShipClass, 'ship')
            }
            container.removeChild(target.ship);
        }else{
            // show some kind of warning...
            console.log('ERR')
        }
    }else{
        let current = shipsArray.find(ship => ship.name === draggedShipClass).directions.vertical;
        let isTaken = current.some(index => squares[droppedShipFirstId +index].classList.contains('taken'));

        //checking if a square is already occupied or not.
        if( receivingSquare + (target.shipLength - 1) * 10 < 100 && !isTaken){
            for(let i = 0; i < target.shipLength; i++){
                squares[receivingSquare - draggedShipIndex + (10 * i)].classList.add('taken', draggedShipClass, 'ship')
            }
            container.removeChild(target.ship);
        }else{
            //show some kind of warning...
            console.log('ERR')
        }
    }
    if(!container.querySelector('.ship')) allShipsInPlace = true;
};

//checking if a square isoccupied or not then returning the hit/missed (firing a shot)
function revealSquare(square, game, turnsDisplay, aiGrid){
    console.log('aiGrid passed to revealSquare', aiGrid)
    if(!square.classList.contains('revealed'))
    {
        if(square.classList.contains('taken')){
            game.score[game.currentPlayer][square.classList[0]] -= 1;
            game.score[game.currentPlayer].total += 1;
            square.classList.add('revealed','hit')
        }else{
            square.classList.add('revealed', 'miss')
        }
        document.querySelector(`#score #${game.currentPlayer}-score`).textContent = game.score[game.currentPlayer].total;
        game.currentPlayer = game.currentPlayer === 'player' ? 'ai' : 'player';
        if(game.score[game.currentPlayer].total === 17)
            gameOver();
        else
            playGameSingle(game, turnsDisplay, aiGrid);
    }
};

// Game Logic for "single player"
function playGameSingle(game, turnsDisplay, aiGrid){
    console.log('aiGrid passed to playGame', aiGrid);
    if(game.currentPlayer === 'player'){
        turnsDisplay.textContent = 'Your Go';
        aiGrid.style.pointerEvents = 'auto';
    }else if(game.currentPlayer === 'ai'){ 
        aiGrid.style.pointerEvents = 'none';
        turnsDisplay.textContent = 'Opponent Go';
        setTimeout (() => {
            let random = Math.floor(Math.random() * playerSquares.length);
            revealSquare(playerSquares[random], game, turnsDisplay, aiGrid);
        }, 1000)
    }else
        return;
};

function gameOver(){
    window.alert("Game Over");
};