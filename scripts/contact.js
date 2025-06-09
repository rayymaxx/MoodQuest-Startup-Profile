document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    alert(`Thanks for your message, ${name}! We'll be in touch.`);

    this.reset(); 
});
