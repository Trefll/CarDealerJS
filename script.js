$carsSection = document.getElementById('cars');
$searchInput = document.getElementById('searchInput');
$form = document.getElementById('form');
$homePageBtn = document.getElementById('homepageBtn')
$accessoriesSection = document.getElementById('accessories')
$accessoriesList = document.getElementById('accessoriesList');
$selectedAccessories = document.getElementById('selectedAccessories');
$paymentRadios = document.getElementsByName('payment');
$nameInput = document.getElementById('name');
$deliveryTimeInput = document.getElementById('deliveryTime')
$carSection = document.getElementById('car')
$summarySection = document.getElementById('summary');
$buyBtn = document.getElementById('buy')
$accessoryText = document.getElementById('accessoryText')
$errorMsg = document.getElementById('errorMsg')
 
const today = new Date()
const twoWeeksAfterToday = new Date()
const tommorowDate = new Date()
tommorowDate.setDate(today.getDate() + 1)
twoWeeksAfterToday.setDate(today.getDate() + 14)
$deliveryTimeInput.min = tommorowDate.toISOString().split('T')[0]
$deliveryTimeInput.max = twoWeeksAfterToday.toISOString().split('T')[0]

let carsData = [];
let accessoriesData = [];

const fetchData = (url, dataArr, renderFunc) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      dataArr.length = 0;
      dataArr.push(...data);
      renderFunc(dataArr);
    })
    .catch((err) => console.log(err));
};

const renderCars = (cars) => {
  $carsSection.innerHTML = '';
  cars.forEach((car) => {
    const carItemHTML = `<div class="car">
          <img class="car_image" src="${car.photo}" alt="${car.brand} ${car.model}" />
          <p>${car.brand} ${car.model}</p>
          <p>${car.price} $</p>
          <button class="carBtn" data-car-id="${car.id}">Details</button>
        </div>`;

    $carsSection.innerHTML += carItemHTML;
  });
};

const renderOneCar = () => {
  const car = JSON.parse(localStorage.getItem('car'))
  $carSection.innerHTML = '';
  $carSection.innerHTML = `<div class="car">
          <img class="car_image" src="${car.photo}" alt="${car.brand} ${car.model}" />
          <p>${car.brand} ${car.model}</p>
          <p>${car.productionYear}</p>
          <p>${car.enginePower}</p>
          <p>${car.mileage}</p>
          <p>${car.price} $</p>`;
}

const renderSummary = () => {
  $summarySection.classList.toggle('hidden')
  $carSection.classList.toggle('hidden')
  $form.classList.toggle('hidden')
  $accessoriesSection.classList.toggle('hidden')
  $accessoriesList.classList.toggle('hidden')
  $selectedAccessories.classList.toggle('hidden')
  $buyBtn.classList.toggle('hidden')
  $accessoryText.classList.toggle('hidden')
  const car = JSON.parse(localStorage.getItem('car'))
  const paymentMethod = localStorage.getItem('paymentMethod')
  const deliveryTime = localStorage.getItem('date')
  const accessoriesPrice = calculateTotalPrice();
  const totalPrice = accessoriesPrice + car.price
  $summarySection.innerHTML = `<img class="car_image" src="${car.photo}" alt="${car.brand} ${car.model}" />
  <h2>Congratulations! You successfully bought ${car.brand} ${car.model}</h2>
  <p>Chosen payment method was ${paymentMethod}</p>
  <p>Delivery time is ${deliveryTime}</p>
  <h3>Total price: ${totalPrice}$`;
}

const renderAccessories = (accessories) => {
  $accessoriesList.innerHTML = '';
  accessories.forEach((accessory) => {
    const accessoryItemHTML = `<li>
          <p data-price="${accessory.price}">${accessory.name} ${accessory.price}$</p>
        </li>`;

    $accessoriesList.innerHTML += accessoryItemHTML;
  });
};

const filterCarsByQuery = (query) => {
  const filteredCars = carsData.filter((car) => {
    const brand = car.brand.toLowerCase();
    return brand.includes(query.toLowerCase())
  });
  renderCars(filteredCars)
};

const filterCarsById = () => {
  const carId = localStorage.getItem('carId');
  const filteredCars = carsData.filter((car) => car.id === parseInt(carId));
  localStorage.setItem('car', JSON.stringify(filteredCars[0]))
};

