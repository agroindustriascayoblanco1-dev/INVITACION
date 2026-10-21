const config = window.APP_CONFIG || {};
const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("formStatus");
const rsvpCard = document.querySelector(".rsvp-card");
const successCard = document.getElementById("success");
const successText = document.getElementById("successText");
const editBtn = document.getElementById("editBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Guardando confirmación...";

  const payload = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim() || "",
    guests: Number(document.getElementById("guests").value),
    menu: document.querySelector('input[name="menu"]:checked')?.value || "",
    notes: document.getElementById("notes").value.trim() || "",
    confirmed: document.getElementById("confirmed").checked ? "true" : "false"
  };

  try {
    if (!config.GOOGLE_SHEETS_URL) {
      throw new Error("No está configurada la URL de Google Sheets.");
    }

    // Se envía como formulario para evitar preflight CORS con Google Apps Script.
    const body = new URLSearchParams(payload).toString();
    await fetch(config.GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body
    });

    // Con no-cors el navegador no permite leer la respuesta del Web App,
    // por lo que la confirmación visual se muestra cuando la solicitud fue enviada.
    successText.textContent =
      `Gracias, ${payload.name}. Registramos tu asistencia para ${payload.guests} ${
        payload.guests === 1 ? "persona" : "personas"
      } con menú de ${payload.menu}.`;
    rsvpCard.classList.add("hidden");
    successCard.classList.remove("hidden");
    successCard.scrollIntoView({behavior:"smooth", block:"center"});
    statusEl.textContent = "";
  } catch (error) {
    console.error(error);
    statusEl.textContent =
      "No pudimos enviar la confirmación. Verifica tu conexión e inténtalo nuevamente.";
  }
});

editBtn.addEventListener("click", () => {
  successCard.classList.add("hidden");
  rsvpCard.classList.remove("hidden");
  rsvpCard.scrollIntoView({behavior:"smooth"});
});
