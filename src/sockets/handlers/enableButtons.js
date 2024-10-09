const enableButtons = (socket, io) => {
    socket.on('reactivateButtons', () => {
        io.emit('activateButtons')
    })
}
export default enableButtons
