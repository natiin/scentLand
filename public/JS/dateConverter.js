if (document.querySelector(".review")) {
  const allDates = document.querySelectorAll(".date-convert");

  for (let date of allDates) {
    let stringDate = date.innerText;
    const newDate = dateFormatter(stringDate);
    date.innerText = `${newDate.d}, ${newDate.t}`;
    date.classList.add("small");
  }

  function dateFormatter(date) {
    const dateObj = new Date(date);
    const isoStr = dateObj.toISOString().split("T");
    const d = isoStr[0];
    const t = isoStr[1].substring(0, 5);
    return { d, t };
  }
}

//convert Date Object to format [YYYY-MM-DD] & [HH:MM]
