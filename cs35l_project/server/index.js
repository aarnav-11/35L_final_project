
const express = require('express');
const cors = require('cors');
const db = require('./database');
const notesRoutes = require('./routes/notes');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/', notesRoutes);

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});