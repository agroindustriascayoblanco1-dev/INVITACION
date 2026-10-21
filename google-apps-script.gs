const SHEET_NAME = "Confirmaciones Graduación";
const SPREADSHEET_ID = "1lGZ_Y4KkSKNaFY7m9BF8OvOLpqoSy7vuzvG1hhU3LM0";

function doPost(e) {
  try {
    const data = e && e.parameter ? e.parameter : {};
    const sheet = getSheet_();

    sheet.appendRow([
      data.name || "",
      data.phone || "",
      Number(data.guests || 0),
      data.menu || "",
      data.notes || "",
      data.confirmed === "true" ? "Sí" : "No",
      new Date()
    ]);

    return json_({ ok: true, success: true, message: "Confirmación guardada" });
  } catch (error) {
    return json_({ ok: false, success: false, message: String(error) });
  }
}

// Lectura para el panel de administración mediante JSONP.
function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || "ping";

    if (action === "ping") {
      return jsonp_(params.callback, { ok: true, service: "Google Sheets" });
    }

    if (action === "list") {
      const sheet = getSheet_();
      const values = sheet.getDataRange().getValues();
      const rows = values.length > 1 ? values.slice(1) : [];

      const records = rows.map(row => ({
        name: row[0] || "",
        phone: row[1] || "",
        guests: Number(row[2] || 0),
        menu: row[3] || "",
        notes: row[4] || "",
        confirmed: row[5] || "",
        created_at: row[6] instanceof Date ? row[6].toISOString() : String(row[6] || "")
      })).reverse();

      return jsonp_(params.callback, {
        ok: true,
        success: true,
        records: records
      });
    }

    return jsonp_(params.callback, { ok: false, success: false, message: "Acción no válida" });
  } catch (error) {
    return jsonp_(e && e.parameter ? e.parameter.callback : "", {
      ok: false,
      success: false,
      message: String(error)
    });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Nombre",
      "Teléfono",
      "Personas",
      "Menú",
      "Observaciones",
      "Confirmado",
      "Fecha"
    ]);
  }

  return sheet;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(callback, data) {
  const safeCallback = /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback || "")
    ? callback
    : "handleGoogleSheetsResponse";

  return ContentService
    .createTextOutput(safeCallback + "(" + JSON.stringify(data) + ")")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
