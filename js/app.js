/*
*The following classes utilize the Animations CSS library
* .animated .flipInX .bounce .shake
*/

let timeID;
let cardTracker = [];
let tries = 0;
let clickCount = 0;
let startingTime = 0;
let endingTime = 0;
//following six variables capture dom elements
const moves = document.querySelectorAll(".moves");
const timer = document.querySelectorAll(".timer");
const restart = document.querySelector(".restart");
const deck = document.querySelector(".deck");
const popUp = document.querySelector(".winner");
const button = document.querySelector("#close-window");

/*
 * Create a list that holds all of your cards
 */
let cards = [
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-leaf",
  "fa-bicycle",
  "fa-bomb"
];

cards.push(...cards);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  buildBoard(array);
}
shuffle(cards);

function buildBoard(cards) {
  //creates the html for each card in array and appends it to the DOM
  const fragment = document.createDocumentFragment();

  for (let card of cards) {
    const listItem = document.createElement("li");
    const newCard = document.createElement("i");
    listItem.classList.add("card");
    newCard.classList.add("animated", "fa", card);
    listItem.appendChild(newCard);
    fragment.appendChild(listItem);
  }

  deck.appendChild(fragment);

  //starts the "clock" on the game
  startingTime = performance.now();
  timeID = setInterval(timeKeeper, 1000);
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function timeKeeper() {
  //increments the timer on the game every second
  endingTime = performance.now();
  const seconds = Math.floor((endingTime - startingTime) / 1000);
  timer[0].innerHTML = seconds;
}

function checkMatch() {
/*  collects every card that has been "opened" and compares their class names to find a match
 *  depending on success or failure, appropriate class is added for desired effect
 */
  let cardsCheck = document.querySelectorAll(".open");

  for (let card of cardsCheck) {
    card.classList.remove("flipInX");
    if (cardTracker[tries-1] == cardTracker[tries-2]) {
      card.classList.add("match", "bounce");
    } else {
      card.classList.add("shake");
    }
    card.classList.remove("open", "show");
  }

  clickCount = 0;
  countMatches();
}

function countMatches() {
/*  collects and counts every card which has been matched.
 *  when all cards are matched, the timer is stopped and the popup screen is visible
 */
  let matches = 0;
  const counter = document.querySelectorAll(".match");
  matches = counter.length;

  if (matches === 16) {
    clearInterval(timeID);
    moves[1].innerHTML = moves[0].innerHTML;
    timer[1].innerHTML = timer[0].innerHTML;
    popUp.classList.remove("no-show");
  }
}

function rating() {
  //changes css style of stars according to number of tries and adds the number of stars remaining to popup window
  const stars = document.querySelectorAll(".fa-star");
  const numberStars = document.querySelector(".number-stars");
  numberStars.innerHTML = 3;

  for (let star of stars) {
    star.style.color = "#02ccba";
  }

  if (tries >= 20 && tries < 40) {
    stars[2].style.color = "white";
    numberStars.innerHTML = 2;
  } else if (tries >= 40 && tries < 60) {
    stars[2].style.color = "white";
    stars[1].style.color = "white";
    numberStars.innerHTML = 1;
  }
}

function reset() {
  //rebuilds the game board and resets all values
  deck.textContent = "";
  moves[0].innerHTML = 0;
  //the following reassignment fixes the restart button :)
  clickCount = 0;
  tries = 0;
  startingTime = 0;
  endingTime = 0;
  rating();
  shuffle(cards);
}

deck.addEventListener("click", function(e) {
  //click event "opens" cards when two are clicked, and prevents duplicate click
  if (e.target.nodeName === "LI" && e.target.classList.contains("open") === false && clickCount <= 1) {
    e.target.classList.add("open", "show", "animated", "flipInX");
    e.target.classList.remove("shake");
    cardTracker[tries] = e.target.firstElementChild.className;
    tries++;
    clickCount++;
    if (clickCount === 2) {
      moves[0].innerHTML = tries/2;
      rating();
      setTimeout(checkMatch, 800);
    }
  }
}, true);

restart.addEventListener("click", function() {
  //pairs reset function to restart button
  reset();
}, true);

button.addEventListener("click", function() {
  //hides popup screen and resets the game board
  popUp.classList.add("no-show");
  reset();
})
