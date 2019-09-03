class SignIn extends Validator {
  constructor() {
    super();
    this.allow();
  }

  // intent() {
  //   const adminDefaultEmail = 'admin1234@gmail.com';
  //   const input_email = $('#email_log').value;
  //   if (input_email === adminDefaultEmail) {
  //     localStorage.setItem('isAdmin', 'admin');
  //   } else {
  //     localStorage.setItem('isAdmin', 'user');
  //   }

  //   document.location.assign('../pages/dashboard.html');
  // }

  validateFields(){
    let isAllowed = true;

    if (!this.validate('email', $('#email_log').value)) {
      $('.error-email').textContent = 'Invalid email address';
      isAllowed = false;
    } else {
      $('.error-email').textContent = '';
    }

    if ($('#password_log').value.toString().length < 6) {
      $('.error-password').textContent = 'Enter at least 6 characters password';
      isAllowed = false;
    } else {
      $('.error-password').textContent = '';
    }

    return isAllowed;
  }

  allow() {
    const email = $('#email_log').value;
    const password = $('#password_log').value;
    if (this.validateFields()) {
      const url = 'http://127.0.0.1:5500/api/v2/auth/signin';
      const credentials = { email: email, password: password }
      const fetchData ={
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { "Content-Type": 'application/json' }
      }
      fetch(url,fetchData)
      .then(res => res.json()) 
      .then((response) => {
        if(response.error){
          $('.error-api').textContent = response.error;
          return;
        }
        $('.error-api').textContent = '';
        localStorage.setItem('isAdmin', response.data.is_admin);
        localStorage.setItem('firstname', response.data.firstname);
        localStorage.setItem('lastname', response.data.lastname);
        localStorage.setItem('token', response.data.token);
        document.location.assign('../pages/dashboard.html');
      }) 
      .catch(error => console.error('Error:', error));
    }
  }
}