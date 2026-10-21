const config = window.APP_CONFIG || {};
const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("formStatus");
const rsvpCard = document.querySelector(".rsvp-card");
const successCard = document.getElementById("success");
const successText = document.getElementById("successText");
const editBtn = document.getElementById("editBtn");
const guestsEl = document.getElementById("guests");
const guestMenusEl = document.getElementById("guestMenus");
const phoneEl = document.getElementById("phone");

const MENU_OPTIONS = [
  { name: "Fettuccine Alfredo", description: "Pasta Fettuccine con salsa Alfredo" },
  { name: "Cordón Bleu", description: "Filete de pollo relleno de jamón y queso" },
  { name: "Filete de cerdo", description: "Bañado con salsa de tamarindo" }
];

function formatPhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("504")) digits = digits.slice(3);
  digits = digits.slice(0, 8);

  if (digits.length > 4) {
    return `+504 ${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return `+504 ${digits}`;
}

phoneEl.addEventListener("input", () => {
  phoneEl.value = formatPhone(phoneEl.value);
});

phoneEl.addEventListener("focus", () => {
  if (!phoneEl.value || phoneEl.value === "+504") {
    phoneEl.value = "+504 ";
    requestAnimationFrame(() => {
      phoneEl.setSelectionRange(phoneEl.value.length, phoneEl.value.length);
    });
  }
});

phoneEl.addEventListener("keydown", (event) => {
  const protectedLength = 5;
  if ((event.key === "Backspace" || event.key === "Delete") && phoneEl.selectionStart <= protectedLength) {
    event.preventDefault();
  }
});

function renderGuestMenus() {
  const count = Number(guestsEl.value) || 1;
  const previous = [...guestMenusEl.querySelectorAll("select")].map(select => select.value);

  guestMenusEl.innerHTML = "";

  for (let index = 0; index < count; index++) {
    const wrapper = document.createElement("div");
    wrapper.className = "guest-menu-row";

    const label = document.createElement("label");
    label.textContent = `Menú de la persona ${index + 1}`;

    const select = document.createElement("select");
    select.className = "guest-menu-select";
    select.required = true;
    select.dataset.person = String(index + 1);
    select.setAttribute("aria-label", `Menú de la persona ${index + 1}`);

    MENU_OPTIONS.forEach((option) => {
      const item = document.createElement("option");
      item.value = option.name;
      item.textContent = option.name;
      item.dataset.description = option.description;
      select.appendChild(item);
    });

    if (previous[index]) select.value = previous[index];
    label.appendChild(select);
    wrapper.appendChild(label);

    const description = document.createElement("p");
    description.className = "selected-menu-description";
    wrapper.appendChild(description);

    const updateDescription = () => {
      const option = MENU_OPTIONS.find(item => item.name === select.value);
      description.textContent = option ? option.description : "";
    };

    select.addEventListener("change", updateDescription);
    updateDescription();
    guestMenusEl.appendChild(wrapper);
  }
}

guestsEl.addEventListener("change", renderGuestMenus);
renderGuestMenus();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Guardando confirmación...";

  const phone = formatPhone(phoneEl.value);
  phoneEl.value = phone;

  if (!/^\+504 \d{4}-\d{4}$/.test(phone)) {
    statusEl.textContent = "Ingresa los 8 dígitos de tu número de teléfono.";
    phoneEl.focus();
    return;
  }

  const menuSelections = [...guestMenusEl.querySelectorAll(".guest-menu-select")].map((select, index) => ({
    person: index + 1,
    menu: select.value
  }));

  const menuText = menuSelections.map(item => `Persona ${item.person}: ${item.menu}`).join(" | ");

  const payload = {
    name: document.getElementById("name").value.trim(),
    phone,
    guests: menuSelections.length,
    menu: menuText,
    notes: document.getElementById("notes").value.trim() || "",
    confirmed: document.getElementById("confirmed").checked ? "true" : "false"
  };

  try {
    if (!config.GOOGLE_SHEETS_URL) {
      throw new Error("No está configurada la URL de Google Sheets.");
    }

    const body = new URLSearchParams(payload).toString();
    await fetch(config.GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body
    });

    const menuSummary = menuSelections
      .map(item => `Persona ${item.person}: ${item.menu}`)
      .join(" · ");

    successText.textContent =
      `Gracias, ${payload.name}. Registramos tu asistencia para ${payload.guests} ${
        payload.guests === 1 ? "persona" : "personas"
      }. ${menuSummary}`;

    rsvpCard.classList.add("hidden");
    successCard.classList.remove("hidden");
    successCard.scrollIntoView({ behavior: "smooth", block: "center" });
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
  rsvpCard.scrollIntoView({ behavior: "smooth" });
});
