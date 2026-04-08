const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./FundTransfer.db');

app.use(express.static('public')); // serve HTML/CSS/JS from public folder

// Example API route to get data
app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM FundTransferLIst', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
