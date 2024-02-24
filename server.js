const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
  console.log('Client connected')
  let counter = 0

  const sendLog = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`Log message ${++counter}`) // 发送日志消息
    }
  }

  const logInterval = setInterval(sendLog, 1000) // 每秒发送一条日志消息

  ws.on('close', function close() {
    clearInterval(logInterval) // 关闭连接时停止发送
    console.log('Client disconnected')
  })
})

console.log('WebSocket server is running on ws://localhost:8080')
