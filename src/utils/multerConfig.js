import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './src/uploads/'); // Directorio donde se guardarán las fotos de perfil
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//Validar que sea un archivo de imagen:
const fileFilter = (_req, file, callback) => {
  // Verificar el tipo de archivo permitido
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true); // Aceptar el archivo
  } else {
    callback(new Error('Tipo de archivo no permitido'), false); // Rechazar el archivo
  }
};
//Validar el tamaño de imagen:
const limits = {
  fileSize: 3 * 1024 * 1024, // Maximo archivos de 3 megabytes.
};

export { storage, limits, fileFilter };
