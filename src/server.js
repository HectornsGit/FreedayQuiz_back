//Módulos:
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { join } from 'path';
import { userRoutes, quizRoutes } from './routes/index.js';
import { notFoundRoute, manageErrors } from './middlewares/index.js';

//Express:
const app = express();

//Middlewares de aplicación:
app.use(express.json());
app.use(cors());

// Middleware para servir archivos estáticos desde la carpeta "uploads":
const __dirname = process.cwd();
const ruta = join(__dirname, 'src', 'uploads');
app.use('/uploads', express.static(ruta));

// Rutas de usuario
app.use(userRoutes);

//Ruta para quizzes:
app.use(quizRoutes);

//Middlewares finales:
app.use(notFoundRoute);
app.use(manageErrors);

//Server:
app.listen(process.env.PORT, () => {
  console.log(`Servidor activo en el puerto ${process.env.PORT}`);
});
