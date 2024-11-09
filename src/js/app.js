import * as swiperSettings from './modules/slider.js';
import * as flsFunction from './modules/function.js';

flsFunction.isWebp();

const API_KEY = 'Yor Api Key';
const BASE_URL = 'https://api.spoonacular.com/recipes/';

let requestFilterArr = [
  { type: 'type', id: [] },
  { type: 'intolerances', id: [] },
  { type: 'diet', id: [] },
];
let requestFilterNutrition = {
  maxCalories: '',
  maxFat: '',
  maxProtein: '',
  maxCholesterol: '',
  maxCarbs: '',
  maxAlcohol: '',
  maxSugar: '',
  maxCaffeine: '',
};
let requestIngredients = '';

let pageNow = new URL(document.location).searchParams.get('page');

if (!localStorage.favorit) {
  const idFavorte = [];
  localStorage.favorit = JSON.stringify(idFavorte);
}

const headerMenu = document.querySelector('.header-menu');
const filterBtn = document.querySelectorAll('.filterIcon');
const linksNavHeader = document.querySelectorAll('.header-menu__link');
const linksNavFooter = document.querySelectorAll('.footer-menu__link');
const randomSlider = document.querySelector('.swiper-wrapper');
const smallFilterBar = document.querySelector('.filter-bar');
const smallFilterLinks = document.querySelectorAll('.filter-bar__link');
const filterRecipesContent = document.querySelector('.filter-recipes__content');
const filterBigBar = document.querySelector('.filter-big-bar__form');
const filterBigContent = document.querySelector('.filter-big__content');
const searchForm = document.querySelector('.search-form');
const searchFormBtn = document.querySelector('.search-form__btn');
const searchFormInput = document.querySelector('.search-form__input');
const modalWindow = document.querySelector('.modal-form');
const favoritRecipes = document.querySelector('.favorit-recipes__container');
const aboutBtn = document.querySelector('.about-us__btn');
const burgerMenuProfile = document.querySelector('.burger-menu__btn');
const linksBurger = document.querySelectorAll('.burger-menu__link');

function checkUndefined(elem) {
  return Boolean(elem) ? elem : '';
}

const burgerBtn = document.querySelector('.burger-btn');
burgerBtn.addEventListener('click', () => {
  document
    .querySelector('.burger-menu__content')
    .classList.toggle('burger-open');
  burgerBtn.classList.toggle('btn-open');
});

function getCardsRecipes(argu) {
  const { pathElement, amountCards, parameters = '' } = argu;
  fetch(
    `${BASE_URL}complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&sort=random${parameters}`
  )
    .then((response) => response.json())
    .then((data) => {
      renderCards(data.results, pathElement, amountCards);
    })
    .catch((error) => console.log(error));
}

function renderCards(data, element, amountCards = 6) {
  if (amountCards != 1) element.innerHTML = '';
  for (let i = 0; i < amountCards; ++i) {
    const {
      title,
      image,
      id,
      summary = '',
      readyInMinutes,
      servings,
      cheap,
    } = data[i];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');

    element.insertAdjacentElement('afterbegin', swiperSlide);

    const cardFood = document.createElement('div');
    cardFood.classList.add('card-food');
    cardFood.setAttribute('id', id);

    swiperSlide.append(cardFood);

    const btnFavorit = document.createElement('button');
    btnFavorit.classList.add('card-food__favorit-btn');

    cardFood.insertAdjacentElement('afterbegin', btnFavorit);

    if (JSON.parse(localStorage.favorit).find((el) => el == id)) {
      btnFavorit.classList.add('card-food__favorit-btn--active');
    }

    cardFood.innerHTML += `<img class="card-food__img" src=${image} alt="${title}" />
        <div class="card-food__content">
          <div class="card-food__title">${checkUndefined(title)}</div>
            <div class="card-food__text">
              ${summary.replace(/(\..*)/gi, '')}.
            </div>
          <div class="card-food__bottom">
            <div class="card-food__info">${checkUndefined(
              readyInMinutes
            )} Min - ${cheap ? 'cheap' : 'expensive'} - ${checkUndefined(
      servings
    )} serves</div>
            <a class="card-food__btn" href="recipes.html?page=recipe&id=${id}">view recipe</a>
          </div>
        </div>`;

    cardFood.addEventListener('click', (e) => {
      const arrBrn = document.querySelectorAll('.card-food__favorit-btn');
      if ([...arrBrn].find((btn) => btn == e.target)) {
        e.target.classList.add('card-food__favorit-btn--active');

        let arrIdFavorite = JSON.parse(localStorage.favorit);

        const recipeId = e.target.parentElement.getAttribute('id');

        if (arrIdFavorite.find((el) => el === recipeId)) {
          e.target.classList.remove('card-food__favorit-btn--active');
          arrIdFavorite = arrIdFavorite.filter((el) => el !== recipeId);
          localStorage.removeItem('favorit');
          localStorage.favorit = JSON.stringify(arrIdFavorite);
        } else {
          arrIdFavorite.push(recipeId);
          localStorage.removeItem('favorit');
          localStorage.favorit = JSON.stringify(arrIdFavorite);
        }
      }
    });
  }
}

