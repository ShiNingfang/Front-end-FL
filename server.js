// const http = require('http')
// const socketIo = require('socket.io')

// // 创建一个HTTP服务器
// const server = http.createServer((req, res) => {
//   console.log('Received HTTP request')
//   res.end('Server is running')
// })

// // 设置socket.io与HTTP服务器的集成
// const io = socketIo(server, {
//   cors: {
//     origin: '*', // 允许所有来源，你应该根据你的需求来限制
//     methods: ['GET', 'POST']
//   }
// })

// // 当有新的客户端连接时
// io.on('connection', (socket) => {
//   console.log('Client connected, socket id:', socket.id)

//   socket.on('train', (data) => {
//     console.log(`Received train event from ${socket.id}:`, data)

//     // 模拟日志操作：每秒向客户端发送一条消息
//     const logInterval = setInterval(() => {
//       const logMessage = `Log message at ${new Date().toLocaleTimeString()}`
//       // 向该socket客户端发送'train_output'事件
//       const response = `Processed data with parameters: ${JSON.stringify(data.params)}`
//       socket.emit('train_output', { output: response })
//       socket.emit('train_output', { message: logMessage }) // 发送模拟的日志消息
//       console.log(`Sent log to ${socket.id}:`, logMessage)
//     }, 1000) // 设置每秒发送一次

//     // 监听断开连接事件，以停止发送日志消息
//     socket.on('disconnect', () => {
//       clearInterval(logInterval) // 停止定时发送日志
//       console.log('Client disconnected, socket id:', socket.id)
//     })
//   })

//   // 监听断开连接事件
//   socket.on('disconnect', () => {
//     console.log('Client disconnected, socket id:', socket.id)
//   })
// })

// // 监听8080端口
// const PORT = 8080
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`)
// })

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', // 允许所有来源
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('attack', (data) => {
    console.log(`Attack command received: ${data.attack_type}, ${data.choice}`)
    // 模拟发送日志输出
    let counter = 0
    const attackInterval = setInterval(() => {
      socket.emit('attack_output', { output: `Attack log message ${++counter}` })
      if (counter >= 10) clearInterval(attackInterval) // 停止发送消息
    }, 1000)
  })

  socket.on('train', (data) => {
    console.log(`Train command received: ${data.choice}`)
    // 模拟发送日志输出
    let counter = 0
    const trainInterval = setInterval(() => {
      socket.emit('train_output', { output: `Train log message ${++counter}` })
      if (counter >= 10) clearInterval(trainInterval) // 停止发送消息
    }, 1000)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

const PORT = 8080 // 可以根据需要更改端口
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

