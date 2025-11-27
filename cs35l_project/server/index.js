
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const db = require('./database');
const notesRoutes = require('./routes/notes');
const authRoutes = require("./routes/auth");
const spacesRoutes = require("./routes/spaces");
const app = express();
const cookieParser = require("cookie-parser");

//Middleware
//enabling cookies and credentials
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());
app.use(express.json());


//Routes
app.use('/api/notes', notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/spaces", spacesRoutes);

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});