switch (pageNow) {
  default:
    linksNavFooter.forEach((el) => {
      el.classList.remove('footer-menu__link--active');
    });
    linksNavHeader.forEach((el) => {
      el.classList.remove('header-menu__link--active');
    });
    linksBurger.forEach((el) => {
      el.classList.remove('burger-menu__link--active');
    });
  case 'home':
    linksNavFooter[0].classList.add('footer-menu__link--active');
    linksNavHeader[0].classList.add('header-menu__link--active');
    linksBurger[0].classList.add('burger-menu__link--active');

    getCardsRecipes({
      pathElement: filterRecipesContent,
      amountCards: 9,
    });

    getCardsRecipes({
      pathElement: randomSlider,
      amountCards: 6,
    });

    (function () {
      aboutBtn.addEventListener('click', () => {
        window.scrollTo({
          top: document.body.clientHeight,
          left: 0,
          behavior: 'smooth',
        });
      });

      smallFilterBar.addEventListener('click', (e) => {
        e.preventDefault();

        if (e.target.classList.contains('filter-bar__link')) {
          smallFilterLinks.forEach((link) =>
            link.classList.remove('filter-bar__link--active')
          );

          e.target.classList.add('filter-bar__link--active');

          const typeRequest = e.target.dataset.type;
          const typeRecipe = e.target.dataset.value;

          getCardsRecipes({
            pathElement: filterRecipesContent,
            amountCards: 9,
            parameters: `&${typeRequest}=${typeRecipe}`,
          });
        }
      });
    })();
    break;
  case 'recipe':
    linksNavFooter[1].classList.add('footer-menu__link--active');
    linksNavHeader[1].classList.add('header-menu__link--active');
    linksBurger[1].classList.add('burger-menu__link--active');

    getCardsRecipes({
      pathElement: randomSlider,
      amountCards: 6,
    });

    (function () {
      let id = new URL(document.location).searchParams.get('id');

      if (id) {
        getRecipeInformation(id);
      } else {
        fetch(
          `${BASE_URL}complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&sort=random`
        )
          .then((response) => response.json())
          .then((data) => {
            const { id } = data.results[0];
            getRecipeInformation(id);
          })
          .catch((error) => console.log(error));
      }
    })();
    break;
  case 'fillter':
    linksNavFooter[2].classList.add('footer-menu__link--active');
    linksNavHeader[2].classList.add('header-menu__link--active');
    linksBurger[2].classList.add('burger-menu__link--active');

    (function () {
      getCardsRecipes({
        pathElement: filterBigContent,
        amountCards: 9,
      });

      getCardsRecipes({
        pathElement: randomSlider,
        amountCards: 6,
      });

      document.querySelectorAll('.filter-nutrition__item').forEach((input) => {
        input.addEventListener('input', (e) => {
          if (isNaN(+e.target.value)) {
            e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.35)';
          } else {
            e.target.style.backgroundColor = '';
          }
        });
      });

      filterBigBar.addEventListener('change', (e) => {
        if (!isNaN(+e.target.value)) {
          const typeFilerrequest = e.target.getAttribute('typeRequest');
          const valueRequest = e.target.value;

          requestFilterNutrition[typeFilerrequest] = valueRequest;
        } else {
          const typeFilerrequest =
            e.target.parentElement.parentElement.parentElement.getAttribute(
              'type'
            );
          const idType = e.target.getAttribute('id');

          requestFilterArr.map((elem) => {
            if (elem.type == typeFilerrequest) {
              if (elem.id.find((el) => el == idType)) {
                elem.id = elem.id.filter((id) => id !== idType);
              } else {
                elem.id.push(idType);
              }
            }
          });
        }

        getCardsRecipes({
          pathElement: filterBigContent,
          amountCards: 9,
          parameters: setRequestFilter(),
        });
      });

      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getValueFormInput(searchFormInput.value);
      });

      searchFormBtn.addEventListener('submit', (e) => e.preventDefault());
    })();
    break;
  case 'profile':
    if (JSON.parse(localStorage.favorit).length > 0) {
      JSON.parse(localStorage.favorit).forEach((id) => {
        fetch(`${BASE_URL}${id}/information?apiKey=${API_KEY}`)
          .then((response) => response.json())
          .then((data) => {
            renderCards([data], favoritRecipes, 1);
          })
          .catch((error) => console.log(error));
      });
    }
    break;
}

