class Dashboard {
    constructor() {
        this.isAdminD = localStorage.getItem('isAdmin');
        this.defaultClick();
        this.createTrip();
        this.cancelTrip();
    }
    createTrip(){
        $('#btn_create_trip').addEventListener('click',()=>{
            showSnackBar('Trip created successfully');
        });
    }

    displayDash(evt, divName) {
        let i, tabcontent, tablinks;
        tabcontent = $$(".tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = $$(".tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        $(`#${divName}`).style.display = "block";
        evt.currentTarget.className += " active";
    }

    // Set default click for first item in menu
    defaultClick() {
        $("#defaultOpen").click();
    }

    // Retrieve user status (isAdmin)
    manageUsers() {
        const adminAccess = $$('[aria-admin-access]');
        const userAccess = $$('[aria-user-access]');
        const adminTabDefault = $('.admin-default-tab');
        const userDefaultTab = $('.user-default-tab');
        const names = $$('.username');

        if (this.isAdmin === 'admin') {
            userAccess.forEach(access => {
                access.style.display = 'none';
            });
            this.cancelTrip();
        } else {
            adminAccess.forEach(access => {
                access.style.display = 'none';
                userDefaultTab.id = 'defaultOpen'; //Set user default tab id 
                adminTabDefault.id = ""; // Remove default admin tab. Create trips
            });

            // Append default user name in bookings
            names.forEach(username => {
                username.textContent = "Jon Doe";
            });
        }
    }

    cancelTrip(){
        const isAdmin = localStorage.getItem('isAdmin');
        const btns_cancel = $$('.cancel_trip');
        btns_cancel.forEach(button => {
            button.addEventListener('click',()=>{
                if(isAdmin === "admin"){
                    showSnackBar('Trip cancelled successfully');
                }
            });
        });
    }

}

document.addEventListener("DOMContentLoaded", () => {
    new Dashboard();
});