const board = document.getElementById("board");
const playBtn = document.getElementById("playBtn");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const scoreText = document.getElementById("score");
const movesText = document.getElementById("moves");

const fruits = ["🍎", "🍌", "🍇", "🍒", "🍋", "🥝"];
const levelText = document.getElementById("level");
const coinsText = document.getElementById("coins");

let level = 1;
let coins = 0;
let score = 0;
let moves = 30;
let firstCell = null;
let busy = false;


// ===============================
// PLAY
// ===============================

playBtn.onclick = () => {

    startScreen.style.display = "none";
    gameScreen.style.display = "block";

    score = 0;
    moves = 30;
    firstCell = null;
levelText.textContent = level;
coinsText.textContent = coins;
    createBoard();
};


// ===============================
// CREATE BOARD
// ===============================

function createBoard() {

    board.innerHTML = "";
    firstCell = null;

    for (let i = 0; i < 64; i++) {

        const cell = document.createElement("div");

        cell.className = "cell";
        cell.textContent = randomFruit();

        cell.addEventListener("click", () => {
            selectCell(cell);
        });

        board.appendChild(cell);
    }

    scoreText.textContent = score;
    movesText.textContent = moves;
}


// ===============================
// RANDOM FRUIT
// ===============================

function randomFruit() {

    return fruits[
        Math.floor(Math.random() * fruits.length)
    ];
}


// ===============================
// SELECT CELL
// ===============================

function selectCell(cell) {

    if (moves <= 0 || busy) return;


    if (firstCell === null) {

        firstCell = cell;
        cell.classList.add("selected");

        return;
    }


    if (firstCell === cell) {

        cell.classList.remove("selected");
        firstCell = null;

        return;
    }


    const temp = firstCell.textContent;

    firstCell.textContent = cell.textContent;
    cell.textContent = temp;

    firstCell.classList.remove("selected");
    firstCell = null;

    moves--;

    movesText.textContent = moves;

    checkMatches();


    if (moves <= 0) {

        setTimeout(() => {

            document.getElementById("finalScore").textContent = score;

            document.getElementById("gameOver").style.display = "flex";

        }, 800);
    }
}


// ===============================
// CHECK MATCHES
// ===============================

function checkMatches() {

    if (busy) return;

    const cells = document.querySelectorAll(".cell");

    const matched = new Set();


    // HORIZONTAL

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 6; col++) {

            const i = row * 8 + col;

            const a = cells[i].textContent;
            const b = cells[i + 1].textContent;
            const c = cells[i + 2].textContent;

            if (a !== "" && a === b && b === c) {

                matched.add(i);
                matched.add(i + 1);
                matched.add(i + 2);
            }
        }
    }


    // VERTICAL

    for (let col = 0; col < 8; col++) {

        for (let row = 0; row < 6; row++) {

            const i = row * 8 + col;

            const a = cells[i].textContent;
            const b = cells[i + 8].textContent;
            const c = cells[i + 16].textContent;

            if (a !== "" && a === b && b === c) {

                matched.add(i);
                matched.add(i + 8);
                matched.add(i + 16);
            }
        }
    }


    // NO MATCH

    if (matched.size === 0) {
        return;
    }


    busy = true;


    // MATCH ANIMATION

    matched.forEach(index => {
        cells[index].classList.add("matched");
    });


    // SCORE

    score += matched.size * 10;

    scoreText.textContent = score;
if (score >= level * 300) {

    document.getElementById("winScore").textContent = score;

    document.getElementById("earnedCoins").textContent = 50;

    document.getElementById("winPopup").style.display = "flex";
}

    // REMOVE + FALL

    setTimeout(() => {

        matched.forEach(index => {
            cells[index].textContent = "";
            cells[index].classList.remove("matched");
        });

        dropFruits();

    }, 300);
}


// ===============================
// DROP FRUITS
// ===============================

function dropFruits() {

    const cells = document.querySelectorAll(".cell");


    for (let col = 0; col < 8; col++) {

        let column = [];


        // Get existing fruits
        for (let row = 7; row >= 0; row--) {

            const index = row * 8 + col;

            if (cells[index].textContent !== "") {

                column.push(cells[index].textContent);
            }
        }


        // Fill column from bottom
        for (let row = 7; row >= 0; row--) {

            const index = row * 8 + col;

            if (column.length > 0) {

                cells[index].textContent = column.shift();

            } else {

                cells[index].textContent = randomFruit();
                cells[index].classList.add("newFruit");

                setTimeout(() => {
                    cells[index].classList.remove("newFruit");
                }, 400);
            }
        }
    }


    // Check chain matches
    setTimeout(() => {

        busy = false;

        checkMatches();

    }, 450);
}


// ===============================
// RESTART
// ===============================

document.getElementById("restartBtn").onclick = () => {

    score = 0;
    moves = 30;
    firstCell = null;
    busy = false;

    document.getElementById("gameOver").style.display = "none";

    createBoard();
};


// ===============================
// PLAY AGAIN
// ===============================

document.getElementById("playAgainBtn").onclick = () => {

    document.getElementById("gameOver").style.display = "none";

    score = 0;
    moves = 30;
    firstCell = null;
    busy = false;

    createBoard();
};// ===============================
// NEXT LEVEL
// ===============================

document.getElementById("nextLevelBtn").onclick = () => {

    document.getElementById("winPopup").style.display = "none";

    level++;
    coins += 50;

    levelText.textContent = level;
    coinsText.textContent = coins;

    score = 0;
    moves = 30;
    firstCell = null;
    busy = false;

    scoreText.textContent = score;
    movesText.textContent = moves;

    createBoard();
};
