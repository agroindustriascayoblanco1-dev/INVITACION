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