const calculateTotalPrice = () => {
  let totalPrice = 0;
  $selectedAccessories.querySelectorAll('p').forEach((p) => {
    const price = parseFloat(p.dataset.price);
    totalPrice += price;
  });
  return Math.round(totalPrice * 100) / 100;
};

const savedDataInLocalStorage = () => {
  $paymentRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const selectedValue = radio.value;
      localStorage.setItem('paymentMethod', selectedValue);
      console.log(`Selected value saved to localStorage: ${selectedValue}`);
    });
  });
  $nameInput.addEventListener('input', () => {
    const nameValue = $nameInput.value;
    localStorage.setItem('name', nameValue);
    console.log(`Name value saved to localStorage: ${nameValue}`);
  });
  $deliveryTimeInput.addEventListener('input', () => {
    const dateValue = $deliveryTimeInput.value;
    localStorage.setItem('date', dateValue);
    console.log(`Date value saved to localStorage: ${dateValue}`);
  });
}

fetchData('cars.json', carsData, renderCars);
fetchData('accessories.json', accessoriesData, renderAccessories);

if (localStorage.getItem('carId')) {
  $carsSection.classList.toggle('hidden');
  $form.classList.toggle('hidden');
  $accessoriesList.classList.toggle('hidden');
  $selectedAccessories.classList.toggle('hidden');
  $searchInput.classList.toggle('hidden');
  $carSection.classList.toggle('hidden')
  $buyBtn.classList.toggle('hidden');
  $accessoryText.classList.toggle('hidden');
  $homePageBtn.classList.toggle('hidden');
  savedDataInLocalStorage()
  renderOneCar()
  if(localStorage.getItem('paymentMethod') !== null | localStorage.getItem('name') || localStorage.getItem('date')) {
    for (let i=0; i < $paymentRadios.length; i++) {
      if($paymentRadios[i].value === localStorage.getItem('paymentMethod')) {
        $paymentRadios[i].checked = true;
        break;
      }
    }
    $nameInput.value = localStorage.getItem('name');
    $deliveryTimeInput.value = localStorage.getItem('date');
  }
}

$searchInput.addEventListener('input', (e) => {
  const searchQuery = e.target.value
  filterCarsByQuery(searchQuery)
})

$carsSection.addEventListener('click', (e) => {
  if(e.target.nodeName === 'BUTTON') {
    const carId = e.target.getAttribute('data-car-id')
    localStorage.setItem('carId', carId)
    $carsSection.classList.toggle('hidden')
    $form.classList.toggle('hidden')
    $accessoriesList.classList.toggle('hidden');
    $searchInput.classList.toggle('hidden');
    $carSection.classList.toggle('hidden')
    $selectedAccessories.classList.toggle('hidden')
    $buyBtn.classList.toggle('hidden')
    $homePageBtn.classList.toggle('hidden')
    $accessoryText.classList.toggle('hidden');
    filterCarsById()
    renderOneCar()
    savedDataInLocalStorage()
    console.log(carId)
  }
})

$homePageBtn.addEventListener('click', () => {
  localStorage.removeItem('carId')
  $carsSection.classList.toggle('hidden');
  $form.classList.toggle('hidden');
  $accessoriesList.classList.toggle('hidden');
  $carSection.classList.toggle('hidden')
  $selectedAccessories.classList.toggle('hidden');
  $searchInput.classList.toggle('hidden')
  $buyBtn.classList.toggle('hidden');
  $homePageBtn.classList.toggle('hidden');
  $accessoryText.classList.toggle('hidden');
})

$accessoriesList.addEventListener('click', (e) => {
  if(e.target.tagName === 'P') {
    $selectedAccessories.appendChild(e.target.cloneNode(true));
    e.target.remove()
    const totalPrice = calculateTotalPrice();
    console.log(`Total price: ${totalPrice}`);
  }
})

$selectedAccessories.addEventListener('click', (e) => {
  if (e.target.tagName === 'P') {
    $accessoriesList.appendChild(e.target.cloneNode(true));
    e.target.remove();
    const totalPrice = calculateTotalPrice();
    console.log(`Total price: ${totalPrice}`);
  }
});

$buyBtn.addEventListener('click', () => {
  const inputNamePattern = /^\b[A-Z]\w*\s[A-Z]\w*\b$/;
  if(!inputNamePattern.test($nameInput.value) || $deliveryTimeInput.value === null) {
    $errorMsg.classList.remove('hidden');
  }
  else {
    renderSummary();
    localStorage.removeItem('carId');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('date');
    localStorage.removeItem('name');
    errorMessage.classList.add('hidden');
  }
})