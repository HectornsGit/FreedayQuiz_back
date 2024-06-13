export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Aquí puedes agregar tus manejadores de eventos de socket
    socket.on('joinQuiz', (quizId) => {
      console.log(`User joined quiz: ${quizId}`);
      // Lógica para manejar unirse a un quiz
    });

    socket.on('submitAnswer', (data) => {
      console.log(`Answer submitted: ${data}`);
      // Lógica para manejar la respuesta del usuario
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
