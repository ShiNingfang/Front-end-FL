import { CONNECTORSEPARATESYMBOL } from './const'
import model from './model'
import io from 'socket.io-client'

export default function flowExec({ instance }) {
  /**
   * @description 模拟延时效果
   * @param {function} fn
   * @param {number} time
   * @returns
   */
  function timeout(fn, time) {
    return new Promise((res) => {
      setTimeout(() => {
        fn()
        res(true)
      }, time)
    })
  }

  function changeStateByNodeId(nodeId, state) {
    const nodeEl = document.getElementById(nodeId)
    nodeEl.vNode.$children[0].state = state
  }

  function getConnectorByUuids(uuids) {
    const edge = uuids.join(CONNECTORSEPARATESYMBOL)
    const connectors = instance.getAllConnections()
    const connector = connectors.find(c => c.getUuids().join(CONNECTORSEPARATESYMBOL) === edge)
    return connector
  }

  function blingConnectors(edges) {
    const connectors = instance.getAllConnections()
    connectors.forEach((c) => {
      c.canvas.classList.remove('active')
    })

    edges.forEach((edge) => {
      const c = getConnectorByUuids(edge.split(CONNECTORSEPARATESYMBOL))
      c.canvas.classList.add('active')
    })
  }

  this.execModel = () => {
    changeStateByNodeId('a', 'loading')
    return timeout(() => {
      changeStateByNodeId('aaa', 'success')
      changeStateByNodeId('bbb', 'loading')
      blingConnectors(['source1&&target1', 'source2&&target2'])
    }, 3000)
      .then(() => timeout(() => {
        changeStateByNodeId('bbb', 'success')
        changeStateByNodeId('ccc', 'loading')
        blingConnectors(['source3&&ccc111', 'source3&&ccc222'])
      }, 4000))
      .then(() => timeout(() => {
        changeStateByNodeId('ccc', 'success')
        changeStateByNodeId('ddd', 'failed')
        blingConnectors([])
      }, 5000))
  }

  this.runModel = async() => {
    async function processNode(nodeId, node) {
      changeStateByNodeId(nodeId, 'loading')
      // await new Promise(resolve => setTimeout(resolve, node.data.type === '数据源' ? 3000 : 4000)) // 为不同类型的节点设置不同的处理时间
      await timeout(() => {
        console.log(node.data.params)
      }, 3000)

      // socket
      // 假设您的WebSocket服务端点为ws://localhost:3000
      const socketUrl = 'ws://localhost:3000'
      const socket = new WebSocket(socketUrl)

      // 打开WebSocket连接后执行的操作
      socket.onopen = function(event) {
        console.log('WebSocket connection established')
        // 一旦连接打开，您可以发送一个消息到服务器，例如启动一个特定的日志流
        // socket.send('start_logs');
      }

      // 接收到消息时执行的操作
      socket.onmessage = function(event) {
        console.log('Message from server:', event.data)
        // 在这里，您可以处理从服务器接收到的日志消息
        // 例如，更新前端的日志显示
        // updateLogs(event.data);
      }

      // 处理连接关闭
      socket.onclose = function(event) {
        console.log('WebSocket connection closed:', event)
        // 在这里，您可以处理连接关闭后的清理工作
      }

      // 处理可能发生的错误
      socket.onerror = function(error) {
        console.error('WebSocket error:', error)
        // 在这里，您可以处理连接过程中可能发生的任何错误
      }

      changeStateByNodeId(nodeId, 'success')
      // console.log('Node processing complete:', nodeId)
    }

    async function breadthFirstTraversal(rootId, nodes, edges, visited = new Set()) {
      const result = []
      const queue = [rootId]

      while (queue.length > 0) {
        const nodeId = queue.shift()
        const node = nodes.find(node => node.id === nodeId)
        if (!node || visited.has(nodeId)) {
          continue
        }

        await processNode(nodeId, node) // 等待节点处理完成
        visited.add(nodeId)
        result.push(node.id)

        node.points.sources.forEach(source => {
          const connectedEdges = edges.filter(edge => edge.startsWith(`${source}&&`))
          connectedEdges.forEach(edge => {
            const target = edge.split('&&')[1]
            const targetNode = nodes.find(node => node.points.targets.includes(target))
            if (targetNode && !visited.has(targetNode.id)) {
              queue.push(targetNode.id)
            }
          })
        })
      }

      return result
    }

    const rootNodeId = model.getHead()
    const nodesData = model.getData().nodes
    const edges = model.getData().edges
    await breadthFirstTraversal(rootNodeId, nodesData, edges)
  }
}
