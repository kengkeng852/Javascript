// Step by step of this application
// 1. Despot some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user their winnings
// 7. play again

const prompt = require("prompt-sync")(); // Import prompt-sync

const ROWs = 3;
const COLs = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    //loop until a valid deposit amount is entered
    const numberOfLines = parseFloat(
      prompt("Please enter the amount you would like to deposit: ")
    );

    if (isNaN(numberOfLines) || numberOfLines <= 0) {
      console.log("Please enter a valid deposit amount");
    } else {
      return numberOfLines;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    //loop until a valid number of lines is entered
    const numberOfLines = parseFloat(
      prompt("Enter the number of lines to bet on (1-3): ")
    );

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Please enter a valid number of lines");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = parseFloat(prompt("Enter the total bet amount per line: "));

    if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
      console.log("Please enter a valid amount of bet");
    } else {
      return bet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [[], [], []];
  for (let i = 0; i < COLs; i++) {
    const reelSymbols = [...symbols]; //use spread syntax
    for (let j = 0; j < ROWs; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1); //delete data in the array in random index position and delete just 1
    }
  }

  return reels;
};
// [[D C A ],[D D B],[D C A]]

// we need to transpose

// D D D
// C D C
// A B A

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWs; i++) {
    rows.push([]); // it will look like this [+[],...go on every loop]
    for (let j = 0; j < COLs; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const printSlotMachine = (rows) => {
  for (const row of rows) {
    //row get every single values of rows array
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (let symbol of symbols) {
      if (symbol != symbols[0]) {
        // check with just on position it can know that it not all the same if second not the same with the first one.
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOLS_VALUES[symbols[0]]; //ex SYMBOLS_VALUES["A"] = 5
    }
  }

  return winnings;
};
const game = () => {
  let balance = deposit();

  while (true) {
    //game will loop every time when user want to pay again
    console.log("Your balance now is $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printSlotMachine(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("You won, $" + winnings);

    if (balance <= 0) {
      console.log("You ran out your money");
      break;
    }

    const playAgain = prompt("Do you want to play again? (y/n)");

    if ((playAgain != "y") | "Y") {
      break;
    }
  }
};

game();
