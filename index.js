require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { addToSheet } = require('./googleSheets');
const path = require('path');

const app = express();

app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));
app.use('/', express.static(path.join(__dirname)));
app.use(bodyParser.json());

app.post('/add', async (req, res) => {
  try {
    const { sheet_id, part_name, quantity, image_url } = req.body;
    if (!sheet_id || !part_name || !quantity) {
      return res.status(400).send('sheet_id, part_name, and quantity are required');
    }
    await addToSheet(sheet_id, part_name, quantity, image_url);
    res.status(200).send('Added to inventory');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding to sheet');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
