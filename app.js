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

    // Google Apps Script recibe los datos como parámetros de formulario.
    const body = new URLSearchParams(payload).toString();
    const response = await fetch(config.GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body
    });

    const text = await response.text();
    let result = {};
    try { result = JSON.parse(text); } catch (_) {}

    if (!response.ok || result.success === false || result.ok === false) {
      throw new Error(result.message || "Google Sheets rechazó la confirmación.");
    }

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
      "No pudimos guardar la confirmación. Verifica la conexión con Google Sheets e inténtalo nuevamente.";
  }
});

editBtn.addEventListener("click", () => {
  successCard.classList.add("hidden");
  rsvpCard.classList.remove("hidden");
  rsvpCard.scrollIntoView({behavior:"smooth"});
});
