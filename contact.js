// CONTACT FORM SUBMISION AREA
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById('ijowk-3');
const email = document.getElementById('ipmgh-3');
const number = document.getElementById('imgis-3');
const message = document.getElementById('i5vyy-3');
const submitButton = document.getElementById('w-c-s-bgc_p-1-dm-id-2');

// Needed data to make request to Emailjs
// const publicKey = "-kd67WNS2_fh58PfG";
const serviceID = "service_pwjotke";
const templateID = "template_ztjkc4m";

// Initialise emailjs with publicKey
// emailjs.init(publicKey);

// Add submit event to the form
contactForm.addEventListener("submit", e => {
  // Prevent default form behaviour
  e.preventDefault();
  
  // change button text
  submitButton.innerText = "Just A Moment...";

  // Get all input field values
  const inputFields = {
    name: nameInput.value,
    email: email.value,
    number: number.value,
    message: message.value
  }

  // Sending the email
  emailjs.send(serviceID, templateID, inputFields)
  .then(() => {
    // change button text
    submitButton.innerText = "Message Sent Successfully"

    // Clearing out all input fields
    nameInput.value = "";
    email.value = "";
    number.value = "";
    message.value = ""; 
  }, (error) => {
    console.log("error: ", error);
    submitButton.innerText = "Something Went Wrong";
  })
})

