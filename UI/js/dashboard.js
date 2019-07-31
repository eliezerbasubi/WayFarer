class Dashboard {
    constructor() {
        this.defaultClick();
        this.createTrip();
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

}

document.addEventListener("DOMContentLoaded", () => {
    new Dashboard();
});