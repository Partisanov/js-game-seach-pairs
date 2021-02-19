let cards = document.querySelectorAll('.card-box');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let countpairs = document.querySelector('.inpt');
let countFlipCard = 4;
let cardContainer = document.querySelector('.container');

function createCard(num) {
  let cardBox = document.createElement('div');
  let frontFace = document.createElement('span');
  let backFase = document.createElement('img');
  cardBox.classList.add('card-box');
  cardBox.setAttribute('data-name', num);
  frontFace.classList.add('front-face');
  frontFace.innerText = num;
  backFase.classList.add('back-face');
  backFase.src = "img/js-badge.svg";
  backFase.alt = "Memory Card";
  cardBox.append(frontFace);
  cardBox.append(backFase);
  cardContainer.append(cardBox);

}
function addCards(cardArr) {
  cardArr.forEach(function(number) {
    createCard(number)
  });
  cardArr.forEach(function(number) {
    createCard(number)
  });
  cards = document.querySelectorAll('.card-box');
}


function pageReset () {
  cardContainer.innerHTML = '';
  const pairsAr  = Array.from({length: countFlipCard}, (v, k) => k+1);
  addCards(pairsAr);
  btnReset.textContent = 'Сыграть еще раз!';
  for (let i = 0 ;i < cards.length;i++) {
    cards[i].classList.remove('flip');
  }
  shuffle();
  cards.forEach(card => card.addEventListener('click', flipCard));
  countFlipCard = parseInt(countpairs.value);
  console.log(pairsAr)
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
  if (countFlipCard == 0 ) btnReset.style.display = 'block';
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
    let ramdomPos = Math.floor(Math.random() * 16);
    card.style.order = ramdomPos;
  });
}

(function gameTime() {
  setTimeout('alert("прошла минута")', 60000);
})();

cards.forEach(card => card.addEventListener('click', flipCard));
window.onload = shuffle;
