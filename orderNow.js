const urlParams = new URLSearchParams(window.location.search);
var productId = urlParams.get("id");
var prod;

var productJson = [];
async function getData() {
  const res = await fetch("data/product.json");
  return await res.json();
}

async function main() {
  productJson = await getData();
  prod = productJson.find((x) => x.id == productId);
  document.getElementById("product-image").src = prod.img;
  document.getElementById(
    "products-details"
  ).innerHTML = `<b class="name-deepPink">${prod.name}</b><br>${prod.description}<br>${numberWithCommas(prod.price)}`;
}

main();

// Load product data on page load
document.addEventListener("DOMContentLoaded", () => {
  getData();
  loadUserDetails();

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", doBooking);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  dateInput.setAttribute("min", today); // Set the "min" attribute to today's date
});

function numberWithCommas(x) {
  return x.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
}
// Order information on Whats App...

var lat, lang;
function getPosition(position) {
  lat = position.coords.latitude;
  lang = position.coords.longitude;
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getPosition);
} else {
  alert("Geolocation is not supported by this browser.");
}

// Function to handle form submission
function doBooking(e) {
  e.preventDefault();

  const data = new FormData(e.target);
  const userDetails = {
    firstName: data.get("first_name"),
    lastName: data.get("last_name"),
    phone: data.get("phone"),
    email: data.get("email"),
    address: data.get("address"),
    pinCode: data.get("pin")
  };

  
  const date = data.get("date");
  const time = data.get("time");
  const instruction = data.get("comment");

  // Save user details to localStorage
  localStorage.setItem("userDetails", JSON.stringify(userDetails));

  const msg = `Order Summary %0a
*Name*: ${userDetails.firstName} ${userDetails.lastName}%0a
*Contact Number*: ${userDetails.phone}%0a
*Email Address*: ${userDetails.email}%0a
*Delivery Address*: ${userDetails.address}%0a
*Delivery Date And Time*: ${date}, ${time}%0a
*Product Name*: ${prod.name}%0a
*Product Description*: ${prod.description}%0a
*Price*: ${numberWithCommas(prod.price)}%0a
*Instruction*: ${instruction}%0a
Location: https://www.google.com/maps/search/?api=1%26query=${lat},${lang}`;

window.open(`https://wa.me/919798107150?text=${msg}`);
// console.log(msg);
}

// Function to load saved data from localStorage
function loadUserDetails() {
  const savedData = localStorage.getItem("userDetails");
  if (savedData) {
    const data = JSON.parse(savedData);

    const fieldMapping = {
      first_name: "firstName",
      last_name: "lastName",
      phone: "phone",
      email: "email",
      address: "address",
      pin: "pinCode",
    };

    Object.keys(fieldMapping).forEach((field) => {
      const input = document.querySelector(`[name='${field}']`);
      if (input) input.value = data[fieldMapping[field]] || "";
    });
  }
}
