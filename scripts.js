/* Глобальные настройки и узлы приложения */
// форма настроек игрового поля
const settingsForm = document.getElementById('settings-form');
// поле с количеством пар
const pairsNumField = document.getElementById('cells-num');
// игровое поле
const gameArea = document.getElementById('game-area');
// кнопка запуска игры
const startBtn = document.getElementById('start-game-btn');

// шаблон для игровой костяшки
const cardTemplate = `
  <div class='game-card' data-name='##NUM##'>
    <span class='front-face'>##NUM##</span>
    <img class='back-face' src='img/js-badge.svg' alt='Memory Card'>
  </div>
`;

// переменная для игровых карточек текущей игры (DOM-элементы)
let gameCards = [];
/*****************************************/

// инициализация игры
function initGame() {
  // количество пар костяшек
  const pairsNum = (pairsNumField.value ** 2)/2;

  // сбрасываем игровое поле к начальному состоянию
  resetGame();
  // устанавливаем ширину игрового поля в зависимости от количества
  // костяшек
  setGameAreaWidth(pairsNum);
  // заполняем игровое поле костяшками
  fillGameAreaWithPairs(pairsNum);
  // перемешиваем карточки
  shuffleCards();

  // навешиваем события на костяшки
  gameCards.forEach( card => {
    card.addEventListener('click', e => {
      flipCard(card);
    });
  });
}

// рандомное перемешивание костяшек игрового поля
function shuffleCards() {
  // количество игровых костяшек
  const cardsNum = gameCards.length;
  gameCards.forEach( card => {
    console.log(card);
    const randomPos = Math.floor( Math.random() * cardsNum);
    card.style.order = randomPos;
  });
}

// переворачивание карточки card
function flipCard(card) {
  // добавляем класс состояния перевёрнутой карточки
  card.classList.add('flip');


}

// устанавливаем ширину игрового поля в зависимости от количества
// костяшек
function setGameAreaWidth(pairsNum) {
  // количество костяшек в одной строке
  const cardsPerRow = pairsNumField.value;

  // отступы по бокам от карточки
  const cardSideMargin = 5;
  // размер одной костяшки
  const cardWidth = 100;
  // общий размер костяшки
  const cardFullWidth = cardWidth + (cardSideMargin * 2);

  // считаем размер игрового поля
  const gameAreaWidth = cardFullWidth * cardsPerRow;
  // устанавливаем ширину игрового поля
  gameArea.style.width = gameAreaWidth + 'px';
}

// заполнение игрового поля парами костяшек
// pairsNum - количество пар костяшек
function fillGameAreaWithPairs(pairsNum) {
  while(pairsNum) {
    // добавляем пару карточек на игровое поле
    addCardsPairToField(pairsNum);
    pairsNum--;
  }

  // сохраняем карточки игрового поля в глобальную переменную
  gameCards = gameArea.querySelectorAll('.game-card');
}

// добавление пары карточек на игровое поле
// cardValue - цифра/число на костяшке
function addCardsPairToField(cardValue) {
  // создаём пару карточек в игровом поле
  createCard(cardValue);
  createCard(cardValue);
}

// создаём косятшку с номером num для игрового поля
function createCard(num) {
  const card = cardTemplate.replaceAll('##NUM##', num);
  gameArea.insertAdjacentHTML('beforeend', card);
}

// сброс игрового поля к начальному состоянию
function resetGame() {
  // удаляем все костяшки
  gameArea.innerHTML = '';
  // сброс ширины игрового поля
  gameArea.style.width = '';
  // удаляем все костяшки текущей игры
  gameCards = [];
}

// навешиваем хендлеры при загрузке документа
window.addEventListener('load', () => {
  settingsForm.addEventListener('submit', e => {
    // отключаем нативное поведение, чтобы форма не отправлялась
    e.preventDefault();
    // инициализируем игровое поле
    initGame();
  });
});

let cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let menu = document.querySelector('.section-menu')
let countFlipCard = 4;

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

// let btnReset = document.querySelector('.btn');
// btnReset.addEventListener("click", pageReset);

// function flipCard() {
//   if (lockBoard) return;
//   if (this === firstCard) return;
//
//   this.classList.add('flip');
//
//   if (!hasFlippedCard) {
//     hasFlippedCard = true;
//     firstCard = this;
//     return;
//   }
//
//   secondCard = this;
//   lockBoard = true;
//
//   checkForMatch();
// }

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

// (function gameTime() {
//   setTimeout(() => {
//     menu.style.display = 'block';
//     menu.style.backgroundColor = "#AA0000";
//
//   }, 60000);
// })();

