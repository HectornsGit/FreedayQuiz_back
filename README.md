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

Campos necesarios: title, description

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

patch /update-quiz/:id para editar un quiz, sus preguntas y respuestas.
