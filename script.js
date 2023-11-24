let deliveryId = 0;
let deliveryNumber = 0;
let tipsAmount = 0.0;
let selectedPaymentMethod = "";

// Step one: lets first add the logic of opening the add delivery box
let circleAddBtutton = document.querySelector(".add-delivery");
let addDeliveryBox = document.querySelector(".add-delivery-box");
let closeBtn = document.querySelector(".close");
let plusBtn = document.querySelector(".plus-btn");
let addDeliveryBtn = document.querySelector(".add-delivery-btn");
let deliveryNoField = document.querySelector(".delivery-number");
let amountField = document.querySelector(".tips-amount");
let cardIcon = document.getElementById("cardIcon");
let cashIcon = document.getElementById("cashIcon");
let table = document.querySelector(".table");
let deliveryArr = [];
const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// delivery constructor;
function delivery(
  deliveryId,
  deliveryNumber,
  tipsAmount,
  selectedPaymentMethod,
  timeStamp
) {
  this.deliveryId = deliveryId;
  this.deliveryNumber = deliveryNumber;
  this.tipsAmount = Number(tipsAmount.slice(2)).toFixed(2);
  this.selectedPaymentMethod = selectedPaymentMethod;
  this.timeStamp = timeStamp;
}

circleAddBtutton.addEventListener("click", function () {
  addDeliveryBox.classList.toggle("active");
});

// When pressed on the clise button the box will close
closeBtn.addEventListener("click", () => {
  addDeliveryBox.classList.remove("active");
  setTimeout(function () {
    removeValuesFromFields();
  }, 500);
});

document.addEventListener("click", (e) => {
  if (
    e.target != circleAddBtutton &&
    e.target != plusBtn &&
    !addDeliveryBox.contains(e.target)
  ) {
    addDeliveryBox.classList.remove("active");
  }
});

// Lets Change the toggle card to cash / cash to card selection

document.addEventListener("DOMContentLoaded", function () {
  let cardMethod = "Card";
  let cashMethod = "Cash";
  // initial selected method
  selectedPaymentMethod = cardMethod;

  // Set the initial state
  cardIcon.style.opacity = "1";
  cashIcon.style.opacity = "0.3";

  // Now lets add event listeners
  cardIcon.addEventListener("click", function () {
    cardIcon.style.opacity = "1";
    cashIcon.style.opacity = "0.3";
    selectedPaymentMethod = cardMethod;
  });

  cashIcon.addEventListener("click", function () {
    cashIcon.style.opacity = "1";
    cardIcon.style.opacity = "0.3";
    selectedPaymentMethod = cashMethod;
  });
});

// Validating the deliverNo field
deliveryNoField.addEventListener("input", function (e) {
  // Not allwoing alphabetic or any symbol characters
  deliveryNoField.value = deliveryNoField.value.replace(/[^0-9]/g, "");

  // Keeping only 3 characters
  deliveryNoField.value = deliveryNoField.value.slice(0, 3);
});

// when delivery filed is unfocused, the # symbol added to it
deliveryNoField.addEventListener("blur", function (e) {
  let value = deliveryNoField.value;

  // if deliveryValue does not start with # symbol and the deliveryValue is not empty
  // then we add a # symbol
  if (!value.startsWith("#") && value !== "") {
    value = "# " + value;
  }
  deliveryNoField.value = value;
});

