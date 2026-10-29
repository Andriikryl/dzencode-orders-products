import { createServer } from 'node:http'
import { Server } from 'socket.io'

const PORT = Number(process.env.PORT || process.env.SOCKET_PORT || 3001)
const ORIGIN = process.env.SOCKET_CORS_ORIGIN || '*'

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', sessions: io.engine.clientsCount }))
    return
  }
  res.writeHead(404)
  res.end()
})

const io = new Server(httpServer, {
  cors: { origin: ORIGIN },
})

function broadcast() {
  io.emit('sessions', io.engine.clientsCount)
}

io.on('connection', (socket) => {
  broadcast()
  socket.on('disconnect', broadcast)
})

httpServer.listen(PORT, () => {
  console.log(`[socket] listening on :${PORT}`)
})
