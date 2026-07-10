if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

//RUTAS
const usuariosRoutes = require('./src/routes/usuarioRoutes');

//SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 5100;

app.use(cors());
app.use(express.json()); // Communication

// DB connection
connectDB();

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";
const JS_URLS = [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-standalone-preset.min.js"
];

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCssUrl: CSS_URL,
    customJs: JS_URLS
}));

//Rutas base de RUGP
app.use("/api/usuarios", usuariosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor de API-RUGP corriendo en: http://localhost:${PORT}`);
    console.log(`Revisa la documentación en: http://localhost:${PORT}/api-docs`);
});

module.exports = app;