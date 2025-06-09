const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.carousel-card');
const radios = document.querySelectorAll('.carousel-nav input[type="radio"]');


track.addEventListener('scroll', () => {
    const trackRect = track.getBoundingClientRect();

    cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const trackCenter = trackRect.left + trackRect.width / 2;

        if (Math.abs(cardCenter - trackCenter) < cardRect.width / 2) {
            radios[index].checked = true;
        }
    });
});
