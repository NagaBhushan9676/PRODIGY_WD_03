const cells = document.querySelectorAll(".tile");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const container = document.querySelector("container");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let againstAI = false; // Initially play against another player

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;

    const opponentSelect = document.querySelector("#opponentSelect");
    opponentSelect.addEventListener("change", function() {
        againstAI = this.checked;
        restartGame();
    });
}

function cellClicked() {
    const cellIndex = this.getAttribute("data-index");

    if (options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    if (againstAI && running && currentPlayer === "O") {
        // Delay AI move slightly for visual effect
        setTimeout(() => {
            makeAIMove();
        }, 500);
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.backgroundColor = (currentPlayer == "X") ? "rgba(123,55,150,0.8)" : "rgba(175,222,0,0.8)";
}

function changePlayer() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

let roundWon = false;

function checkWinner() {
    roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.backgroundColor = "transparent";
    });
}

function makeAIMove() {
    // Generate a random available cell index
    let emptyCells = options.reduce((acc, val, index) => {
        if (val === "") {
            acc.push(index);
        }
        return acc;
    }, []);

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = cells[randomIndex];
    
    updateCell(cell, randomIndex);
    checkWinner();
}
