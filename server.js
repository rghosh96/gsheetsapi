const express = require('express');
// const { google } = require('googleapis');
const cors = require('cors');
const app = express(); 

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

const SPREADSHEET_ID = "1Y7GvB1-UjpP5xUStzB4BDk2cAonVqutn0A9iSZfMA70";
const SHEET_ID = process.env.GOOGLE_SHEETS_SUBSCRIBERS_PAGE;
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY;


/**
 * Updates values in a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The range of values to update.
 * @param {object} valueInputOption Value update options.
 * @param {(string[])[]} _values A 2d array of values to update.
 * @return {obj} spreadsheet information
 */
async function updateValues(spreadsheetId, range, valueInputOption, values) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({version: 'v4', auth});
  let info = [
    ["rashi", "noooo"],      // Sample data row
    ["gabe", "yeeees"],      // Another sample data row
    // Add more rows as needed
  ];
  // console.log(info)
  // console.log(values)
  const resource = {
    values,
  };
  try {
    const result = await service.spreadsheets.values.append({
      spreadsheetId,
      range, // Adjusted range to start from A2
      valueInputOption,
      resource,
    });
    console.log('%d cells updated.', result.data.updatedCells);
    return result;
  } catch (err) {
    // TODO (Developer) - Handle exception
    throw err;
  }
}


const port = 3001; 

app.post("/api/data", async (req, res) => {
  const data = req.body.data;

  // Now you can use the 'data' variable, which is a 2D array
  console.log("Received data:", data);

  updateValues(SPREADSHEET_ID, "Sheet1!A2:B", "RAW", data)
});


app.get('/', (req, res) => { 
  // Handle your API logic here 
  res.json({ message: 'Hello from Express!' });
}); 

app.listen(port, () => { 
  console.log(`Server is running on port ${port}`); 
});
