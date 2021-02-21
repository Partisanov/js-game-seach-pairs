/* Глобальные настройки и узлы приложения */
// форма настроек игрового поля
const settingsForm = document.getElementById('settings-form');
// поле с количеством пар
const pairsNumField = document.getElementById('cells-num');
// игровое поле
const gameArea = document.getElementById('game-area');
// кнопка запуска игры
const startBtn = document.getElementById('start-game-btn');
// ограничение на время игры в секундах
const GAME_TIME = 60;

// данные текущей игры
const game = {
  // флаг блокировки игрового поля
  lockboard: false,
  // есть ли на поле перевёрнутая костяшка не в состоянии найденной пары
  hasFlippedCard: false,
  // первая перевёрнутая костяшка на новой итерации поиска пары
  firstCard: null,
  // вторая перевёрнутая костяшка на новой итерации поиска пары
  secondCard: null,
  // переменная для игровых карточек текущей игры (DOM-элементы)
  gameCards: [],
  // флаг завершённой игры
  finished: false,
  // таймер текущей игры
  timer: null
};

// шаблон для игровой костяшки
const cardTemplate = `
  <div class='game-card' data-name='##NUM##'>
    <span class='front-face'>##NUM##</span>
    <img class='back-face' src='img/js-badge.svg' alt='Memory Card'>
  </div>
`;
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
  game.gameCards.forEach( card => {
    card.addEventListener('click', e => {
      flipCard(card);
    });
  });

  // создаём таймер на игру
  game.timer = setTimeout(showGameOverMessage, GAME_TIME * 1000);
}

// рандомное перемешивание костяшек игрового поля
function shuffleCards() {
  // количество игровых костяшек
  const cardsNum = game.gameCards.length;
  game.gameCards.forEach( card => {
    const randomPos = Math.floor( Math.random() * cardsNum);
    card.style.order = randomPos;
  });
}

// переворачивание карточки card
function flipCard(card) {
  // если игровое поле залочено, выходим из функции
  if(game.lockboard === true) {
    return;
  }

  // если костяшка уже имеет пару на игровом поле, то клик
  // по ней не обрабатываем
  if(card.classList.contains('_finded')) {
    return;
  }

  // если на новой итерации одна костяшка перевёрнута и юзер кликнул
  // на неё же, то ничего не предпринимаем и выходим из функции
  if(card === game.firstCard) {
    return;
  }

  // добавляем класс состояния перевёрнутой карточки
  card.classList.add('flip');

  // если это первая перевёрнутая костяшка в новой итерации
  if (!game.hasFlippedCard) {
    game.hasFlippedCard = true;
    game.firstCard = card;
    return;
  }

  // далее считаем, что в новой итерации у нас перевёрнута вторая костяшка
  game.secondCard = card;
  // блокируем игровое поле на время проверки результат
  game.lockboard = true;

  // проверяем результаты игры
  checkGameResults();
}

// проверка игрового хода и, в целом, состояния игры на завершённость
function checkGameResults() {
  // флаг совпадения пары костяшек
  const isMatch =
    game.firstCard.dataset.name === game.secondCard.dataset.name;

  // если костяшки совпали
  if(isMatch) {
    // отмечаем костяшки найдеными
    game.firstCard.classList.add('_finded');
    game.secondCard.classList.add('_finded');
    // обнуляем текущие костяшки игры
    game.firstCard = null;
    game.secondCard = null;

    // флаг завершённой игры
    game.finished = gameArea.querySelectorAll('.game-card._finded').length === game.gameCards.length;
  }

  // если игра завершена
  if(game.finished) {
    // показываем кнопку перезапуска игры
    // таймаут выставляем, чтобы закончилась анимация разворачивания костяшки
    setTimeout(showSuccessMessage, 1000);
  }

  // сбрасываем данные игрового шага
  resetGameStage();
}

// показывает сообщение об успешном завершении игры
function showSuccessMessage() {
  // сообщение об успешном завершении игры
  const successMessage = `
    <div class='alert alert-secondary'>
      <h4
        class='alert-heading text-center'
      >
        Вы выиграли!
      </h4>
      <hr>
      <p>
        <button
          type='button'
          class='btn btn-secondary btn-lg text-nowrap'
          onclick='initGame();'
        >
          Сыграть ещё раз
        </button>
      </p>
    </div>
  `;

  // заменяем костяшки на сообщение
  gameArea.innerHTML = successMessage;
}

// показывает сообщение о неудачном завершении игры
function showGameOverMessage() {
  // сообщение о неуспешном завершении игры
  const gameOverMessage = `
    <div class='alert alert-danger'>
      <h4
        class='alert-heading text-center'
      >
        Вы проиграли!
      </h4>
      <hr>
      <p>
        <button
          type='button'
          class='btn btn-danger btn-lg text-nowrap'
          onclick='initGame();'
        >
          Попробовать ещё раз
        </button>
      </p>
    </div>
  `;

  // заменяем костяшки на сообщение
  gameArea.innerHTML = gameOverMessage;
}

// сбрасываем данные игрового шага
function resetGameStage() {
  setTimeout(() => {
    // если развёрнута первая костяшка, то разворачиваем назад
    if(game.firstCard) {
      game.firstCard.classList.remove('flip');
    }

    // если развёрнута вторая костяшка, то разворачиваем назад
    if(game.secondCard) {
      game.secondCard.classList.remove('flip');
    }

    // обнуляем данные игрового шага
    game.hasFlippedCard = false;
    game.lockboard = false;
    game.firstCard = null;
    game.secondCard = null;
  }, 1000);
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
  game.gameCards = gameArea.querySelectorAll('.game-card');
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
  // сбрасываем состояние игры к дефолтному состоянию
  game.finished = false;
  game.lockboard = false;
  game.hasFlippedCard = false;
  game.firstCard = null;
  game.secondCard = null;
  game.gameCards = [];
  // обнуляем таймер игры
  clearTimeout(game.timer);
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
let lockboard = false;
let firstCard, secondCard;
let menu = document.querySelector('.section-menu')
let countFlipCard = 4;

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