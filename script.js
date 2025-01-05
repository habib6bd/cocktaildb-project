document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("card-container");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    let groupCount = 0;
    const maxCartItems = 7;

    searchInput.value = "";
  
    const fetchAllCategories = () => {
      fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list")
        .then((res) => res.json())
        .then((data) => {
          const categories = data.drinks.map((category) => category.strCategory);
          fetchDrinksForCategories(categories);
        })
        .catch((error) => console.error("Error fetching categories:", error));
    };
  

    const fetchDrinksForCategories = (categories) => {
      cardContainer.innerHTML = ""; 
      categories.forEach((category) => {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`)
          .then((res) => res.json())
          .then((data) => {
            data.drinks.forEach((drink) => {
              fetchDrinkDetails(drink.idDrink, category);
            });
          })
          .catch((error) => console.error(`Error fetching drinks for ${category}:`, error));
      });
    };
  
    // Fetch detailed information for each drink
    const fetchDrinkDetails = (id, category) => {
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const drink = data.drinks[0];
          displayDrinkCard(drink, category);
        })
        .catch((error) => console.error(`Error fetching details for drink ${id}:`, error));
    };
  
    // Display drink card
    const displayDrinkCard = (drink, category) => {
  const card = document.createElement("div");
  card.classList.add("col-md-4", "d-flex", "align-items-stretch", "sm-container");

  card.innerHTML = `
    <div class="card shadow">
      <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}">
      <div class="card-body">
        <h5 class="card-title text-center">Name: ${drink.strDrink}</h5>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Instruction:</strong> ${drink.strInstructions.split(" ").slice(0, 15).join(" ")}...</p>
        <div class="d-flex justify-content-between mt-auto">
          <button class="btn btn-success btn-sm add-to-group-button" data-id="${drink.idDrink}">
            Add to Group
          </button>
          <button class="btn btn-primary btn-sm details-button" data-id="${drink.idDrink}">
            Details
          </button>
        </div>
      </div>
    </div>
  `;

  cardContainer.appendChild(card);

  card.querySelector(".add-to-group-button").addEventListener("click", () => addToGroup(drink));
  card.querySelector(".details-button").addEventListener("click", () => showDetailsModal(drink));
};

    const addToGroup = (drink) => {
      if (groupCount >= maxCartItems) {
        alert("You have reached the maximum limit");
        return;
      }
  
      groupCount += 1;
      cartTotal.textContent = groupCount;
  
      const listItem = document.createElement("li");
      listItem.classList.add("d-flex", "align-items-center", "mb-2");
  
      listItem.innerHTML = `
        <span>${groupCount}.</span>
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
        <span>${drink.strDrink}</span>
      `;
  
      cartItems.appendChild(listItem);
    };
  
    // Show details modal
    const showDetailsModal = (drink) => {
      const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
      document.getElementById("detailsModalLabel").textContent = drink.strDrink;
      document.getElementById("modal-img").src = drink.strDrinkThumb;
      document.getElementById("modal-category").textContent = drink.strCategory;
      document.getElementById("modal-alcoholic").textContent = drink.strAlcoholic;
      document.getElementById("modal-description").textContent = drink.strInstructions || "No instructions provided.";
  
      modal.show();
    };
  

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        fetchDrinksBySearch(query);
      }
    });
  

    const fetchDrinksBySearch = (query) => {
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.drinks) {
            cardContainer.innerHTML = ""; 
            data.drinks.forEach((drink) => {
              fetchDrinkDetails(drink.idDrink, drink.strCategory);
            });
          } else {
            cardContainer.innerHTML = `<h4 class="text-center text-danger">Your search drink is not found</h4>`;
          }
        })
        .catch((error) => console.error("Error fetching search results:", error));
    };
  
    fetchAllCategories();
  });
  