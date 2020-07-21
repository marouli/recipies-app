const single_mealEl = document.getElementById('single-meal');
const area_mealsEl = document.getElementById('area-meals');
const area_headingEl = document.getElementById('area-heading');

const addMealToDOM = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal" id="single-meal" areaId=${meal.strArea}>
      <div class="recipe-summary">
        <h1>${meal.strMeal}</h1>
        <div class="single-meal-info">
        ${
          meal.strArea && meal.strCategory
            ? `<p>${meal.strArea} - ${meal.strCategory}</p>`
            : ''
        }
        ${
          meal.strSource
            ? `<a href=${meal.strSource} arial-label="Read Directions" target="_blank">Read Directions</a>`
            : ''
        }
        ${
          meal.strYoutube
            ? `<a href=${meal.strYoutube} arial-label="Read Directions" target="_blank">Youtube Video</a>`
            : ''
        }
        </div>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
};

const getMealById = (id) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      const mealId = meal.idMeal;
      const areaId = meal.strArea;

      addMealToDOM(meal);
      displayByArea(areaId, mealId);
    });
};

const displayByArea = (areaId, mealId) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.meals === null) {
        area_headingEl.innerHTML = '';
        area_mealsEl.innerHTML = '';
      } else {
        console.log(data.meals[0].strMeal);
        area_mealsEl.innerHTML = data.meals
          .filter((meal) => meal.idMeal !== mealId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
          .map(
            (meal) => `
              <div class="meal">
                  <a href="detail.html?meal=${meal.idMeal}" aria-label="detail">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                  <div class="meal-info" data-mealid="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                  </div>
                  </a>
                </div>
              `
          )
          .join('');
      }

      if (areaId === 'Unknown') {
        area_headingEl.innerText = '';
        area_mealsEl.innerHTML = '';
      } else {
        area_headingEl.innerText = `Here are some more '${areaId}' recipies:`;
      }
    });
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
mealId = urlParams.get('meal');
getMealById(mealId);
