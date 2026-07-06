require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 5100;

app.use(express.json()); // Communication

// DB connection
connectDB();

app.listen(PORT, () => {
    console.log(`Servidor de API-RUGP corriendo en: http://localhost:${PORT}`);
});