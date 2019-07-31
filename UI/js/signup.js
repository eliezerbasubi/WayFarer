let filePath = ""
class SignUp extends Validator {
    constructor() {
        super();
        this.allowSignUp();
    }

    intent() {
        document.location.assign("login.html");
    }

    allowSignUp() {
        // Errors
        const errorFname = $(".error-firstname");
        const errorLname = $(".error-lastname");
        const errorEmail = $(".error-email");
        const errorPhone = $(".error-phone");
        const errorPwd = $(".error-password");
        const errorConPwd = $(".error-confirmPassword");
        const errorCity = $(".error-city");

        // Values
        const firstName = $("#firstName").value;
        const lastName = $("#lastName").value;
        const email = $("#email").value;
        const phone = $("#phone").value;
        const password = $("#password").value;
        const confirmPassword = $("#confirmPassword").value;
        const city = $("#user_city").textContent;

        let isValid = true;

        if (firstName === "") {
            errorFname.textContent = 'Firstname is empty';
            isValid = false;
        } else {
            errorFname.textContent = "";
        }

        if (lastName === "") {
            errorLname.textContent = "Lastname is empty";
            isValid = false;
        } else {
            errorLname.textContent = "";
        }

        if (!this.validate("email", email)) {
            errorEmail.textContent = "Invalid email";
            isValid = false;

        } else {
            errorEmail.textContent = "";
        }

        if (!this.validate("phone", phone)) {
            errorPhone.textContent = "Invalid phone number";
            isValid = false;

        } else {
            errorPhone.textContent = "";
        }

        if (password.length < 6) {
            errorPwd.textContent = "Short password. At least 6 characters";
            isValid = false;
        } else {
            errorPwd.textContent = "";
        }

        if (password !== confirmPassword) {
            errorConPwd.textContent = "Password does not match";
            isValid = false;
        } else {
            errorConPwd.textContent = "";
        }

        if(city === ''){
            errorCity.textContent = 'Please select your city';
            isValid = false;
        } else{
            errorCity.textContent = '';
        }

        if (isValid === true) {
            this.intent();
        }

    }
}