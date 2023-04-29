const mainPage = document.querySelector("#mainPage");
const formPage = document.querySelector("#formPage");
const thanksPage = document.querySelector("#thanksPage");
const carName = document.querySelector(".carName");
const totalPrice = document.querySelector(".totalPrice");
const totalPriceElement = document.querySelector(".totalPrice");
const form = document.querySelector("form");
const inputs = form.querySelectorAll("input, select");
const accessoryCheckboxes = document.querySelectorAll(
  'input[name="accessory"]'
);

//check & display the correct page; form data doen't delete on refresh
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("activePage") === "formPage") {
    mainPage.style.display = "none";
    thanksPage.style.display = "none";
    formPage.style.display = "block";

    carName.innerHTML = `${localStorage.getItem(
      "selectedCarBrand"
    )} ${localStorage.getItem("selectedCarModel")}`;
    totalPrice.innerHTML = `${localStorage.getItem("selectedCarPrice")} zł`;
  } else {
    localStorage.clear();
    mainPage.style.display = "block";
    formPage.style.display = "none";
    thanksPage.style.display = "none";
    localStorage.setItem("activePage", "mainPage");
  }
});

//save the input data
inputs.forEach((input) => {
  input.addEventListener("change", () => {
    const key = input.id || input.name;
    const value = input.value;
    localStorage.setItem(key, value);
  });
});
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selectedCarPrice = localStorage.getItem("selectedCarPrice");
    let totalPrice = parseFloat(selectedCarPrice);
    const accessoryPrice = parseFloat(
      checkbox.parentElement
        .querySelector(".price")
        .getAttribute("data-accprice")
    );
    if (checkbox.checked) {
      totalPrice += accessoryPrice;
    } else {
      totalPrice -= accessoryPrice;
    }
    localStorage.setItem("selectedCarPrice", totalPrice.toString());
    totalPriceElement.innerHTML = `${localStorage.getItem(
      "selectedCarPrice"
    )} zł`;
  });
});

//main page - search
const searchInput = document.querySelector(".searchInput");
const cars = document.querySelectorAll(".car");
searchInput.addEventListener("keyup", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  cars.forEach((car) => {
    const brand = car.dataset.brand.toLowerCase();

    if (brand.includes(searchTerm)) {
      car.style.display = "flex";
    } else {
      car.style.display = "none";
    }
  });
});

//main page - buy buttons; select the car, save its data
const buyNow = document.querySelectorAll(".car");
buyNow.forEach((car) => {
  const btn = car.children[1].children[6];
  btn.addEventListener("click", () => {
    localStorage.clear();
   
    inputs.forEach((input) => {
      input.value = null;
      input.checked = false;
    });
    accessoryCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.checked = false;
      }
    });

    //receive & save car data
    const brand = car.dataset.brand;
    const model = car.dataset.model;
    const year = car.dataset.year;
    const engine = car.dataset.engine;
    const milage = car.dataset.milage;
    const price = car.dataset.price;
    const img = car.dataset.img;

    localStorage.setItem("selectedCarBrand", brand);
    localStorage.setItem("selectedCarModel", model);
    localStorage.setItem("selectedCarYear", year);
    localStorage.setItem("selectedCarEngine", engine);
    localStorage.setItem("selectedCarMilage", milage);
    localStorage.setItem("selectedCarPrice", price);
    localStorage.setItem("selectedCarImg", img);

    mainPage.style.display = "none";
    thanksPage.style.display = "none";
    formPage.style.display = "block";

    localStorage.setItem("activePage", "formPage");

    //form page - display selected car data 
    carName.innerHTML = `${localStorage.getItem(
      "selectedCarBrand"
    )} ${localStorage.getItem("selectedCarModel")}`;
    totalPrice.innerHTML = `${localStorage.getItem("selectedCarPrice")} zł`;
  });
});

//form page - data 
const dateSelect = document.querySelector("#date");
const currentDate = new Date();
const deliveryDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
const deliveryDates = [];
for (let i = 0; i < 7; i++) {
  const date = new Date(deliveryDate.getTime() + i * 24 * 60 * 60 * 1000);
  deliveryDates.push(date);
}
deliveryDates.forEach((date) => {
  const option = document.createElement("option");
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  option.value = formattedDate;
  option.innerHTML = formattedDate;
  dateSelect.appendChild(option);
});

//place order button; verify inputs
const submitBtn = document.querySelector(".submitBtn");
submitBtn.addEventListener("click", () => {
  event.preventDefault();
  const fullName = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked'
  );
  const deliveryDate = document.getElementById("date").value.trim();

  if (
    fullName === "" ||
    address === "" ||
    !selectedPayment ||
    deliveryDate === "Select Date" ||
    deliveryDate === null
  ) {
    alert("Please fill up the form");
    return;
  }
  const nameParts = fullName.split(" ");
  localStorage.setItem("firstName", nameParts[0]);
  localStorage.setItem("lastName", nameParts.slice(1).join(" "));
  localStorage.setItem("address", address);
  localStorage.setItem("payment", selectedPayment.id);
  localStorage.setItem("deliveryDate", deliveryDate);

  mainPage.style.display = "none";
  formPage.style.display = "none";
  thanksPage.style.display = "flex";
  localStorage.setItem("activePage", "thanksPage");

  const carName = document.querySelector("#thanksPage .carName");
  const date = document.querySelector("#thanksPage .date");
  const price = document.querySelector("#thanksPage .price");
  const imgTag = document.querySelector(".imgTag");

  carName.innerHTML = `${localStorage.getItem(
    "selectedCarBrand"
  )} ${localStorage.getItem("selectedCarModel")}`;
  date.innerHTML = `${localStorage.getItem("deliveryDate")}`;
  price.innerHTML = `${localStorage.getItem("selectedCarPrice")} zł`;
  imgTag.src = `images/${localStorage.getItem("selectedCarImg")}`;
});

//go back buttons
const backBtn = document.querySelectorAll(".backBtn");
backBtn.forEach((backBtn) => {
  backBtn.addEventListener("click", () => {
    localStorage.clear();
    mainPage.style.display = "block";
    ``;
    formPage.style.display = "none";
    thanksPage.style.display = "none";
    localStorage.setItem("activePage", "mainPage");
  });
});
