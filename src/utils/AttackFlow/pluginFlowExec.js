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

  this.runModel = async(store) => {
    function handleNode(socket, params) {
      socket.emit('attack', { params: params })
    }
    function setSocket(socket) {
      // Socket.IO 自动处理连接，所以不需要特别监听open事件

      // 监听服务器发送的消息

      // 监听 'train_output' 事件
      socket.on('attack_output', (data) => {
        // data 是从服务器发送的包含消息的对象
        console.log('Received train_output:', data.output)
        store.dispatch('attack_logger/addLog', data.output)
        console.log('attack_store:' + store.getters.attack_logs)
      })

      // Socket.IO 也自动处理连接关闭和错误
      // 但您可以监听 'disconnect' 或 'error' 事件以进行特定操作
      socket.on('disconnect', function(reason) {
        console.log('WebSocket connection closed:', reason)
        // 在这里，您可以处理连接关闭后的清理工作
      })

      socket.on('error', function(error) {
        console.error('WebSocket error:', error)
        // 在这里，您可以处理连接过程中可能发生的任何错误
      })
    }
    async function processNode(nodeId, node, store) {
      changeStateByNodeId(nodeId, 'loading')
      // await new Promise(resolve => setTimeout(resolve, node.data.type === '数据源' ? 3000 : 4000)) // 为不同类型的节点设置不同的处理时间
      await timeout(() => {
        // console.log(node.data.params)
      }, 1000)

      changeStateByNodeId(nodeId, 'success')
    }

    async function breadthFirstTraversal(rootId, nodes, edges, store, socket, visited = new Set()) {
      const result = []
      const queue = [rootId]

      while (queue.length > 0) {
        const nodeId = queue.shift()
        const node = nodes.find(node => node.id === nodeId)
        if (!node || visited.has(nodeId)) {
          continue
        }

        const algorithmList = ['标准模式', '差分隐私', '负数据库', '优化GAN', '共享权重', '同态加密']
        if (node.data.type === '数据源') {
          // console.log("")
        } else if (algorithmList.includes(node.data.type)) {
          handleNode(socket, node.data.params)
        } else if (node.data.type === '模型对比') {
          // hh
        }

        await processNode(nodeId, node, store) // 等待节点处理完成
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

    const socket = io('http://localhost:8080')
    setSocket(socket)
    // console.log(store)
    await breadthFirstTraversal(rootNodeId, nodesData, edges, store, socket)
  }
}