filterBtn.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const list = btn.parentElement.nextElementSibling;

    btn.classList.toggle('open');

    list.style.display = btn.classList.contains('open') ? 'flex' : 'none';
  });
});

function getRecipeInformation(recipeId) {
  fetch(
    `${BASE_URL}${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`
  )
    .then((response) => response.json())
    .then((data) => {
      renderRecipeInformation(data);
    })
    .catch((error) => console.log(error));
}

function renderRecipeInformation(data) {
  const {
    title,
    image,
    servings,
    cookingMinutes,
    preparationMinutes,
    analyzedInstructions,
    extendedIngredients,
    summary,
    dishTypes,
    nutrition: { nutrients },
  } = data;

  document.querySelector('.recipes__title').innerHTML = title;

  document.querySelector('.min-info__list').innerHTML = `
    <li class="min-info__item">prep time <span>${
      preparationMinutes == null ? '__' : preparationMinutes
    }m</span></li>
    <li class="min-info__item">cook time <span>${
      cookingMinutes == null ? '__' : cookingMinutes
    }m</span></li>
    <li class="min-info__item"><span>${
      servings == null ? '__' : servings
    }</span> serves</li>
   `;

  document.querySelector('.recipes__img').src = image;

  document.querySelector('.sammary__text').innerHTML = summary;

  document.querySelector('.ingredients__list').innerHTML = '';

  extendedIngredients.forEach((ingredient) => {
    document.querySelector(
      '.ingredients__list'
    ).innerHTML += `<li class="ingredients__item">${ingredient.original}</li>`;
  });

  document.querySelector('.instructions__list').innerHTML = '';

  analyzedInstructions[0].steps.forEach((step) => {
    document.querySelector(
      '.instructions__list'
    ).innerHTML += `<li class="instructions__step">${step.step}</li>`;
  });

  document.querySelector('.nutritiona-value__list').innerHTML = '';

  for (let i = 0; i <= 6; ++i) {
    const { name, amount, unit } = nutrients[i];

    document.querySelector(
      '.nutritiona-value__list'
    ).innerHTML += `<li class="nutritiona-value__item">${name}:<span class="nutritiona-value__item-value"> ${amount}${unit}</span></li>`;
  }
}

function setRequestFilter() {
  let requestFilter = ``;

  requestFilterArr.forEach((resp) => {
    if (resp.id.length !== 0) {
      requestFilter += `&${resp.type}=${resp.id.join(',')}`;
    }
  });

  Object.entries(requestFilterNutrition).forEach((elem) => {
    if (elem[1] !== '') {
      requestFilter += `&${elem[0]}=${elem[1]}`;
    }
  });

  if (requestIngredients) {
    requestFilter += `&includeIngredients=${requestIngredients}`;
  }

  return requestFilter;
}

function getValueFormInput(ingredients) {
  if (typeof ingredients === 'string') {
    requestIngredients = ingredients.trim().split(' ').join(',');
    setRequestFilter(requestIngredients);
  }

  getCardsRecipes({
    pathElement: filterBigContent,
    amountCards: 9,
    parameters: setRequestFilter(),
  });
}

const userBtn = document.createElement('a');
userBtn.classList.add('header-menu__user');
userBtn.innerHTML = ` <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background: new 0 0 32 32">
    <g>
      <g>
        <path
          d="M16,14c-3.8598633,0-7-3.1401367-7-7s3.1401367-7,7-7s7,3.1401367,7,7S19.8598633,14,16,14z M16,2
     c-2.7568359,0-5,2.2431641-5,5s2.2431641,5,5,5s5-2.2431641,5-5S18.7568359,2,16,2z"
        />
      </g>
      <g>
        <path
          d="M23.9423828,32H8.0576172C5.8203125,32,4,30.1796875,4,27.9423828c0-6.6166992,5.3833008-12,12-12s12,5.3833008,12,12
     C28,30.1796875,26.1796875,32,23.9423828,32z M16,17.9423828c-5.5141602,0-10,4.4858398-10,10
     C6,29.0771484,6.9228516,30,8.0576172,30h15.8847656C25.0771484,30,26,29.0771484,26,27.9423828
     C26,22.4282227,21.5141602,17.9423828,16,17.9423828z"
        />
      </g>
    </g>
  </svg>`;
