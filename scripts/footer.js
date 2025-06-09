window.addEventListener("DOMContentLoaded", () => {
    const counterKey = 'moodquest-visit-count';
    let visitCount = localStorage.getItem(counterKey);

    if (visitCount === null) {
        visitCount = 1;
    } else {
        visitCount = parseInt(visitCount) + 1;
    }

    localStorage.setItem(counterKey, visitCount);

    const counterElement = document.getElementById("visitor-count");
    if (counterElement) {
        counterElement.textContent = visitCount;
    }
});
