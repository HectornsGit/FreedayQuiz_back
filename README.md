# FreedayQuiz_back

API to make quiz games online developed in NodeJS

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
\*question_number no se podrá cambiar.
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
