const filePath = '';
class SignUp extends Validator {
  constructor() {
    super();
    this.allowSignUp();
  }

  intent() {
    document.location.assign('login.html');
  }

  validateFields(){
    let isValid = true;

    if ($('#firstName').value === '') {
      $('.error-firstname').textContent = 'Firstname is required';
      isValid = false;
    } else {
      $('.error-firstname').textContent = '';
    }

    if ($('#lastName').value === '') {
      $('.error-lastname').textContent = 'Lastname is required';
      isValid = false;
    } else {
      $('.error-lastname').textContent = '';
    }

    if (!this.validate('email', $('#email').value)) {
      $('.error-email').textContent = 'Invalid email';
      isValid = false;
    } else {
      $('.error-email').textContent = '';
    }

    if (!this.validate('phone', $('#phone').value)) {
      $('.error-phone').textContent = 'Invalid phone number';
      isValid = false;
    } else {
      $('.error-phone').textContent = '';
    }

    if ($('#password').value.length < 6) {
      $('.error-password').textContent = 'Short password. At least 6 characters';
      isValid = false;
    } else {
      $('.error-password').textContent = '';
    }

    if ($('#password').value !== $('#confirmPassword').value) {
      $('.error-confirmPassword').textContent = 'Password does not match';
      isValid = false;
    } else {
      $('.error-confirmPassword').textContent = '';
    }

    if ($('#user_city').textContent === '') {
      $('.error-city').textContent = 'Please select your city';
      isValid = false;
    } else {
      $('.error-city').textContent = '';
    }
    return isValid;
  }

  allowSignUp() {
    const url = 'http://127.0.0.1:5500/api/v2/auth/signup';

    const userData = {
      first_name: $('#firstName').value,
      last_name: $('#lastName').value,
      email: $('#email').value,
      phone_number: $('#phone').value,
      password: $('#password').value,
      city: $('#user_city').value,
      country: $('#user_country').value
    }

    const init = {
      method: 'POST', body: JSON.stringify(userData), 
      headers: {'Content-Type': 'Application/json'} 
    }

    fetch(url, init)
    .then((res) => res.json())
    .then((response) => {
      if(response.error){
        console.log(response);
        console.log($('#user_city').value);
        
        return;
      }
      this.intent();
    }).catch(error => console.error('Error', error))
  }
}
