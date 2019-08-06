class HomePage {
  constructor() {
    this.showModal();
    this.scrollLoader();
    this.homeButtonsEvent();
  }

  showModal() {
    const modal = $('#myModal');
    const display = $$('.single-article-gallery');
    const modalImg = $('#img01');
    const captionText = $('#caption');
    for (const image of display) {
      image.addEventListener('click', (e) => {
        const singleImage = e.currentTarget.querySelector('img');
        modal.style.display = 'block';
        modalImg.src = singleImage.src;
        captionText.innerHTML = singleImage.alt;
      });
    }
    const span = $('.close');

    span.onclick = function () {
      modal.style.display = 'none';
    };
  }

  scrollLoader() {
    document.addEventListener('scroll', this.scrollFunction);
  }

  scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      $('.navbar').style.padding = '10px';
      $('.logo').style.fontSize = '25px';
    } else {
      $('.navbar').style.padding = '40px 10px';
      $('.logo').style.fontSize = '35px';
    }
  }

  homeButtonsEvent() {
    $('#btn-create-account').addEventListener('click', () => {
      document.location.href = 'html/signup.html';
    });

    // view details. send to login page
    const btn_details = $$('.btn_details');
    btn_details.forEach((btn) => {
      btn.addEventListener('click', () => {
        document.location.href = 'html/login.html';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', new HomePage());
