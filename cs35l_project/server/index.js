require('dotenv').config()
const express = require('express');
const path = require("path");
const cors = require('cors');
const db = require('./database');
const notesRoutes = require('./routes/notes');
const authRoutes = require("./routes/auth");
const spacesRoutes = require("./routes/spaces");
const tagsRouter = require('./routes/tags');
const app = express();
const cookieParser = require("cookie-parser");

//Middleware
//enabling cookies and credentials
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());
app.use(express.json());


//Routes
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath, { headers: { 'Content-Disposition': 'inline' } }, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});  
app.use('/api/notes', notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/spaces", spacesRoutes);
app.use('/api/tags', tagsRouter);

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});