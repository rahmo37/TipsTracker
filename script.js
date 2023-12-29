let deliveryId = 0;
let deliveryNumber = 0;
let tipsAmount = 0.0;
let selectedPaymentMethod = "";
let totalAmount = 0;
let tolatCashDel = 0;
let tolatCardDel = 0;
let tolatCashAmount = 0;
let tolatCardAmount = 0;
let currentDelivery = {};
let modifyOrDeleteDeliveryId = 0;

// Step one: lets first add the logic of opening the add delivery box
let circleAddBtutton = document.querySelector(".add-delivery");
let addDeliveryBox = document.querySelector(".add-delivery-box");
let closeBtn = document.querySelector(".close");
let plusBtn = document.querySelector(".plus-btn");
let deliveryBoxHeading = document.getElementById("deliveryBox-heading");
let addDeliveryBtn = document.querySelector(".add-delivery-btn");
let modifyBtn = document.getElementById("modify-btn");
let deleteBtn = document.getElementById("delete-btn");
let deliveryNoField = document.querySelector(".delivery-number");
let amountField = document.querySelector(".tips-amount");
let cardIcon = document.getElementById("cardIcon");
let cashIcon = document.getElementById("cashIcon");
let table = document.querySelector(".table");
let totalAmountfield = document.getElementById("amount");
let resetBtn = document.getElementById("reset-btn");
let noDeliveryMessage = document.getElementById("no-delivery");
let sumDate = document.getElementById("sum-date");
let sumDel = document.getElementById("sum-del");
let sumCash = document.getElementById("sum-cash");
let sumCard = document.getElementById("sum-card");

let element;
let deliveryArr = [];
const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthArr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// First load if there are any previous delivery entries
getAddedDeliveries();

// update the date
sumDate.innerHTML = returnDateAndMonth();

// add event listener to each row
addEventListenerToRows();

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
  // toFixed returns a string
  this.tipsAmount = Number(tipsAmount.slice(2));
  console.log(this.tipsAmount);
  this.selectedPaymentMethod = selectedPaymentMethod;
  this.timeStamp = timeStamp;
}

circleAddBtutton.addEventListener("click", function () {
  removeValuesFromFields();
  addDeliveryBox.classList.toggle("active");
});

// When pressed on the clise button the box will close
closeBtn.addEventListener("click", () => {
  addDeliveryBox.classList.remove("active");
  console.log(selectedPaymentMethod);
  setTimeout(function () {
    removeValuesFromFields();
  }, 500);
});

document.addEventListener("click", (e) => {
  let tableRows = document.querySelectorAll(".table-row");
  element = e.target;
  // close the add delivery box if the element is not the circle button and the element is not the plus button and the delivery box does not contain the element and the current table row does not contain the element
  try {
    if (
      element != circleAddBtutton &&
      element != plusBtn &&
      !addDeliveryBox.contains(element) &&
      !tableRows[modifyOrDeleteDeliveryId + 1].contains(element)
    ) {
      addDeliveryBox.classList.remove("active");
    }
  } catch (e) {
    console.log(e);
    // We recicve an err when we try to close the box when there are no deliveries, because the tableRow is empty, it throws an error but we handle the error and simply close the add delivery box when the err occurs
    addDeliveryBox.classList.remove("active");
  }
  //  if the add delivery box is open then the table row and the reset button is unclickble else vise versa
  if (addDeliveryBox.classList.contains("active")) {
    resetBtn.style.pointerEvents = "none";
    tableRows.forEach((elem) => {
      elem.style.pointerEvents = "none";
    });
  } else {
    resetBtn.style.pointerEvents = "auto";
    tableRows.forEach((elem) => {
      elem.style.pointerEvents = "auto";
      setTimeout(function () {
        addOrRemoveButtons("block", "none", "none");
      }, 500);
    });
  }
});

// Lets Change the toggle card to cash / cash to card selection

document.addEventListener("DOMContentLoaded", function () {
  let cardMethod = "Card";
  let cashMethod = "Cash";
  // initial selected method
  selectedPaymentMethod = cardMethod;

  // Set the initial state
  resetSlider();

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

    currentDelivery = deliveryArr[deliveryArr.length - 1];

    // Update no delivery message
    noDelivery();

    // Sending the current delivery object with the delivery ID number, so the add Delivery method can access that delivery's attributes
    addDeliveryHtml(currentDelivery);

    // Update the total amount
    updateTotalAmount(currentDelivery);

    // Update the summary attributes
    updateSummaryAttributes(currentDelivery);

    // save the added delivery
    saveAddedDeliveries();

    // add event listener to the newly added delivery
    addEventListenerToRows();

    // The delivery id increases after every delivery added
    deliveryId = currentDelivery.deliveryId + 1;
  } else {
    // if any field is empty we alert the user
    alert("Please fill up all the necessary fields and try again!");
  }
});