// Validating amount field
amountField.addEventListener("input", function (e) {
  // Not allowing alphabetic or any symbol character, however "." is allowed
  amountField.value = amountField.value.replace(/[^0-9.]/g, "");

  // only keep 5 characters
  amountField.value = amountField.value.slice(0, 5);

  // add automatic . when two digits are entered, if second character is already a . then no need to add
  if (amountField.value.length === 2 && amountField.value[1] != ".") {
    amountField.value += ".";
  }
  // Do not allow 2 dots
  for (
    let i = amountField.value.indexOf(".") + 1;
    i < amountField.value.length;
    i++
  ) {
    if (amountField.value[i] === ".") {
      amountField.value = amountField.value.slice(0, i);
      alert("No more dots allowed!");
    }
  }

  // Allow the dot to be deleted
  if (e.inputType === "deleteContentBackward") {
    if (amountField.value.length === 3) {
      amountField.value = amountField.value.slice(0, 2);
    }
  }

  // dont allow third decimal
  if (amountField.value.includes(".")) {
    if (amountField.value[amountField.value.indexOf(".") + 3] != undefined) {
      amountField.value = amountField.value.slice(0, 4);
      alert("only 2 digits allowed after decimal!");
    }
  }

  // cant enter . at the beginning
  if (amountField.value[0] === ".") {
    amountField.value = "";
  }

  //
  if (amountField.value.includes(".")) {
  }
});

amountField.addEventListener("blur", function () {
  let value = amountField.value;
  let decimalPart = value.split(".")[1];

  // Add automatic .00 if no decimal point is present and the value is not empty
  if (!value.includes(".") && value !== "") {
    value += ".00";
  }
  // If there's one digit after the decimal, add one more 0
  else if (value.includes(".") && decimalPart.length === 1) {
    value += "0";
  }
  // If there's a decimal point but no digits after it, add two 0s
  else if (value.includes(".") && decimalPart.length === 0) {
    value += "00";
  }

  // Truncate to two decimal places if there are more than two
  let decimalIndex = value.indexOf(".");
  // If total length of value - decimalIndex is greater than three, basically means
  // if there are more than 2 zeros than we only keep 2
  // first we parse the value to float then even if there are more 0s we keep only 2
  if (decimalIndex !== -1 && value.length - decimalIndex > 3) {
    value = parseFloat(value).toFixed(2);
  }

  // Add $ sign if not present
  if (!value.startsWith("$") && value !== "") {
    value = "$ " + value;
  }

  amountField.value = value;
});

addDeliveryBtn.addEventListener("click", function () {
  // add an object in the deliveryArr, if fields are not empty
  deliveryNumber = deliveryNoField.value;
  tipsAmount = amountField.value;
  console.log(tipsAmount);
  if (deliveryNumber != "" && tipsAmount != "") {
    deliveryArr.push(
      new delivery(
        deliveryId,
        deliveryNumber,
        tipsAmount,
        selectedPaymentMethod,
        currentTimeStamp()
      )
    );

    alert("Delivery added successfully!");

    // close the box after delivery addition
    addDeliveryBox.classList.remove("active");

    // empty the fields
    setTimeout(function () {
      removeValuesFromFields();
    }, 500);
    addDeliveryHtml(deliveryArr[deliveryId]);
    deliveryId++;
  } else {
    // if any field is empty we alert the user
    alert("Please fill up all the necessary fields and try again!");
  }
  console.log(deliveryArr);
});

// ! ------------------------------------- Helper Methods ---------------------------------------

// This function when called removes all the values from input fields
function removeValuesFromFields() {
  deliveryNoField.value = "";
  amountField.value = "";
  cardIcon.style.opacity = "1";
  cashIcon.style.opacity = "0.3";
}

// This function returns the current time, formatted
function currentTimeStamp() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // You can format the time as a string as follows:
  let timeString = hours + ":" + minutes;

  // If you want to add leading zeros to minutes and seconds:
  let formattedTime =
    daysArr[now.getDay()] +
    ", " +
    hours +
    ":" +
    (minutes < 10 ? "0" : "") +
    minutes;
  return formattedTime;
}

function addDeliveryHtml(currentDeliveryObj) {
  table.innerHTML += `
  <div class="table-row">
  <div class="table-cell">
    <p>${currentDeliveryObj.deliveryNumber}</p>
  </div>
  <div class="table-cell">
    <p>${"$ " + currentDeliveryObj.tipsAmount}</p>
  </div>
  <div class="table-cell">
    <p>${currentDeliveryObj.selectedPaymentMethod}</p>
  </div>
  <div class="table-cell">
    <p>${currentDeliveryObj.timeStamp}</p>
  </div>
</div>`;
}

// Next, add comments where necessary and icons to the table fields
