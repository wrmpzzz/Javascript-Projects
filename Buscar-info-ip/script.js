const OPTIONS = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "XXX",
    "X-RapidAPI-Host": "YYY",
  },
};

const fetchIpInfo = async (ip) => {
  try {
    const response = await fetch(
      `https://freeipapi.com/api/json/${ip}`,
      OPTIONS
    );
    return await response.json();
  } catch (error) {
    return console.error(error);
  }
};

const $ = (selector) => document.querySelector(selector);

const $form = $("#form");
const $input = $("#input");
const $submit = $("#submit");
const $result = $("#result");

$form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { value } = $input;
  if (!value) return;

  $submit.setAttribute("disabled", "");
  $submit.setAttribute("aria-busy", "true");
  

  const ipInfo = await fetchIpInfo(value);

    if(ipInfo) {
      $result.innerText = JSON.stringify(ipInfo, null, 2);
    } else {
      $result.innerText = "No se encontraron resultados";
    }

  $submit.removeAttribute("disabled");
  $submit.removeAttribute("aria-busy");

});
