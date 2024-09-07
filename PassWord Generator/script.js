// TODO: functions---->
// /* 1.0 copy content
//    2,0 hendle Slider
//    3.0 generate password
//    4.0 set Indicator
//    5.0 random Integer
//    6.0 random uppercase, lowercase, number, symbols
//    7.0 calculate strength
//    8.0     */
// NOTE: Fetch all elements
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// //NOTE: Basics
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");

// TODO: Handle Slider - set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  // 
  inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}
// TODO: SetIndicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
// TODO: get Random Integer - min,max
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// TODO: get random Numbers
function generateRandomNumber() {
  return getRndInteger(0, 9);
}
// TODO: get random lowercase letters
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}
// TODO: get random uppercase letters
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}
// TODO: get random Symbol
function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
// TODO: calculate Strength
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// TODO: Copy Content
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}
// TODO: suffle
function shufflePassword(array) {
  //NOTE: Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
// TODO: checboxHandler
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  // BUG: special Conditionn
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}
// TODO: checkbox listner to follow count
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

// TODO:  inputslider Eventlistner to change length number
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// TODO: copy btn
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});
// TODO: Generate PAssword
generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected

  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let's start the jouney to find new password
  console.log("Starting the Journey");
  //remove old password
  password = "";

  //let's put the stuff mentioned by checkboxes

  // if(uppercaseCheck.checked) {
  //     password += generateUpperCase();
  // }

  // if(lowercaseCheck.checked) {
  //     password += generateLowerCase();
  // }

  // if(numbersCheck.checked) {
  //     password += generateRandomNumber();
  // }

  // if(symbolsCheck.checked) {
  //     password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("COmpulsory adddition done");

  //remaining adddition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }
  console.log("Remaining adddition done");
  //shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("Shuffling done");
  //show in UI
  passwordDisplay.value = password;
  console.log("UI adddition done");
  //calculate strength
  calcStrength();
});
