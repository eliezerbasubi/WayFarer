class SignIn extends Validator {
    constructor() {
        super();
        this.allow();
    }
    
    intent() {
        const adminDefaultEmail = "admin1234@gmail.com";
        const input_email = $('#email_log').value;
        if (input_email === adminDefaultEmail) {
            localStorage.setItem('isAdmin', 'admin'); 
        } else {
            localStorage.setItem('isAdmin', 'user');
        }

        document.location.assign("../html/dashboard.html");
    }

    allow() {
        const email = $("#email_log").value;
        const password = $("#password_log").value;
        const errorEmail = $(".error-email");
        const errorPassword = $(".error-password");

        let isAllowed = true;

        if (!this.validate("email", email)) {
            errorEmail.textContent = "Invalid email address"
            isAllowed = false;
        } else {
            errorEmail.textContent = "";
        }

        if (password.toString().length < 6) {
            errorPassword.textContent = "Enter at least 6 characters password"
            isAllowed = false;
        } else {
            errorPassword.textContent = "";
        }

        if (isAllowed) {
            this.intent();
        }
    }
}