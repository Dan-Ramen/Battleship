# Battleship (the Game)
When assigned with this task of trying to recreate a game fromscratch I originally set out to try and recreate a pokemon gym including movement, small puzzles and trainer battles.

But that was too ambitious for me so I went with the next best thing (to me), I decided to build one of my favorite table-top games "Battleships".

I will use this README to explain the thought process I went through to build the game.

[Battleship (game) Wiki](https://en.wikipedia.org/wiki/Battleship_(game)).

Above is a link to the Wikipedia article, explaining the strategy game, rules, and the setup for you who aren't familiar with the game.

=============================
## How to Play my Game
Well it's simple really, there are instructions under the game but follow these steps:

1. Click the "Single Player" button.

2. Drag and drop your ships on your board (left) or click "Randomize Ships" to randomly set up your board.

3. Click "Start Game".

4. Now click on the enemy board (right) and sink all of their ships before they sink yours!

============================
# Technologies Used
### HTML
> To create the physical "look" on the page for the game.

### JavaScript
> To create the functionality and gameplay loops for the game to function.

### CSS
> To customize and alter the HTML and how it looks to translate changes in the game.

================================
# How I Built my Game

### Where to start?
Initially I decided to split up the work at first, starting with creating all the necessary divs i'd need in the HTML to make the face of my game. I knew I would need a container to hold the ships that the player can drag/drop, a container to act as the player's game board and a container to act as the enemy's gameboard.

### The main components of my game:
_Player grid_: a square grid for each player representing the battleground. The player will have the freedom to place their ships either horizontally or vertically wherever it pleases them within the grid.
Every little square in that grid represents a slot for the ships, so a five slot ship occupies five squares, and once hit once, the whole square will be marked.

_Opponent grid_: same as the player grid, the opponent has his own. In our case, the opponent will be the computer. This means our solution will have to cover the opponent’s functionalities.

_Ships_: for simplicity ships are rectangles of different sizes, 2, 3, 4, and 5 squares. We need to be able to drag and change the direction of the ships.

_Score_ and  _Turn_: a small header to display info, like who’s turn it is and what is the current score.

### HTML
My HTML page is simple, I have two main parts, one for the ships’ container (containing all my ships before I place them on the board) and the board where I have the grids displaying the game information. The container is a DIV element containing five different DIV elements, one for each ship. And also every ship depending on its type and size contains DIV elements with ids. The second part of our interface, as I mentioned before, has a header where the game information is displayed and the buttons for the game controls are. The Grids are empty Divs because I will create a rendering method to fill them with small square divs later in my JavaScript.

### CSS
My CSS is very simple also, I am using it to set the dimensions (width and height) of my elements. I also use CSS to set background colors for different divs depends on what those divs represent.

### JavaScript
Where all the magic happens!! kidding there is no magic here, only logic and code.

Two main things are happening in my script:
first, finish rendering the interface. Second, set up listeners for the different functionalities.

- Rendering
I created a method called "renderBoard()" to help me render the 100 square Divs in my Grid div. 
It accepts as parameters _Grid_: the parent Div where I want my grid to be rendered.

_Squares_: an array where I am keeping a copy of my squares for programmatic purposes.

And _Width_: an integer value for the width of my square in case I decided to change it at some point.

The method then loops through width*width creating a new div element every time and assigning an id to it.
Then it appends that element to the parent grid and to the array to keep track of it.

This method gets called twice, once passing the player grid and array and once passing the opponent’s grid and array.

### Functionalities
The method “generate()” accepts _Dir_: an array with the possible directions of a ship, horizontal and vertical in our case.

_Ship_: a specific ship that will be placed at a random position in the grid.

_Squares_: an array with the grid squares’ in question.

“generate()” does pick a random direction and uses the ship in that direction to check for a random start that all the squares are available and within the borders of the board.

if so it marks the squares by adding classes ‘taken’, ‘<ship.name>’, and ’ship’ to the square div otherwise it calls itself again to choose another random position.

A method called “rotate()” accepts ‘ship’ as a parameter — a ship is a div element representing one of the 5 ships in the game — and it rotates it by toggling the name of the ship-vertical class name. The rotate function is called on click event on any ship while it is still in the ships’ container.

Another functionality needed is to allow the player to manually place their own ships on their board. For that, I created a method called “dragDrop()” which is called on drop event of a ship.

“dragDrop()” accepts as parameters
_e_: the event object referencing the div receiving the drop, and other data related to the drop event.

_target_: an object holding info about the ship that is being dropped, its direction, and its length.

_squares_: the array holding the player’s grid information where we are placing the ships.

_container_: which is the ship’s container so we can remove the ship in question once it is placed.
once called the method figure the ship, the ship size, the receiving square in the grid, the start and the end of the dropped ship. Knowing the direction of the ship the method makes sure that no square where the ship should be placed is already taken and that the ship fits the grid div. If so it places it and removes it from the container, otherwise the ship appears back in the container and no changes happen in the grid.

===============================
# Acknowledgments
In my case I didn't really work with many people in regards to my code, most of my "Help" was done through extensive solo research on syntax and applications we haven't necessarily used in class.
Some websites used include:
### Web MDN
- [MDN](https://developer.mozilla.org/en-US/)

### W3Schools
- [W3Schools](https://www.w3schools.com/)

### Uses of the Spread Operator (...)
- [Spread Operator ...](https://codeburst.io/what-are-three-dots-in-javascript-6f09476b03e1)
