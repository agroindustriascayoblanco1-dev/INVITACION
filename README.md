# Invitación Digital de Graduación

Proyecto para GitHub Pages con Google Sheets como único almacenamiento de confirmaciones.

## Backend

Las confirmaciones se guardan mediante un Google Apps Script Web App en la hoja **Confirmaciones Graduación**.

- `index.html` — invitación
- `styles.css` — diseño
- `app.js` — formulario RSVP
- `admin.html` — panel de confirmaciones
- `config.js` — URL pública del Web App
- `google-apps-script.gs` — backend para Google Sheets

## Google Sheet

Columnas esperadas:

`Nombre | Teléfono | Personas | Menú | Observaciones | Confirmado | Fecha`

## Despliegue del Web App

El Apps Script debe estar desplegado como aplicación web con:

- Ejecutar como: **Yo**
- Quién tiene acceso: **Cualquiera**

Después de modificar `google-apps-script.gs`, hay que crear una nueva versión del despliegue para que los cambios lleguen a la URL `/exec`.

## Nota

El panel `admin.html` lee los datos mediante JSONP para evitar depender de Supabase y poder funcionar desde GitHub Pages. La hoja de Google Sheets sigue siendo la fuente principal de datos.
