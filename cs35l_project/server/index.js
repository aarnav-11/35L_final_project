
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const db = require('./database');
const notesRoutes = require('./routes/notes');
const authRoutes = require("./routes/auth");
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/notes', notesRoutes);
app.use("/api/auth", authRoutes);

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});