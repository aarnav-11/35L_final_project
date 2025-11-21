
require('dotenv').config()
const express = require('express');
const path = require("path");
const cors = require('cors');
const db = require('./database');
const notesRoutes = require('./routes/notes');
const authRoutes = require("./routes/auth");
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.sendFile(filePath, {
      headers: {
        'Content-Disposition': 'inline'
      }
    }, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  });  
app.use('/notes', notesRoutes);
app.use("/auth", authRoutes);

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});