const config = window.APP_CONFIG || {};
const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("formStatus");
const rsvpCard = document.querySelector(".rsvp-card");
const successCard = document.getElementById("success");
const successText = document.getElementById("successText");
const editBtn = document.getElementById("editBtn");

let supabaseClient = null;
if (config.SUPABASE_URL && config.SUPABASE_PUBLISHABLE_KEY && window.supabase) {
  supabaseClient = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_PUBLISHABLE_KEY
  );
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Guardando confirmación...";

  const payload = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim() || null,
    guests: Number(document.getElementById("guests").value),
    menu: document.querySelector('input[name="menu"]:checked')?.value,
    notes: document.getElementById("notes").value.trim() || null,
    confirmed: document.getElementById("confirmed").checked
  };

  try {
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from("graduation_rsvps")
        .insert(payload);
      if (error) throw error;
    } else {
      const demo = JSON.parse(localStorage.getItem("graduation_rsvps_demo") || "[]");
      demo.push({...payload, created_at: new Date().toISOString()});
      localStorage.setItem("graduation_rsvps_demo", JSON.stringify(demo));
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
      "No pudimos guardar la confirmación. Revisa la configuración de Supabase o inténtalo nuevamente.";
  }
});

editBtn.addEventListener("click", () => {
  successCard.classList.add("hidden");
  rsvpCard.classList.remove("hidden");
  rsvpCard.scrollIntoView({behavior:"smooth"});
});
