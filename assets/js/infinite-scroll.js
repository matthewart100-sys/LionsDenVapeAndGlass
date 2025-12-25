// Infinite Scrolling Implementation based on Tuts+ tutorial

const cardContainer = document.getElementById("card-container");
const cardCountElem = document.getElementById("card-count");
const cardTotalElem = document.getElementById("card-total");
const loader = document.getElementById("loader");

// Define constants
const cardLimit = 99;
const cardIncrease = 12;
const pageCount = Math.ceil(cardLimit / cardIncrease);

// Display total cards
cardTotalElem.innerHTML = cardLimit;

// Track current page
let currentPage = 1;

// Generate random color for variety
const getRandomColor = () => {
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}deg, 60%, 50%)`;
};

// Create a new card element
const createCard = (index) => {
  const card = document.createElement("div");
  card.className = "infinite-scroll-card";
  card.innerHTML = `
    <div class="card-number">${index}</div>
    <div class="card-content">
      <h3>Product #${index}</h3>
      <p>Premium Quality Item</p>
      <button class="card-action-btn">View Details</button>
    </div>
  `;
  card.style.backgroundColor = getRandomColor();
  cardContainer.appendChild(card);
};

// Add cards to container
const addCards = (pageIndex) => {
  if (pageIndex > pageCount) return;
  
  currentPage = pageIndex;
  
  const startRange = (pageIndex - 1) * cardIncrease;
  const endRange = currentPage === pageCount ? cardLimit : pageIndex * cardIncrease;
  
  // Update card count
  cardCountElem.innerHTML = endRange;
  
  // Create cards for this page
  for (let i = startRange + 1; i <= endRange; i++) {
    createCard(i);
  }
};

// Load initial cards on page load
window.addEventListener("DOMContentLoaded", () => {
  addCards(currentPage);
});

// Throttle function for performance optimization
let throttleTimer;

const throttle = (callback, time) => {
  if (throttleTimer) return;
  
  throttleTimer = true;
  
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

// Remove infinite scroll when limit reached
const removeInfiniteScroll = () => {
  if (loader) loader.remove();
  window.removeEventListener("scroll", handleInfiniteScroll);
};

// Handle infinite scroll
const handleInfiniteScroll = () => {
  throttle(() => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 500;
    
    if (endOfPage && currentPage < pageCount) {
      addCards(currentPage + 1);
    }
    
    if (currentPage === pageCount) {
      removeInfiniteScroll();
    }
  }, 1000);
};

// Add scroll event listener
window.addEventListener("scroll", handleInfiniteScroll);
