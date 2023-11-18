// Step one: lets first add the logic of opening the add delivery box
let circleAddBtutton = document.querySelector(".add-delivery");
let addDeliveryBox = document.querySelector(".add-delivery-box");
let closeBtn = document.querySelector(".close");
console.log(closeBtn);
let plusBtn = document.querySelector(".plus-btn");

circleAddBtutton.addEventListener("click", function () {
  addDeliveryBox.classList.toggle("active");
});

// When pressed on the clise button the box will close
closeBtn.addEventListener("click", () => {
  addDeliveryBox.classList.remove("active");
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
