/*
    Author : Eliezer Basubi
    Created on : 7 June 2019
*/

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

const showSnackBar = (snackContent) => {
  const displaySnack = $('#snackbar');
  displaySnack.textContent = snackContent;
  displaySnack.className = 'show';
  setTimeout(() => {
    displaySnack.className = displaySnack.className.replace('show', '');
  }, 3000);
};

class Validator {
  validate(inputType, value) {
    if (inputType == undefined || value == undefined) {
      return false;
    }

    const filter = value.toString().toLowerCase().trim();
    let pure;

    switch (inputType) {
      case 'text': {
        pure = /^[a-zA-Z'-]{2,30}$/;
        break;
      }
      case 'number': {
        pure = /^-{0,1}\d+$/;
        break;
      }
      case 'email': {
        pure = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        break;
      }
      /* Allowed formats (123) 456-7890 , (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 - Tested*/
      case 'phone': {
        pure = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        break;
      }
      case 'url': {
        return false;
      }
      default: {
        return false;
      }
    }

    return pure.test(filter);
  }
}
