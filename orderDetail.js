const LINE_CAPICITY = 35;
var cart = JSON.parse(localStorage.getItem("user-cart") || "[]");
// console.log(cart);
var cartHTML = "";
cart.forEach((item) => {
  cartHTML += `<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12" id="${
    "prod-" + item.id
  }">
              <div class="product col-sm-12">
                <div class="product-details-section row">
                  <div class="col-lg-3 col-md-3 thumbnail">
                    <img src="${item.img}" alt="${item.name}" />
                  </div>
                  <p class="col-sm-8 description itemName">
                    ${item.name}
                  </p>
                  <p class="col-sm-8 description">
                    ${item.description}
                  </p>
                </div>
                <div class="product-pricing-section row">
                  <div class="col-lg-12">
                    <div class="price">
                      <span class="left-panel">
                            <span><b>MRP </b>${numberWithCommas(
                              item.price
                            )}</span><span class="multiply"> x </span>
                            <input
                              type="number"
                              name="quantity"
                              class="form-control border-dark-subtle input-number num"
                              value="${item.qty}" min="0" max="999"
                              onchange="validateQty(this, ${item.id})"
                            />
                          </span>
                          <span>
                            <span class="total-price" id="prod-${
                              item.id
                            }tot_price">${numberWithCommas(item.total)}</span>
                            <a class="btn-sm btn-delete" onclick="removeFromCart(${
                              item.id
                            })">
                              <span class="glyphicon glyphicon-trash"></span>
                            </a>
                          </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
});
document.getElementById("cartItems").innerHTML = cartHTML;

function numberWithCommas(x) {
  return x.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
}

function validateQty(e, productId) {
  if (e.value <= 0) {
    let res = confirm("Do you want to delete Item from cart");
    if (res) {
      removeFromCart(productId);
    } else {
      e.value = 1;
    }
  }
  let prod = cart.find((x) => x.id == productId);
  prod.qty = parseInt(e.value);
  prod.total = e.value * prod.price;
  document.getElementById("prod-" + productId + "tot_price").textContent =
    numberWithCommas(prod.total);
  populateTotalAmount();
  localStorage.setItem("user-cart", JSON.stringify(cart));
  // location.reload();
}

function removeFromCart(productId) {
  // todo: proceed with delete
  console.log("proceed with delete:" + productId);
  let idx = cart.findIndex((x) => x.id === productId);
  document.getElementById("prod-" + productId).remove();
  cart.splice(idx, 1);
  localStorage.setItem("user-cart", JSON.stringify(cart));
  // location.reload();
  populateTotalAmount();
}

document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  dateInput.setAttribute("min", today); // Set the "min" attribute to today's date
});

// Order information on Whats App...

var lat, lang;
var productsName = "";
function getPosition(position) {
  lat = position.coords.latitude;
  lang = position.coords.longitude;
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getPosition);
} else {
  alert("Geolocation is not supported by this browser.");
}

populateTotalAmount();
var rs;
var totalAmount;
function populateTotalAmount() {
  totalAmount = numberWithCommas(cart.reduce((n, { total }) => n + total, 0));
  rs = totalAmount.substr(0, 1);
  document.getElementById(
    "total-amt"
  ).innerHTML = `Total Payable Amount : ${totalAmount}`;
}

// Load product data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadUserDetails();

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", doBooking);
  }
});

function doBooking(e) {
  e.preventDefault();

  let productsMessage = "";
  let sl = 1;

  cart.forEach((item) => {
    const name = item.name;
    const description = item.description;
    const priceWithCurrency = numberWithCommas(item.price);
    const totalWithCurrency = numberWithCommas(item.total);

    productsMessage += `
  ${sl}.*Name:* ${name}%0a
  *• Description:* ${description}%0a
  *• Price:* ${priceWithCurrency} × ${item.qty} = ${totalWithCurrency}%0a%0a
  `;
    sl++;
  });

  // Collect user details from the form
  const data = new FormData(e.target);
  const userDetails = {
    firstName: data.get("first_name"),
    lastName: data.get("last_name"),
    phone: data.get("phone"),
    email: data.get("email"),
    address: data.get("address"),
    city: data.get("city"),
    state: data.get("state"),
    pinCode: data.get("pin")
  };
  
  const date = data.get("date");
  const time = data.get("time");
  const instruction = data.get("comment");
  
  // Format the total amount
  const formattedTotalAmount = numberWithCommas(
    cart.reduce((n, { total }) => n + total, 0)
  );

  // Construct the final message
  const msg = `
*Order Summary*%0a

*Customer Details:*%0a
• *Name:* ${userDetails.firstName} ${userDetails.lastName}%0a
• *Contact Number:* ${userDetails.phone}%0a
• *Email Address:* ${userDetails.email}%0a
• *Delivery Address:* ${userDetails.address}, ${userDetails.city}, ${userDetails.state}, ${userDetails.pinCode}%0a
• *Delivery Date And Time:* ${date}, ${time}%0a
• *Special Instructions:* ${instruction || "None"}%0a%0a
*Order Details:*%0a
${productsMessage}%0a
*Total Payable Amount:* ${formattedTotalAmount}%0a

*Location:* https://www.google.com/maps/search/?api=1&query=${lat},${lang}
`;
  localStorage.setItem("userDetails", JSON.stringify(userDetails));
  console.log(msg);
  // window.open(`https://wa.me/919798107150?text=${msg}`);
  // window.open(`https://wa.me/919798107150?text=${encodeURIComponent(msg)}`);
}

function clearCart() {
  localStorage.removeItem("user-cart");
  document.getElementById("cartItems").innerHTML = "";
  document.getElementById(
    "total-amt"
  ).innerHTML = `Total Payable Amount : ${numberWithCommas(0)}`;
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
      state: "state",
      pin: "pinCode",
    };

    Object.keys(fieldMapping).forEach((field) => {
      const input = document.querySelector(`[name='${field}']`);
      if (input) input.value = data[fieldMapping[field]] || "";
    });
  }
}