// When reset btn is clicked all the delivery data is deleted
resetBtn.addEventListener("click", function () {
  const response = confirm("Are you sure you want to reset the table?");
  if (response) {
    removeDeliveries();
    deliveryArr.length = 0;
    localStorage.clear();
    resetTotalAmount();
    deliveryId = 0;
    resetSummaryAttributes();
    noDelivery();
  }
});

// This method adds listener to all table rows
// Also opens the delivery box puts the current delivery attributes in the fileds, removes the add button and adds the modify and delete buttons
function addEventListenerToRows() {
  let tableRows = document.querySelectorAll(".table-row");
  // Even if a click occurs on an inner element of a row, the event will still activate the event listener attached to the row due to event bubbling, as events propagate up to parent elements in the DOM.

  tableRows.forEach(function (row, index) {
    if (index !== 0) {
      let deliveryArrIndex = index - 1;
      row.addEventListener("click", function () {
        let response = confirm(
          `
        Delivery ID: ${deliveryArr[deliveryArrIndex].deliveryId + 1}\n
        Delivery Number: ${deliveryArr[deliveryArrIndex].deliveryNumber.slice(
          2
        )} \n
        MODIFY or DELETE this delivery?`
        );
        if (response) {
          if (!row.classList.contains("table-head")) {
            deliveryBoxHeading.innerHTML = "Configure Delivery";
            addDeliveryBox.classList.add("active");
            modifyOrDeleteDeliveryId = deliveryArrIndex;
            deliveryNoField.value =
              deliveryArr[deliveryArrIndex].deliveryNumber;
            amountField.value = "$ " + deliveryArr[deliveryArrIndex].tipsAmount;
            setSlider(deliveryArr[deliveryArrIndex].selectedPaymentMethod);
            addOrRemoveButtons("none", "block", "block");
          }
        }
      });
    }
    modifyBtn;
  });
}
// modify button logic is in this function
modifyBtn.addEventListener("click", function () {
  // confirm user's selection
  let response = confirm("Modify this delivery with the values in the field?");

  // set the new value, if the response is true
  if (response) {
    deliveryArr[modifyOrDeleteDeliveryId].deliveryNumber =
      deliveryNoField.value;
    deliveryArr[modifyOrDeleteDeliveryId].tipsAmount = Number(
      amountField.value.slice(2)
    );
    deliveryArr[modifyOrDeleteDeliveryId].selectedPaymentMethod =
      selectedPaymentMethod;
    saveAddedDeliveries();
    location.reload();

    // close the box after delivery modification
    addDeliveryBox.classList.remove("active");

    // empty the fields
    setTimeout(function () {
      removeValuesFromFields();
    }, 500);
  }
});
// delete button logic is in this function
deleteBtn.addEventListener("click", function () {
  let tableRows = document.querySelectorAll(".table-row");
  let response = confirm("Delete this delivery?");
  if (response) {
    let rowToDelete = tableRows[modifyOrDeleteDeliveryId + 1];
    if (rowToDelete && rowToDelete.parentNode) {
      rowToDelete.parentNode.removeChild(rowToDelete);
      deliveryArr.splice(modifyOrDeleteDeliveryId, 1);
      saveAddedDeliveries();
      // close the box after delivery deletion
      addDeliveryBox.classList.remove("active");
      // With this code we can relode the whole screen
      location.reload();
      // empty the fields
      setTimeout(function () {
        removeValuesFromFields();
      }, 500);
    }
  }
});

// ! ------------------------------------- Helper Methods ---------------------------------------

function resetSlider() {
  selectedPaymentMethod = "Card";
  cardIcon.style.opacity = "1";
  cashIcon.style.opacity = "0.3";
}

function setSlider(currentPaymentMethod) {
  if (currentPaymentMethod === "Card") {
    cardIcon.style.opacity = "1";
    cashIcon.style.opacity = "0.3";
  } else {
    cardIcon.style.opacity = "0.3";
    cashIcon.style.opacity = "1";
  }
}

// This function when called removes all the values from input fields
function removeValuesFromFields() {
  deliveryBoxHeading.innerHTML = "Add Delivery";
  deliveryNoField.value = "";
  amountField.value = "";
  resetSlider();
}

// This function returns the current time, formatted
function currentTimeStamp() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // Determine AM or PM suffix
  let amPm = hours >= 12 ? "PM" : "AM";

  // Optionally convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Add leading zeros to minutes if needed
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Finally format the time
  let formattedTime =
    daysArr[now.getDay()] + ", " + hours + ":" + minutes + " " + amPm;
  return formattedTime;
}