userBtn.href = `profile.html?page=profile`;

const btnLogin = document.createElement('button');
btnLogin.classList.add('header-menu__btn-log');
btnLogin.textContent = 'Singin';

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.user) {
    headerMenu.append(userBtn);
    burgerMenuProfile.href = `profile.html?page=profile`;
  } else {
    headerMenu.append(btnLogin);

    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const modalContainer = document.getElementById('modal-container');

    signUpButton.addEventListener('click', () => {
      modalContainer.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      modalContainer.classList.remove('right-panel-active');
    });

    btnLogin.addEventListener('click', openModalWindow);

    burgerMenuProfile.addEventListener('click', () => {
      openModalWindow();
      document
        .querySelector('.burger-menu__content')
        .classList.remove('burger-open');
      burgerBtn.classList.remove('btn-open');
    });

    const formSingUp = document.querySelector('.sign-up__form');
    const formSingIn = document.querySelector('.sign-in__form');

    signUpName.addEventListener('input', () => {
      signUpName.classList.remove('incorrect-input');
    });

    signUpEmail.addEventListener('input', () => {
      signUpEmail.classList.remove('incorrect-input');
    });

    signUpPassword.addEventListener('input', () =>
      signUpPassword.classList.remove('incorrect-input')
    );

    formSingUp.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkEmaill = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const wrong = document.querySelector('.sign-up__form .wrong');

      const userName = signUpName.value;
      const emaill = signUpEmail.value;
      const password = signUpPassword.value;

      if (userName.length <= 3 || userName.length >= 12) {
        signUpName.classList.add('incorrect-input');
        wrong.innerHTML = 'The name must be between 4 and 12 characters long';
      } else {
        signUpName.classList.remove('incorrect-input');
        wrong.innerHTML = '';

        if (!checkEmaill.test(emaill) || password === '') {
          signUpEmail.classList.add('incorrect-input');
          signUpPassword.classList.add('incorrect-input');

          if (checkEmaill.test(emaill)) {
            signUpEmail.classList.remove('incorrect-input');
          }
          if (password >= 4) {
            signUpPassword.classList.remove('incorrect-input');
          }
          wrong.innerHTML = 'Incorrect email or password';
        } else {
          if (localStorage?.user?.emaill == emaill) {
            signUpEmail.classList.add('incorrect-input');
            wrong.innerHTML = 'This email is already in use';
          } else {
            signUpEmail.classList.remove('incorrect-input');
            wrong.innerHTML = '';
            localStorage.user = JSON.stringify({
              name: userName,
              emaill: emaill,
              password: password,
            });
            e.stopImmediatePropagation();
          }
        }
      }
    });

    signInEmaill.addEventListener('input', () => {
      signInEmaill.classList.remove('incorrect-input');
    });

    signInPassword.addEventListener('input', () =>
      signInPassword.classList.remove('incorrect-input')
    );

    formSingIn.addEventListener('submit', (e) => {
      e.preventDefault();

      const checkEmaill = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

      const wrong = document.querySelector('.sign-in__form .wrong');
      let emaill = signInEmaill.value;
      let password = signInPassword.value;

      wrong.innerHTML = '';

      if (!checkEmaill.test(emaill) || password === '') {
        signInEmaill.classList.add('incorrect-input');
        signInPassword.classList.add('incorrect-input');

        if (checkEmaill.test(emaill)) {
          signInEmaill.classList.remove('incorrect-input');
        }
        if (password >= 4) {
          signInPassword.classList.remove('incorrect-input');
        }
        wrong.innerHTML = 'Incorrect email or password';
      } else {
        if (localStorage?.user?.emaill == emaill) {
          if (localStorage?.user?.password == password) {
            signInEmaill.classList.remove('incorrect-input');
            signInPassword.classList.remove('incorrect-input');
            e.stopPropagation();
          } else {
            wrong.innerHTML = 'Incorrect password';
          }
        } else {
          signInEmaill.classList.add('incorrect-input');
          signInPassword.classList.add('incorrect-input');
          wrong.innerHTML = 'Incorrect email or password';
        }
      }
    });
  }
});

function openModalWindow() {
  document.body.append(modalWindow);
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class='wrapper-modal'></div>`
  );

  const modalWrapper = document.querySelector('.wrapper-modal');

  modalWrapper.addEventListener('click', () => {
    modalWrapper.remove();
    modalWindow.classList.add('hide');
    document.body.classList.remove('block-scroll');
  });

  document.body.classList.add('block-scroll');
  modalWindow.classList.remove('hide');
}
