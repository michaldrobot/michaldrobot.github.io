const cardContainer = document.querySelector('.memory-game'); // Reference to the card container
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let matchedCards = 0; // Track the number of matched cards
let level = 1; // Start at level 1
let timer; // Reference to the timer
let timeLeft = 30; // Time in seconds for each level

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // First click
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  // Second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    incrementScore(); // Increment score for a match
    disableCards();
    matchedCards += 2; // Increment matched cards count
    checkGameOver(); // Check if all cards are matched
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function incrementScore() {
  score++;
  document.getElementById('score').textContent = `Punkty: ${score}`;
}

function startTimer() {
  clearInterval(timer); // Clear any existing timer
  timeLeft = 30; // Set the timer to 30 seconds
  document.getElementById('timer').textContent = `Czas: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Czas: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer); // Stop the timer
      showEndGameOverlay(); // Show the end-game overlay
    }
  }, 1000); // Update every second
}

function resetGame() {
  clearInterval(timer); // Stop the timer
  matchedCards = 0;
  score = 0;
  document.getElementById('score').textContent = `Punkty: ${score}`;
  document.getElementById('level').textContent = `Poziom: ${level}`; // Update level display

  // Hide the end-game overlay if it was shown
  document.getElementById('end-game-overlay').style.display = 'none';

  // Clear existing cards
  cardContainer.innerHTML = '';

  // Generate new cards based on the level
  generateCards(level);

  // Shuffle the cards
  shuffle();

  // Flip all cards for 1 second
  const allCards = document.querySelectorAll('.memory-card');

  allCards.forEach(card => card.classList.add('flip')); // Unflip all cards after 1 second

  setTimeout(() => {
    allCards.forEach(card => card.classList.remove('flip')); // Unflip all cards after 1 second

    // Reset the board state
    resetBoard();

    // Start the timer for the new level
    startTimer();
  }, 1000); // Wait for 1 second
}

function generateCards(level) {
  const frameworks = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']; // Example frameworks
  const totalPairs = 2 + level * 2; // Increase the number of pairs as the level increases
  const selectedFrameworks = frameworks.slice(0, totalPairs); // Select frameworks for this level
  const cardsData = [...selectedFrameworks, ...selectedFrameworks]; // Duplicate for pairs

  // Shuffle the card data
  cardsData.sort(() => Math.random() - 0.5);

  // Create card elements
  cardsData.forEach(framework => {
    const card = document.createElement('div');
    card.classList.add('memory-card'); 
    card.dataset.framework = framework;

    card.innerHTML = `
      <img class="front-face" src="../img/${framework}.jpg" alt="${framework}" />
      <img class="back-face" src="../img/cardBack.jpg" alt="JS Badge" />
    `;

    cardContainer.appendChild(card);
  });

  // Add event listeners to the new cards
  const newCards = document.querySelectorAll('.memory-card');
  newCards.forEach(card => card.addEventListener('click', flipCard));
}

function checkGameOver() {
  if (matchedCards === document.querySelectorAll('.memory-card').length) {
    clearInterval(timer); // Stop the timer
    setTimeout(() => {
      if (level === 3) {
        showWinnerOverlay(); // Show the winner overlay after level 4
      } else {
        showLevelCompletedOverlay(level); // Show the "Level Completed" overlay
      }
    }, 1000); // Delay before showing the overlay
  }
}

function shuffle() {
  const cards = document.querySelectorAll('.memory-card');
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}

function showEndGameOverlay() {
  document.getElementById('end-game-overlay').style.display = 'flex'; // Show the end-game overlay
}

function showLevelCompletedOverlay(level) {
  const levelCompletedOverlay = document.getElementById('level-completed-overlay');
  const levelCompletedImage = document.getElementById('level-completed-image');
  const levelCompletedText = document.getElementById('level-completed-text');

  // Set the image and text based on the level
  levelCompletedImage.src = `../img/level${level}.jpg`; // Example: level-1-completed.png
  levelCompletedText.textContent = `Brawo! Nalezy sie nagroda po poziomie ${level}!`;

  levelCompletedOverlay.style.display = 'flex'; // Show the overlay
}

function showWinnerOverlay() {
  const winnerOverlay = document.getElementById('winner-overlay');
  winnerOverlay.style.display = 'flex'; // Show the winner overlay
}

// Restart the game when the end-game overlay is clicked
document.getElementById('end-game-overlay').addEventListener('click', () => {
  document.getElementById('end-game-overlay').style.display = 'none'; // Hide the end-game overlay
  level = 1; // Reset the level
  resetGame(); // Restart the game
});

// Show the level display and start the game when the logo is clicked
document.getElementById('game-logo').addEventListener('click', () => {
  document.getElementById('game-overlay').style.display = 'none'; // Hide the overlay
  document.querySelector('.memory-game').style.display = 'flex'; // Show the game
  document.getElementById('score').style.display = 'block'; // Show the score
  document.getElementById('level').style.display = 'block'; // Show the level
  document.getElementById('timer').style.display = 'block'; // Show the timer

  resetGame(); // Start the game
});

// Start the next level when the level-completed image is clicked
document.getElementById('level-completed-image').addEventListener('click', () => {
  document.getElementById('level-completed-overlay').style.display = 'none'; // Hide the overlay
  level++; // Increase the level
  resetGame(); // Start the next level
});

// Restart the game when the winner overlay is clicked
document.getElementById('winner-overlay').addEventListener('click', () => {
  document.getElementById('winner-overlay').style.display = 'none'; // Hide the winner overlay
  level = 1; // Reset the level
  resetGame(); // Restart the game
});
