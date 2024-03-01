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
    console.log(`Attack 命令: ${data} `)
    // 模拟发送日志输出
    let counter = 0
    const attackInterval = setInterval(() => {
      socket.emit('attack_output', { output: `Attack log message ${++counter}` })
      if (counter >= 3) clearInterval(attackInterval) // 停止发送消息
    }, 1000)
    // 模拟攻击过程和结果
    setTimeout(() => {
      const result = {
        pic: [
          'C:\\Users\\33053\\Downloads\\result1.png',
          'C:\\Users\\33053\\Downloads\\result2.png',
          'C:\\Users\\33053\\Downloads\\result3.png',
          'C:\\Users\\33053\\Downloads\\result4.png',
          'C:\\Users\\33053\\Downloads\\result5.png',
          'C:\\Users\\33053\\Downloads\\result6.png',
          'C:\\Users\\33053\\Downloads\\result7.png',
          'C:\\Users\\33053\\Downloads\\result8.png',
          'C:\\Users\\33053\\Downloads\\result9.png',
          'C:\\Users\\33053\\Downloads\\result10.png'
        ],
        metrics: {
          0: {
            'precision': 0.62,
            'recall': 0.74,
            'f1-score': 0.68,
            'support': 10000
          },
          1: {
            'precision': 0.68,
            'recall': 0.55,
            'f1-score': 0.61,
            'support': 10000
          }
        }
      }
      socket.emit('attack_result', result)
    }, 3000) // 假设训练需要3秒钟
  })

  socket.on('train', (data) => {
    console.log(`Train command received: ${data.choice}`)
    // 模拟发送日志输出
    let counter = 0
    const trainInterval = setInterval(() => {
      socket.emit('train_output', { output: `Train log message ${++counter}` })
      if (counter >= 3) clearInterval(trainInterval) // 停止发送消息
    }, 1000)

    // 模拟训练过程和结果
    setTimeout(() => {
      // 定义随机长度，例如，从5到20之间
      const length = Math.floor(Math.random() * (20 - 5 + 1) + 5)

      // 初始化准确率和损失值数组
      const acc = []
      const loss = []

      // 填充数组
      for (let i = 0; i < length; i++) {
        acc.push((Math.random()).toFixed(2)) // 随机准确率，保留两位小数
        loss.push((Math.random()).toFixed(2)) // 随机损失值，保留两位小数
      }

      // 假装这是训练过程产生的结果
      const mockResult = {
        acc, // 准确率数组
        loss // 损失值数组
      }

      // 向客户端发送train_result事件和模拟的结果数据
      socket.emit('train_result', mockResult)
    }, 3000) // 假设训练需要3秒钟
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

const PORT = 5000 // 可以根据需要更改端口
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

