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
let deliveryArr = [];
const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// delivery constructor;
function delivery(deliverNumber, tipsAmount, selectedPaymentMethod, timeStamp) {
  this.deliverNumber = deliverNumber;
  this.tipsAmount = Number(tipsAmount.slice(2));
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
  console.log("Contents Loaded!"); //! Added for debug purpose, remove it later
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
    console.log(selectedPaymentMethod); //! Added for debug purpose, remove it later
  });

  cashIcon.addEventListener("click", function () {
    cashIcon.style.opacity = "1";
    cardIcon.style.opacity = "0.3";
    selectedPaymentMethod = cashMethod;
    console.log(selectedPaymentMethod); //! Added for debug purpose, remove it later
  });
  console.log(selectedPaymentMethod, "Line 58"); //! Added for debug purpose, remove it later
});

// click event when addDelivery button is pressed
addDeliveryBtn.addEventListener("click", function () {}); //! Will be implemented later

// Validating the deliverNo field
deliveryNoField.addEventListener("input", function (e) {
  // Not allwoing alphabetic or any symbol characters
  deliveryNoField.value = deliveryNoField.value.replace(/[^0-9]/g, "");

  // Keeping only 3 characters
  deliveryNoField.value = deliveryNoField.value.slice(0, 3);
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

// events that occurs when the amount field is not focused
amountField.addEventListener("blur", function () {
  // add automatic 00s after a digit
  if (!amountField.value.includes(".") && amountField.value[0] != undefined) {
    amountField.value += ".00";
  }
  if (!amountField.value.includes("$") && amountField.value[0] != undefined) {
    amountField.value = "$ " + amountField.value;
  }
});

addDeliveryBtn.addEventListener("click", function () {
  // add an object in the deliveryArr, if fields are not empty
  deliveryNumber = deliveryNoField.value;
  tipsAmount = amountField.value;
  if (deliveryNumber != "" && tipsAmount != "") {
    deliveryArr.push(
      new delivery(
        deliveryNumber,
        tipsAmount,
        selectedPaymentMethod,
        currentTimeStamp()
      )
    );
    alert("Delivery added successfully!");
    addDeliveryBox.classList.remove("active");
    setTimeout(function () {
      removeValuesFromFields();
    }, 1000);
  } else {
    alert("Please fill up all the necessary fields and try again!");
  }
  console.log(deliveryArr); //! Added for debug purpose, remove it later
});

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
  let formattedTime = hours + ":" + (minutes < 10 ? "0" : "") + minutes;
  return formattedTime;
}

// Next work is to add # symbol infornt of deliveryNo