function addDeliveryHtml(currentDeliveryObj) {
  console.log(currentDeliveryObj.tipsAmount);
  // Setting an icon based on the payment method
  let icon =
    currentDeliveryObj.selectedPaymentMethod === "Card"
      ? `<i class="fa-solid fa-credit-card"></i>`
      : `<i class="fas fa-money-bill-wave"></i>`;

  // Retrieving the infomration from the current delivery object and settingits data in the HTML
  table.innerHTML += `
  <div class="table-row">
  <div class="table-cell">
    <p>${currentDeliveryObj.deliveryNumber}</p>
  </div>
  <div class="table-cell">
    <p>${currentDeliveryObj.tipsAmount.toFixed(2)}</p>
  </div>
  <div class="table-cell">
    <p>${currentDeliveryObj.selectedPaymentMethod} / ${icon}</p>
  </div>
  <div class="table-cell">
    <p>${currentDeliveryObj.timeStamp}</p>
  </div>
</div>`;
}

// Whit this function we are updating the total amount
function updateTotalAmount(currentDeliveryObj) {
  totalAmount += currentDeliveryObj.tipsAmount;
  totalAmountfield.innerHTML = totalAmount.toFixed(2);
}

// Reset the total amount to 0
function resetTotalAmount() {
  totalAmount = 0;
  totalAmountfield.innerHTML = "0.00";
}

// we are saving the delivery in our localStorage
function saveAddedDeliveries() {
  localStorage.setItem("deliveries", JSON.stringify(deliveryArr));
}

// retrieving the data from the local storage
function getAddedDeliveries() {
  if (
    localStorage.getItem("deliveries") === null ||
    localStorage.getItem("deliveries") === "[]"
  ) {
    // Since the getAddedDelivery is getting called up top, is the deliveryArr is empty the message will be show.
    noDelivery();
    console.log("localStorage Empty!");
  } else {
    console.log("Hi");
    try {
      deliveryArr.push(...JSON.parse(localStorage.getItem("deliveries")));
    } catch (err) {
      console.log(err.title);
    }
    deliveryArr.forEach(function (elem) {
      {
        addDeliveryHtml(elem);
        // console.log(elem.deliveryId, "elem.deliveryID");

        // console.log(deliveryId, "deliveryID");
        updateTotalAmount(elem);

        // Update the summary attribute
        updateSummaryAttributes(elem);
        console.log("line 498");
      }
      deliveryId = deliveryArr[deliveryArr.length - 1].deliveryId + 1;
    });
  }
}

// This function is deleting all the elements in the table except the heading
function removeDeliveries() {
  let firstElement = table.firstElementChild;
  while (firstElement.nextSibling) {
    table.removeChild(firstElement.nextSibling);
  }
}

// The no delivery function, that will show a message that no delivery yet
function noDelivery() {
  console.log(deliveryArr.length);
  if (deliveryArr.length === 0) {
    noDeliveryMessage.style.display = "block";
  } else {
    noDeliveryMessage.style.display = "none";
  }
}

// this method formats and updates the summary attributes
function updateSummaryAttributes(currentDelivery) {
  sumDel.innerHTML = deliveryArr.length;
  if (currentDelivery.selectedPaymentMethod === "Card") {
    tolatCardDel++;
    tolatCardAmount += currentDelivery.tipsAmount;
    sumCard.innerHTML = `${tolatCardAmount.toFixed(2)} / ${tolatCardDel}`;
  } else {
    tolatCashDel++;
    tolatCashAmount += currentDelivery.tipsAmount;
    sumCash.innerHTML = `${tolatCashAmount.toFixed(2)} / ${tolatCashDel}`;
  }
}

// reset all the summary attributes
function resetSummaryAttributes() {
  tolatCardDel = 0;
  tolatCardAmount = 0;
  tolatCashDel = 0;
  tolatCashAmount = 0;
  sumDel.innerHTML = "0";
  sumCard.innerHTML = "$0.00 / 0";
  sumCash.innerHTML = "$0.00 / 0";
}

// returns date and month in this format: 10-dec
function returnDateAndMonth() {
  let date = new Date(); //Current date and time
  let today = date.getDate(); // current date of the month
  let monthNo = date.getMonth(); // month as a number (0-11)
  let monthName = monthArr[monthNo];
  return today + "-" + monthName;
}

// dynamically add or remove the buttons
function addOrRemoveButtons(addBtnVal, modBtnVal, delBtnVal) {
  addDeliveryBtn.style.display = addBtnVal;
  modifyBtn.style.display = modBtnVal;
  deleteBtn.style.display = delBtnVal;
}

// add necessary comments, deliveryID issue is fixed, however there are some more bugs in the code, identify them, one of the bug is when delivery deltetion is confirmation promed if the promt is closed the values in the deliveryBox is cleared which is not intended, after that implement the logic for modification btn
