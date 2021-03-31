const cookieAccept = document.querySelector("#cookie-accept");
const cookieContainer = document.querySelector("#cookie-consent-container");

if (localStorage.getItem("cookies_enabled") === null) {
  cookieContainer.classList.add("d-block");
  cookieContainer.classList.remove("d-none");

  cookieAccept.addEventListener("click", function () {
    localStorage.setItem("cookies_enabled", "1");
    cookieContainer.classList.add("d-none");
  });
}
