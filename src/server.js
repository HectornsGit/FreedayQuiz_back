//Módulos:
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import quizSockets from '../sockets/quizSockets.js';
import { join } from 'path';
import { userRoutes, quizRoutes } from './routes/index.js';
import { notFoundRoute, manageErrors } from './middlewares/index.js';

//Express:
const app = express();

//Configuración de Socket.io:
const server = createServer(app);
const io = new Server(server, {
  //Asegurarse que cumplen con las especificaciones de seguridad cors:
  cors: {
    origin: process.env.FRONT_URL,
    methods: ['GET', 'POST'],
  },
});
quizSockets(io);

//Middlewares de aplicación:
app.use(express.json());
const corsOptions = {
  origin: process.env.FRONT_URL,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

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
server.listen(process.env.PORT, () => {
  console.log(`Servidor activo en el puerto ${process.env.PORT}`);
});
