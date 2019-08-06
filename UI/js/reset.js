class Reset extends Validator {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    const errorEmail = $('.error-reset-email');
    const email = $('#email_reset').value;
    let isValid = true;
    if (!this.validate('email', email)) {
      errorEmail.textContent = 'Invalid email';
      isValid = false;
    } else {
      errorEmail.textContent = '';
    }

    if (isValid) {
      showSnackBar(`A link was sent to ${email}`);
    }
  }
}
