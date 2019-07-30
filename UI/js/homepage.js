class HomePage {
    constructor() {
        this.showModal();
        this.scrollLoader();
    }

    showModal() {
        const modal = $('#myModal');
        const display = $$('.single-article-gallery');
        const modalImg = $("#img01");
        const captionText = $("#caption");
        for (let image of display) {
            image.addEventListener('click', (e) => {
                const singleImage = e.currentTarget.querySelector('img');
                modal.style.display = "block";
                modalImg.src = singleImage.src;
                captionText.innerHTML = singleImage.alt;
            });
        }
        const span = $(".close");

        span.onclick = function () {
            modal.style.display = "none";
        }
    }

    scrollLoader() {
        document.addEventListener('scroll', this.scrollFunction);
    }

    scrollFunction() {
        if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            $(".navbar").style.padding = "10px";
            $(".logo").style.fontSize = "25px";
        } else {
            $(".navbar").style.padding = "40px 10px";
            $(".logo").style.fontSize = "35px";
        }
    }

}

document.addEventListener("DOMContentLoaded", new HomePage());