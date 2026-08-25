function doPost(e) {
  try {
    // Parse the JSON data from the request body
    const data = JSON.parse(e.postData.contents);
    
    // Open the active spreadsheet and the first sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If the sheet is empty, add headers first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Date", "Name", "Mobile", "Email", "Subject", "Message"]);
      // Make headers bold
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
    }
    
    // Append the new lead data
    sheet.appendRow([
      data.date || new Date().toISOString(),
      data.name || "",
      data.mobile || "",
      data.email || "",
      data.subject || "",
      data.message || ""
    ]);
    
    // Return success response to Cloudflare
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
