import { CONNECTORSEPARATESYMBOL } from './const'
import FlowChart from './index'
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
    model.setStatus(nodeId, state)
    // console.log('Ok' + nodeId)
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
    function handleNode(socket, node, params) {
      // 返回一个Promise
      return new Promise((resolve, reject) => {
        // 发送攻击命令
        socket.emit('attack', { params: params })
        console.log('params', params)

        // 监听一次 'attack_result' 事件
        socket.once('attack_result', (data) => {
          // console.log('attack_result:' + data)
          // 输出一下data
          model.setResult(node.id, data)
          resolve(data) // 解决Promise
        })

        // 监听错误
        socket.once('error', (error) => {
          // console.error('WebSocket error during training:', error)
          reject(error) // 拒绝Promise
        })
      })
    }

    function setSocket(socket) {
      // Socket.IO 自动处理连接，所以不需要特别监听open事件

      // 监听服务器发送的消息

      // 监听 'train_output' 事件
      socket.on('attack_output', (data) => {
        // data 是从服务器发送的包含消息的对象
        // console.log('训练输出 : ', data.output)
        store.dispatch('attack_logger/addLog', data.output)
      })

      // Socket.IO 也自动处理连接关闭和错误
      // 但您可以监听 'disconnect' 或 'error' 事件以进行特定操作
      socket.on('disconnect', function(reason) {
        // console.log('WebSocket connection closed:', reason)
        // 在这里，您可以处理连接关闭后的清理工作
      })

      socket.on('error', function(error) {
        console.error('WebSocket error:', error)
        // 在这里，您可以处理连接过程中可能发生的任何错误
      })
    }
    async function processNode(nodeId, node, store, socket, params, context) {
      changeStateByNodeId(nodeId, 'loading')
      // console.log('hh' + nodeId)

      const algorithmList = ['标准模式', '差分隐私', '负数据库', '优化GAN', '共享权重', '同态加密']
      const AttackList = ['梯度泄露', '成员推理', '模型逆向']
      let isAttack = false
      if (node.data.type === '数据源') {
        await timeout(() => {
        }, 1000)
        // console.log('数据源success')
        changeStateByNodeId(nodeId, 'success')
      } else if (algorithmList.includes(node.data.type)) {
        params.choice = node.data.params.choice
        context.encryptId = nodeId
      } else if (AttackList.includes(node.data.type)) {
        isAttack = true
        params.attack_type = node.data.params.attack_type
        // console.log('handle1')
        await handleNode(socket, node, params)
        // console.log('handle2')
        changeStateByNodeId(context.encryptId, 'success')
        changeStateByNodeId(nodeId, 'success')
      }
      if (isAttack) {
        FlowChart.emit('modelCompleted', node)
        isAttack = false
      }
    }

    async function breadthFirstTraversal(rootId, nodes, edges, store, socket, params, context, visited = new Set()) {
      const result = []
      const queue = [rootId]

      while (queue.length > 0) {
        const nodeId = queue.shift()
        const node = nodes.find(node => node.id === nodeId)
        if (!node || visited.has(nodeId)) {
          continue
        }

        await processNode(nodeId, node, store, socket, params, context) // 等待节点处理完成

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

    const socket = io('http://localhost:5000')
    setSocket(socket)
    // console.log(store)
    const params = {}
    const context = { encryptId: '' }
    await breadthFirstTraversal(rootNodeId, nodesData, edges, store, socket, params, context)
  }
}
