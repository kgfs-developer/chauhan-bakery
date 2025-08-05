var productJson = [];
var cart = [];
var category_masterJSON = [];

async function getCategoryMasterData() {
  const result = await fetch("data/category_master.json");
  return await result.json();
}
async function createCategoryButtons() {
  category_masterJSON = await getCategoryMasterData();
  const catagoryButtons = document.getElementById("categories-buttons");
  for (const category of category_masterJSON) {
    catagoryButtons.innerHTML += `<p class="category-button">
              <button type="button" class="btn btn-group-md" onclick="loadCatalog(${category.id})">${category.name}</button>
            </p>`;
  }
}
createCategoryButtons();
// console.log(getCategoryMasterData());

async function getData() {
  const res = await fetch("data/product.json");
  return await res.json();
}

async function loadCatalog(categoryId) {
  productJson = await getData();
  if (categoryId) {
    productJson = productJson.filter((x) => x.categories.includes(categoryId));
  }
  // Dynamically Star rating
  function dynamicallyStar(rating) {
    let star = "";
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        star += '<i class="fa fa-star checked"></i>';
      } else {
        star += '<i class="fa fa-star"></i>';
      }
    }
    return star;
  }

  const productJsonRow = document.getElementById("product-list");
  productJsonRow.innerHTML = "";
  for (const product of productJson) {
    productJsonRow.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 product-block">
            <div class="thumbnail">
              <img src="${product.img}" alt="${product.name}" />
              <div class="rating">${dynamicallyStar(product.rating)}</div>
              <b class="name-deeppink">${product.name}</b><br>
              <span><i>${numberWithCommas(product.price)}</i>${
      product.unit
    }</span><br>
              <p class="item-description">
              ${product.description}
              </p>
              <div class="button-area">
                
                <div>
                  <a class="btn btn-default" onclick="addToCart(${product.id})">
                    <span class="glyphicon glyphicon-shopping-cart"></span>
                    Add to Cart
                  </a>
                </div>
                <div>
                  <a href="orderNow.html?id=${
                    product.id
                  }" class="btn btn-default">
                    <i class="fa fa-motorcycle"></i> Order Now
                  </a>
                </div>
              </div>
            </div>
          </div> `;
  }
}

loadCatalog();

//  MY SIDE PANEL START

function toggleNav() {
  let element = document.getElementById("mySidepanel");
  element.classList.toggle("nav-open");
}

function addToCart(selectedId) {
  let selectedProduct = productJson.find((item) => item.id == selectedId);
  cart = JSON.parse(localStorage.getItem("user-cart") || "[]");
  let productFoundInCart = cart.find((item) => item.id == selectedId);
  let qty = 1;
  if (productFoundInCart) {
    productFoundInCart.qty += qty;
    productFoundInCart.total =
      productFoundInCart.qty * productFoundInCart.price;
  } else {
    // destructuring selectedProduct and adding qty, total in new object
    cart.push({ ...selectedProduct, qty, total: selectedProduct.price * qty });
  }
  // console.log(cart);
  renderCart();
}

function renderCart() {
  localStorage.setItem("user-cart", JSON.stringify(cart));
  var cartHTML = "";
  cart.forEach((item) => {
    cartHTML += `<div class="product" >
                      <div class="product-details-section">
                        <div class="col-sm-4 thumbnail">
                          <img src="${item.img}" alt="${item.name}" />
                        </div>
                        <p class="col-sm-8 description itemName">
                        <b class="name-deepPink">${item.name}</b><br>
                        ${item.description}
                        </p>
                      </div>
                      <div class="product-pricing-section">
                        <div class="price">
                          <span class="left-panel">
                            <span><b>MRP </b>${numberWithCommas(
                              item.price
                            )}</span><span class="multiply">&times;</span>
                            <input
                              type="number"
                              name="quantity"
                              class="form-control border-dark-subtle input-number num"
                              value="${item.qty}" min="0" max="999"
                              onchange="validateQty(this, ${item.id})"
                            />
                          </span>
                          <span>
                            <span class="total-price">${numberWithCommas(
                              item.total
                            )}</span>
                            <a class="btn-sm btn-delete" onclick="removeFromCart(${
                              item.id
                            })">
                              <span class="glyphicon glyphicon-trash"></span>
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>`;
  });
  document.getElementById("cartItems").innerHTML = cartHTML;

  //   document.getElementById("cart-badge").innerHTML = parseInt(cart.reduce(
  //     (n, { qty }) => n + qty,
  //     0
  // ));
  document.getElementById("cart-badge").innerHTML = cart.length;

  document.getElementById(
    "total-amt"
  ).innerHTML = `Total Amount : ${numberWithCommas(
    cart.reduce((n, { total }) => n + total, 0)
  )}`;
}

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
  renderCart();
}

function removeFromCart(productId) {
  // todo: proceed with delete
  console.log("proceed with delete:" + productId);
  let idx = cart.findIndex((x) => x.id == productId);
  cart.splice(idx, 1);
  renderCart();
}

function loadCart() {
  cart = JSON.parse(localStorage.getItem("user-cart") || "[]");
  renderCart();
}
function clearCart() {
  localStorage.removeItem("user-cart");
  document.getElementById("cartItems").innerHTML = "";
  document.getElementById(
    "total-amt"
  ).innerHTML = `Total Amount : ${numberWithCommas(0)}`;
  // localStorage.clear();
}
