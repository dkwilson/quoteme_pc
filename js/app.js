//variables
const form = document.getElementById('request-quote');

const html = new HTMLUI();

//event listeners
eventListeners();

function eventListeners() {
  document.addEventListener('DOMContentLoaded', function () {
    html.displayYears();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const make = document.getElementById('make').value;
    const year = document.getElementById('year').value;

    const level = document.querySelector('input[name="level"]:checked').value;

    if (make === '' || year === '' || level === '') {
      html.displayError('All the fields are mandatory.');
    } else {
        const prevResult = document.querySelector('#result div');
        if( prevResult != null) {
            prevResult.remove();
        }
    
      const insurance = new Insurance(make, year, level);
      const price = insurance.calculateQuotation(insurance);

      html.showResults(parseFloat(price), insurance);
    }
  });
}

//objects

function Insurance(make, year, level) {
  this.make = make;
  this.year = year;
  this.level = level;
}

Insurance.prototype.calculateQuotation = function (insurance) {
  let price;
  const base = 2000;

  //get make
  const make = insurance.make;

  switch (make) {
    case '1':
      price = base * 1.15;
      break;
    case '2':
      price = base * 1.05;
      break;
    case '3':
      price = base * 1.35;
      break;
  }

  const year = insurance.year;

  //get the years difference
  const difference = this.getYearDifference(year);
  // calculate the price. 3% cheaper per year
  price = price - (difference * 3 * price) / 100;

  //check the level
  const level = insurance.level;

  price = this.calculateLevel(price, level);

  return price;
};

//calculates the difference between model year and current year
Insurance.prototype.getYearDifference = function (year) {
  return new Date().getFullYear() - year;
};

//add the value based on the level of protection
Insurance.prototype.calculateLevel = function (price, level) {
  if (level === 'basic') {
    price = price * 1.3;
  } else {
    price = price * 1.5;
  }
  return price;
};

function HTMLUI() {}

//display the latest 20 years
HTMLUI.prototype.displayYears = function () {
  //Max & minimum years
  const max = new Date().getFullYear(),
    min = max - 20;

  const selectYears = document.getElementById('year');

  for (let i = min; i <= max; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    selectYears.appendChild(option);
  }
};

HTMLUI.prototype.displayError = function (message) {
  const div = document.createElement('div');
  div.classList = 'error';

  div.innerHTML = `<p>${message}</p>`;

  form.insertBefore(div, document.querySelector('.form-group'));

  setTimeout(() => {
    document.querySelector('.error').remove();
  }, 3000);
};

HTMLUI.prototype.showResults = function (price, insurance) {
  const result = document.getElementById('result');

  const div = document.createElement('div');

  let make = insurance.make;

  switch (make) {
      case '1':
          make = 'American'
          break;
      case '2':
          make = 'Asian'
          break;
      case '3':
          make = 'European'
          break;
  }

  div.innerHTML = `
        <p class="header">Summary</p>
        <p>Make: ${make}</p>
        <p>Year: ${insurance.year}</p>
        <p>Level: ${(insurance.level).toUpperCase()}</p>
        <p class='total'>Total: $ ${parseFloat(price)} </p>
    `;

    const spinner = document.querySelector('#loading img');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        result.appendChild(div);
    }, 3000);



  
};
