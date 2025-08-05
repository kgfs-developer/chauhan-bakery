
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

function doBooking(e){
    e.preventDefault();
    const data = new FormData(e.target);
    const firstName = data.get('first_name') ;
    const lastName = data.get('last_name') ;
    const phone = data.get('phone') ;
    const email = data.get('email') ;
    const address = data.get('address') ;
    const city = data.get('city') ;
    const state = data.get('state') ;
    const pinCode = data.get('pin') ;
    const date = data.get('date') ;
    const time = data.get('time') ;
    const comment = data.get('comment') ;

    checkboxes = document.querySelectorAll('.service-item input[type="checkbox"]');
    selectedServiceIds = [];
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedServiceIds.push(checkbox.id); 
      } 
    });
    var selectedServiceItemNames = '';
    if (selectedServiceIds.length>0){
      selectedService.serviceItems.forEach(x=>{
        if(selectedServiceIds.includes(x.id)){
          selectedServiceItemNames += `${x.name}(${x.price}), `;
        }
      });
    }

    selectedServiceItemNames = selectedServiceItemNames.substring(0,selectedServiceItemNames.length-2);


    const msg = `Booking Request for ${selectedService.name}%0a
Name: ${firstName} ${lastName}%0a
Contact Number: ${phone}%0a
Email Address: ${email}%0a
Service Address: ${address}%0a
Preferred Date and Time for Service:${date} ${time}%0a
${selectedServiceIds.length>0? 'Service For: '+selectedServiceItemNames:''}%0a
Problem Description: ${comment}%0a
Location: https://www.google.com/maps/search/?api=1%26query=${lat},${lang}`;

    window.open(`https://api.whatsapp.com/send/?phone=919798107150&text=${msg}`);
    //window.open(`https://wa.me/919798107150?text=${msg}`);
    // console.log(msg);

  }


  const loadJSON = (callback) => {
    const xObj = new XMLHttpRequest();
    xObj.overrideMimeType("application/json");
    // 1. replace './data.json' with the local path of your file
    xObj.open('GET', './data/services.json', true);
    xObj.onreadystatechange = () => {
        if (xObj.readyState === 4 && xObj.status === 200) {
            // 2. call your callback function
            callback(xObj.responseText);
        }
    };
    xObj.send(null);
  }
  
  const init = () => {
    loadJSON((response) => {
        // 3. parse JSON string into JSON Object
        const data = JSON.parse(response);
  
        const urlParams = new URLSearchParams(window.location.search);
        const serviceId = urlParams.get("id");
  
        selectedService = data.find(x=>x.id == serviceId);
        document.getElementById("service-image").src = selectedService.img;
        let serviceItems = "";
        selectedService.serviceItems.forEach(sItem=>{
            serviceItems += `<div class='service-item'> <span><input type="checkbox" name="${sItem.id}" id="${sItem.id}"><span class='service-name'>${sItem.name}</span></span><span class="service-price">Rs.${sItem.price}</span></div>`;
        }); 
        document.getElementById("service-items").innerHTML = serviceItems;
    });
  }
  
  init();