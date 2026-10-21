# Invitación Digital de Graduación

Proyecto inicial listo para GitHub Pages + Supabase.

## 1. Probar sin Supabase
Abre `index.html`. El formulario funciona en modo demo y guarda las respuestas en el navegador usando `localStorage`.

## 2. Conectar Supabase
1. Crea/usa un proyecto de Supabase.
2. Abre SQL Editor.
3. Ejecuta `supabase.sql`.
4. Copia la URL del proyecto y la Publishable Key.
5. Pégalas en `config.js`.

Ejemplo:

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://TU-PROYECTO.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_..."
};
```

Nunca pongas una secret key o service_role key en estos archivos públicos.

## 3. Panel
Abre `admin.html` y entra con un usuario creado en Supabase Auth.

## 4. Personalización
En `index.html` puedes cambiar:
- nombre del graduado
- fecha
- hora
- lugar
- código de vestimenta
- opciones de menú

## Estructura

- `index.html` — invitación
- `styles.css` — diseño
- `app.js` — RSVP
- `admin.html` — panel administrativo
- `config.js` — configuración pública de Supabase
- `supabase.sql` — tabla + RLS
