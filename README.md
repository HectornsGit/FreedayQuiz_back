# FreedayQuiz_back

API desarrollada con NodeJs, Express, Joi, MySQL, Multer, Socket.io, Redis y otras dependencias.
Creación, edición y ejecución de quizzes con sistema de qr y código para acceso de los jugadores, que no necesitarán registro.

# # Un usuario puede:

1.Registrarse.
2.Editar o borrar sus datos.
3.Crear, editar o borrar sus quizzes.
4.Crear, editar o borrar preguntas y editar respuestas.
5.Invitar a usuarios compartiendo un código de acceso o código QR.
6.Ejecutar quizzes.

# # Antes o durante el tiempo de ejecución del quiz:

El master podrá, en tiempo real:
1.Seleccionar la pregunta a iniciar, en el órden que quiera.
2.Repetir preguntas, si así lo desea.
3.Editar los datos del quiz, que serán actualizados para todos los jugadores.
4.Editar los datos de cualquier pregunta y sus respuestas, incluyendo el tiempo máximo, que serán actualizados inmediatamente para todos los jugadores.
5.Borrar preguntas.
6.Mostrar a los jugadores todas las puntuaciones hasta el momento, o puntuaciones finales.

# # Scripts:

node --run dev para iniciar el proyecto en modo desarrollo.

node --run initDb para crear base de datos y tablas.

node --run dropDb para borrar la base de datos y las tablas

# # Endpoints:

post /register para registrar un usuario.
Campos necesarios: name, email, password

post /login para acceder al sistema.
Campos necesarios: email, password

post /create-quiz para crear un quiz
Campos necesarios: title, description. En la respuesta del back se envía el código QR para unirse a la partida.

post /create-questions para crear preguntas y añadirlas a un quiz
Campos necesarios:  
 quiz_id,
question,
question_time,
optionA,
optionB,
optionC,
correctAnswer,
question_number,

get /user-info para obtener información del usuario registrado y sus quizzes con sus respuestas.

patch /edit-user para editar datos del usuario (no quizzes)
Todos los campos son opcionales:
name,
email,
password,
avatar

get /get-quiz/${id} para obtener un quiz por su id y ownerId.
(Habrá que enviar el token del usuario logueado en la cabecera y el id del quiz en los parámetros de la ruta, tal y como se describe)

patch /update-quiz/:id para editar un quiz, seleccionándolo por su id.
Todos los campos son opcionales.
title,
description,

patch /update-question/:quiz_id/:question_number para editar una pregunta de un quiz:
Todos los campos son opcionales.
question,
question_time,
optionA,
optionB,
optionC,
correctAnswer,
image

get /join-quiz/:access_code para obtener el id del quiz a través del código de acceso.

delete /delete-quiz/:id para borrar un quiz y todas sus preguntas.

delete /delete-question para borrar preguntas, tanto de una en una como varias a la vez. La estructura necesaria del json que se enviará en el body es la siguiente:
Ejemplo:
{"quizId": "1",
"questionIds": [28, 34, 36]
}
Tras la eliminación, los números de pregunta (question_number) se reorganizarán automáticamente para que sigan siendo consecutivos y empiezen desde el número 1

# # Conexión y desconexión:

# # # Systema de conexiones/desconexiones del cliente al servidor (sin acción por parte del cliente, sino por caída de su red de internet):

Si un cliente se desconecta, el sistema tratará de reconectarse automáticamente.
Si se conecta antes de los dos minutos, todos sus datos se sincronizarán con los actuales del quiz, incluyendo el timer de las preguntas, y se le redirigirá a la pantalla activa.
Si un cliente llega tarde y el quiz ya ha comenzado, tras poner su nombre de usuario se sincronizarán todos los datos y se le redirigirá a la pantalla activa.

# # # Systema de conexiones/desconexiones del cliente al salir de la página o refrescarla con F5:

Master:
La pregunta en curso seguirá ejecutándose para el resto de jugadores, y se seguirán guardando los datos de las puntuaciones en el servidor.
Al volver, el master recuperará automáticamente todos los datos actualizados y el estado en que quedó el quiz y podrá activar la siguiente pregunta o mostrar las puntuaciones.
Jugador:
Al volver, se le dará la opción de recuperar su sesión o crear un nuevo jugador.
En caso de que se quiera recuperar, se le sincronizarán de nuevo todos sus datos, de jugador y quiz, y estado actual del quiz, para que pueda seguir jugando con su nombre de usuario e id inicales en la pregunta activa en ese momento.

# # Control de sesiones:

Al iniciar, el master establecerá el tiempo máximo de duración de la sesión, asegurándose de que, pasado ese tiempo, todos los datos sean salvados en la base de datos relacional y posteriormente borrados del servidor Redis, dejando así de ser accesibles. Los usuarios serán redirigidos a la pantalla de inicio.
Eso previene que, por motivos de conexión a internet o cierre accidental de las pestañas, el master no pueda cerrar la sesión manualmente.
