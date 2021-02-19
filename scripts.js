let cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let menu = document.querySelector('.section-menu')
let countFlipCard = 4;
let cardWrapper = document.querySelector('.card-wrapper');

function createCard(num) {
  let newCard = document.createElement('div');
  let frontFace = document.createElement('span');
  let backFace = document.createElement('img');
  newCard.classList.add('card');
  newCard.setAttribute('data-name', num);
  frontFace.classList.add('front-face');
  frontFace.innerText = num;
  backFace.classList.add('back-face');
  backFace.src = "img/js-badge.svg";
  backFace.alt = "Memory Card";
  newCard.append(frontFace);
  newCard.append(backFace);
  cardWrapper.append(newCard);

}
function addCards(cardArr) {
  cardArr.forEach(function(number) {
    createCard(number)
  });
  cardArr.forEach(function(number) {
    createCard(number)
  });
  cards = document.querySelectorAll('.card');
}


function pageReset () {
  menu.style.display = 'none';
  let countPairs = document.querySelector('.inpt');
  countFlipCard = parseInt(countPairs.value);
  cardWrapper.innerHTML = '';
  const pairsAr  = Array.from({length: countFlipCard}, (v, k) => k+1);
  addCards(pairsAr);
  btnReset.textContent = 'Сыграть еще раз!';
  for (let i = 0 ;i < cards.length;i++) {
    cards[i].classList.remove('flip');
  }
  shuffle();
  cards.forEach(card => card.addEventListener('click', flipCard));
}

let btnReset = document.querySelector('.btn');
btnReset.addEventListener("click", pageReset);

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}


function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  countFlipCard -=1 ;
  if (countFlipCard == 0 ) menu.style.display = 'block';
  resetBoard();
}




function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });
}

(function gameTime() {
  setTimeout(() => {
    menu.style.display = 'block';
    menu.style.backgroundColor = "#AA0000";

  }, 60000);
})();

cards.forEach(card => card.addEventListener('click', flipCard));
window.onload = shuffle;
