/* eslint-disable import/no-cycle */
import Tooltip from 'tooltip.js'
import Vue from 'vue'
import Node from './Node.vue'
import contextMenu from './contextMenu'
import instance from './instance'
import model from './model'
import FlowChart from './index'
import { EventCenter } from './EventCenter'
import { sourceEndpoint, targetEndpoint } from './style'
import { isEndpoint, createUuid } from './Utils'
import { CONNECTORSEPARATESYMBOL } from './const'
import exec, { AddConnectorCommand, MoveNodeCommand } from './Command'

let container = null
const algorithmList = ['标准模式', '差分隐私', '负数据库', '优化GAN', '共享权重', '同态加密']
const AttackList = ['梯度泄露', '成员推理', '模型逆向']

// const rootNodeId = model.getHead()
// const nodesData = model.getData().nodes // 获取节点数组
// const edges = model.getData().edges

/**
 * @description 触发命令列表为空事件
 */
function emitCommandListEmpty() {
  FlowChart.emit('commandListEmpty')
}

/**
 * @description 触发增加命令事件
 */
function emitAddCommand() {
  FlowChart.emit('addCommand')
}

function emitShowNodeData(nodeId) {
  FlowChart.emit('showNodeData', nodeId)
}

/**
 * @description 移除当前选中节点的className：fy_node_selected
 */
function removeClassNameSelected() {
  const selected = document.getElementsByClassName('fy_node_selected')[0]
  if (selected) {
    selected.classList.remove('fy_node_selected')
  }
}

/**
 * @description 向指定nodeid的节点添加目标端点
 * @param {string} toId 需要添加目标端点的node的id
 * @param {array} endpointsData 目标端点数组 [{id:'aa',data:{}}]
 */
function addTargetEndpoints(toId, endpointsData) {
  const len = endpointsData.length
  const space = 1 / (len + 1)
  for (let j = 0; j < len; j += 1) {
    const endpoint = instance.addEndpoint(toId, targetEndpoint, {
      anchor: [space * (j + 1), 0, 0, -1],
      uuid: endpointsData[j].id
    })

    const tip = new Tooltip(endpoint.canvas, {
      title: endpointsData[j].data.value,
      placement: 'top',
      trigger: 'manual',
      container: endpoint.canvas
    })
    endpoint.canvas.tip = tip
  }
}

/**
 * @description 向指定nodeid的节点添加源端点
 * @param {string} toId 需要添加源端点的node的id
 * @param {array} endpointsData 源端点数组 [{id:'aa',data:{}}]
 */
function addSourceEndpoints(toId, endpointsData) {
  const len = endpointsData.length
  const space = 1 / (len + 1)
  for (let j = 0; j < len; j += 1) {
    const endpoint = instance.addEndpoint(
      toId,
      sourceEndpoint, {
        anchor: [space * (j + 1), 1, 0, 1],
        uuid: endpointsData[j].id
      }
    )
    const tip = new Tooltip(endpoint.canvas, {
      title: endpointsData[j].data.value,
      placement: 'bottom',
      container: endpoint.canvas
    })

    endpoint.bind('mouseover', () => {
      tip.show()
    })
    endpoint.bind('mouseout', () => {
      tip.hide()
    })
  }
}

/**
 * @description 获取缩放比率
 * @returns {number} 缩放比率
 */
function getScale() {
  let scale1
  if (instance.pan) {
    const { scale } = instance.pan.getTransform()
    scale1 = scale
  } else {
    const matrix = window.getComputedStyle(container).transform
    scale1 = matrix.split(', ')[3] * 1
  }
  instance.setZoom(scale1)
  return scale1
}

/**
 * @description 执行移动节点命令
 * @param {Element} nodeEl 节点的Element对象
 */
function execMoveNodeCommand(nodeEl) {
  const { left, top } = nodeEl.style
  exec(MoveNodeCommand, nodeEl.id, {
    left: parseFloat(left),
    top: parseFloat(top)
  })
}

/**
 * @description 改变节点位置
 * @param {string} id 节点的id属性值
 * @param {object} pos {left,top}
 */
function changeNodePosition(id, pos) {
  const el = document.getElementById(id)
  el.style.left = `${pos.left}px`
  el.style.top = `${pos.top}px`
  instance.revalidate(el)
  model.changeNodePos(id, pos)
}

/**
 * @description 为每一个节点绑定拖动事件
 * @param {Element} newNode
 */
function bindDragEventOnNode(newNode) {
  instance.draggable(newNode, {
    start() {
      execMoveNodeCommand(newNode)
    },
    stop(params) {
      model.changeNodePos(newNode.id, {
        left: params.pos[0],
        top: params.pos[1]
      })
    }
  })
}

function getConnectorByUuids(uuids) {
  // console.log('getConnectorByUuids')
  const edge = uuids.join(CONNECTORSEPARATESYMBOL)
  const connectors = instance.getAllConnections()
  const connector = connectors.find(c => c.getUuids().join(CONNECTORSEPARATESYMBOL) === edge)
  return connector
}

/**
 * @description 生成节点并插入到设计区域
 * @param {number} left
 * @param {number} top
 * @param {string} id
 * @param {string} html
 * @returns {Element} 返回生成的节点
 */
function generateNode(left, top, id, iconCLassName, contentText, nodeType, nodeState) {
  // console.log('3' + nodeType)
  // 节点最外层div
  const newNode = document.createElement('div')
  newNode.classList.add('fy_node')
  newNode.style.left = `${left}px`
  newNode.style.top = `${top}px`

  newNode.id = id
  container.appendChild(newNode)

  // 右键菜单
  newNode.oncontextmenu = (ev) => {
    ev.preventDefault()
    contextMenu.show({
      left: ev.pageX,
      top: ev.pageY
    }, id)

    ev.stopPropagation()
  }

  // 切换选中状态
  newNode.onclick = (ev) => {
    // console.log('nodeType:' + nodeType)
    ev.stopPropagation()
    removeClassNameSelected()
    newNode.classList.add('fy_node_selected')
    FlowChart.emit('selectNode', id, nodeType)
  }
  EventCenter.on('document.click', () => {
    removeClassNameSelected()
  })

  // 插入容器
  const component = new Vue({
    render(h) {
      return h(Node, {
        props: {
          iconCLassName,
          contentText,
          nodeState,
          nodeType
        }
      })
    }
  }).$mount()
  newNode.appendChild(component.$el)
  newNode.vNode = component
  bindDragEventOnNode(newNode)
}

/**
 * @description 根据action生成node
 * @param {string} action 'drag' 或者 'copy' 触发增加节点的动作
 * @param {*} position
 * @param {*} icon
 * @param {*} value
 * @returns
 */
function addNodeByAction(action, position, icon, value, type, params) {
  const containerRect = container.getBoundingClientRect()
  const scale = getScale()
  const id = `${type}-node-${createUuid()}`
  let left = (position.pageX - containerRect.left) / scale
  let top = (position.pageY - containerRect.top) / scale
  if (action === 'drag') {
    left -= 86
    top -= 18
  }

  let targetEndpoints = []
  let sourceEndpoints = []
  if (type === '数据源') {
    sourceEndpoints = [{ id: `source-source-${createUuid()}`, data: { value: '加密算法' }}]
  } else if (algorithmList.includes(type)) {
    targetEndpoints = [{ id: `encrypt-target-${createUuid()}`, data: { value: '数据源' }}]
    sourceEndpoints = [{ id: `encrypt-source-${createUuid()}`, data: { value: '攻击算法' }}]
  } else if (AttackList.includes(type)) {
    targetEndpoints = [{ id: `attack-target-${createUuid()}`, data: { value: '加密算法' }}]
  }
  // console.log('type2 + ' + type)
  generateNode(left, top, id, icon, type, value)
  addTargetEndpoints(id, targetEndpoints)
  addSourceEndpoints(id, sourceEndpoints)
  model.addNode({
    id,
    points: {
      targets: targetEndpoints.map(point => point.id),
      sources: sourceEndpoints.map(point => point.id)
    },
    position: {
      left, top
    },
    data: {
      icon,
      value,
      type,
      params
    }
  });
  [...targetEndpoints].concat([...sourceEndpoints]).forEach((point) => {
    model.addEndpoint(point)
  })

  return id
}

/**
 * @description 根据edges数据生成连接线
 * @param {*} edges
 */
function addConnectorsByEdges(edges) {
  // console.log('addConnectorsByEdges')
  edges.forEach((str) => {
    instance.connect({ uuids: str.split(CONNECTORSEPARATESYMBOL) })
  })
}

/**
 * @description 根据特定id的node节点，和给点的相对位置在editor上添加节点
 * @param {object} position {pageX,pageY}  鼠标在页面上的位置
 * @param {stirng} elId 候选节点的id，用来获取节点信息
 */
function addNodeByDrag(position, elId) {
  const copeNode = document.getElementById(elId)
  const contentText = copeNode.lastElementChild.innerHTML
  const type = contentText

  // 什么情况不可以加节点
  // 获取当前节点数据
  const { nodes } = model.getData()

  // 检查是否已经存在该结点
  if (nodes.some(node => node.data.type === type)) return

  // 检查是否已经存在algorithmList中的节点类型
  const hasAlgorithmNodeType = nodes.some(node => algorithmList.includes(node.data.type))

  // 检查是否已经存在AttackList中的节点类型
  const hasAttackNodeType = nodes.some(node => AttackList.includes(node.data.type))

  // 检查新添加的节点是否属于上述两个列表之一
  if (algorithmList.includes(type) && hasAlgorithmNodeType) {
    // 如果新节点是算法类型，并且nodes中已存在算法类型节点，则阻止添加新节点
    console.log('已存在算法类型节点，无法添加更多同类算法节点。')
    return
  }

  if (AttackList.includes(type) && hasAttackNodeType) {
    // 如果新节点是攻击类型，并且nodes中已存在攻击类型节点，则阻止添加新节点
    console.log('已存在攻击类型节点，无法添加更多同类攻击节点。')
    return
  }

  let params = {}

  if (type === '标准模式') {
    params = {
      choice: 0
    }
  } else if (type === '差分隐私') {
    params = {
      choice: 1
    }
  } else if (type === '同态加密') {
    params = {
      choice: 2
    }
  } else if (type === '负数据库') {
    params = {
      choice: 3
    }
  } else if (type === '共享权重') {
    params = {
      choice: 5
    }
  } else if (type === '梯度泄露') {
    params = {
      type: 0
    }
  } else if (type === '成员推理') {
    params = {
      type: 1
    }
  } else if (type === '模型逆向') {
    params = {
      type: 2
    }
  }

  // console.log('type+'+type)
  const icon = copeNode.firstElementChild.className
  return addNodeByAction('drag', position, icon, contentText, type, params)
}

/**
 * @description 根据特定id的node数据，和鼠标在页面上的位置 增加新的节点
 * @param {object} position {pageX,pageY}  鼠标在页面上的位置
 * @param {stirng} elId 候选节点的id，用来获取节点信息
 */
function addNodeByCopy(position, nodeId) {
  const nodeData = model.getNodeDataByNodeId(nodeId)
  const { icon, value, type } = nodeData.data
  return addNodeByAction('copy', position, icon, value, type)
}

/**
 *
 * @description 根据节点数据渲染节点 ，此时的动作只有一个：根据数据生成节点
 *  @param {*} nodeData
 */
function addNodeByData(nodeData) {
  const { endpoints } = model.getData()
  const {
    id, position, points, data
  } = nodeData
  generateNode(position.left, position.top, id, data.icon, data.value, data.type, data.nodeState)
  const { targets, sources } = points
  const targetsData = endpoints.filter(item => targets.indexOf(item.id) > -1)
  const sourcesData = endpoints.filter(item => sources.indexOf(item.id) > -1)
  addTargetEndpoints(id, targetsData)
  addSourceEndpoints(id, sourcesData)
}

/**
 * @description 根据提供（额外的）的数据渲染节点 ，比如在删除节点后点击恢复添加的节点，此时的动作有2个： 1.  根据数据生成节点  2. 在model中添加节点数据
 * @param {*} nodeData
 */
function addNodeByExtraData(nodeData, nodeEdgesData, nodeEndpointsData) {
  // console.log('addNodeByExtraData')
  model.addNode(nodeData)
  nodeEdgesData.forEach((edge) => {
    model.addEdge(edge)
  })
  nodeEndpointsData.forEach((endpoint) => {
    model.addEndpoint(endpoint)
  })
  addNodeByData(nodeData)
  addConnectorsByEdges(nodeEdgesData)
}

/**
 * @description 根据给定的node数据生成node节点
 */
function addNodesByData() {
  const { nodes } = model.getData()
  nodes.forEach((n) => {
    addNodeByData(n)
  })
}

/**
 * @description 根据给定的数据生成连接线
 */
function addConnectorsByData() {
  // console.log('addConnectorsByData')
  const { edges } = model.getData()
  addConnectorsByEdges(edges)
}

/**
 * @description 移除节点（Node）
 * @param {*} nodeId 节点id
 */
function removeNode(nodeId) {
  const nodeData = model.getNodeDataByNodeId(nodeId)
  const relatedPointIds = [...nodeData.points.sources, ...nodeData.points.targets]
  const nodeEdgesData = model.getEdgesByPointIds(relatedPointIds)
  const nodeEndpointsData = model.getEndpointsByPointIds(relatedPointIds)
  model.removeNodeByNodeId(nodeId)
  model.removeEdgesByPointIds(relatedPointIds)
  model.removeEndpointsByPointIds(relatedPointIds)
  instance.remove(nodeId)
  return [nodeData, nodeEdgesData, nodeEndpointsData]
}

/**
 * @description 编程式添加连接线
 * @param {string} edge 用于标识边的对应关系的字符串 格式：sourceId${分隔符}targetId
 */
function addConnector(edge) {
  // console.log('addConnector')
  instance.connect({ uuids: edge.split(CONNECTORSEPARATESYMBOL) })
  model.addEdge(edge)
}

/**
 * @description 移除连接线
 * @param {connector} connector 连接线对象
 */
function removeConnector(connector) {
  // console.log('removeConnector')
  const edge = connector.getUuids().join(CONNECTORSEPARATESYMBOL)
  model.removeEdge(edge)
  instance.deleteConnection(connector)
  return edge
}

/**
 * @description 通过uuids来移除连接线
 * @param {array} uuids
 */
function removeConnectorByUuids(uuids) {
  // console.log('removeConnectorByUuids')
  removeConnector(getConnectorByUuids(uuids))
}

/**
 * @description
 * @param {string} nodeId
 * @param {string} value
 */
function renameNode(nodeId, value) {
  const nodeEl = document.getElementById(nodeId)
  const cComp = nodeEl.vNode.$children[0]
  cComp.text = value
  model.changeNodeValue(nodeId, value)
}

/**
 * @description 根据model里的数据  渲染流程图
 */
function render() {
  addNodesByData()
  addConnectorsByData()
}

/**
 * @description 执行增加连接线命令
 * @param {array} uuids [sourceUuid,targetId]
 */
function execAddConnectorCommand(uuids) {
  // console.log('execAddConnectorCommand(uuids)')
  exec(AddConnectorCommand, uuids)
  model.addEdge(uuids.join(CONNECTORSEPARATESYMBOL))
}

/**
 * @description 绑定事件（节点的右键菜单事件在 generateNode 函数中绑定）
 */
function bindEvent() {
  // 右键菜单事件
  instance.bind('contextmenu', (component, originalEvent) => {
    originalEvent.preventDefault()
    originalEvent.stopPropagation()
    if (isEndpoint(component)) return
    contextMenu.show({
      left: originalEvent.pageX,
      top: originalEvent.pageY
    }, component)
  })
  instance.getContainer().parentElement.addEventListener('contextmenu', (ev) => {
    ev.preventDefault()
    contextMenu.show({
      left: ev.pageX,
      top: ev.pageY
    })
  })

  // 手动拖动创建连接事件
  instance.bind('connection', (info, ev) => {
    // 手动创建或编程connect创建线时，会触发该事件。但编程创建时ev为undefined。more：http://jsplumb.github.io/jsplumb/events.html
    if (ev) {
      const uuids = info.connection.getUuids()

      const start_type = uuids[0].split('-')[0]
      const end_type = uuids[1].split('-')[0]
      // console.log('类型:', start_type + ', ' + end_type)

      execAddConnectorCommand(uuids)

      if ((start_type === 'source' && end_type === 'encrypt') || (start_type === 'encrypt' && end_type === 'attack')) {
        execAddConnectorCommand(uuids)
      } else {
        instance.deleteConnection(info.connection)
      }
    }
  })

  // 拖动端点连线时 显示目标端点tooltip
  instance.bind('connectionDrag', () => {
    const Nodelist = document.querySelectorAll('.jtk-endpoint.targetPoint:not(.jtk-endpoint-connected)');
    [].forEach.call(Nodelist, (el) => {
      el.tip.show()
    })
  })
  instance.bind('connectionDragStop', () => {
    const Nodelist = document.querySelectorAll('.jtk-endpoint.targetPoint');
    [].forEach.call(Nodelist, (el) => {
      el.tip.hide()
    })
  })

  // 开始拖动新连接时
  instance.bind('beforeDrop', (params) => {
    if (params.sourceId === params.targetId) {
      return false
    }
    return true
  })

  // 点击连接线变换样式
  // instance.bind('click', (c) => {
  // c.canvas.classList.add('active');
  // });
}

/**
 * @description 初始化
 */
function init() {
  container = instance.getContainer()
  bindEvent()
}

// 在运行前执行的完整检查
// 有根节点
function checkGraph() {
  // 检查每个节点和边是否符合规则
  for (const node of model.nodes) {
    if (node.type === '源数据' && node.edges.incoming.length > 0) {
      return false
    }
    if (node.type === '求交' && node.edges.incoming.length !== 1) {
      return false
    }
    if (node.type === '模型' && node.edges.incoming.length !== 1) {
      return false
    }
    // 更多规则...
  }

  // 如果所有节点都符合规则，则返回true
  return true
}

// 执行时使用的深度优先遍历（给出根节点--数据源节点）
function depthFirstTraversal(rootId, nodes, edges, visited = new Set()) {
  const result = []

  function dfs(nodeId) {
    // console.log('nodeId,' + nodeId)
    const node = nodes.find(node => node.id === nodeId)
    if (!node || visited.has(nodeId)) {
      return
    }

    visited.add(nodeId)
    result.push(node.id)
    // console.log('node-dfs: ' + node.points.sources)

    const source = node.points.sources[0]
    const connectedEdges = edges.filter(edge => edge.startsWith(`${source}&&`))
    connectedEdges.forEach(edge => {
      const target = edge.split('&&')[1]
      const targetId = nodes.find(node => node.points.targets.find(target1 => target1 === target)).id
      dfs(targetId)
    })
  }

  dfs(rootId)

  return result
}
// 广度优先遍历
function breadthFirstTraversal(rootId, nodes, edges, visited = new Set()) {
  const result = []
  const queue = [rootId] // 使用队列来管理待遍历的节点

  while (queue.length > 0) {
    const nodeId = queue.shift() // 从队列中取出一个节点进行遍历
    // console.log('nodeId,' + nodeId)
    const node = nodes.find(node => node.id === nodeId)
    if (!node || visited.has(nodeId)) {
      continue // 如果节点不存在或已被访问，则跳过
    }

    visited.add(nodeId) // 标记节点为已访问
    result.push(node.id) // 将节点添加到结果列表中
    // console.log('node-bfs: ' + node.points.sources)

    const source = node.points.sources[0] // 获取节点的源信息
    const connectedEdges = edges.filter(edge => edge.startsWith(`${source}&&`)) // 找到所有从该节点出发的边
    connectedEdges.forEach(edge => {
      const target = edge.split('&&')[1] // 从边中获取目标节点标识符
      const targetNode = nodes.find(node => node.points.targets.find(target1 => target1 === target))
      if (targetNode && !visited.has(targetNode.id)) {
        queue.push(targetNode.id) // 如果目标节点未被访问，则将其添加到队列中
      }
    })
  }

  return result // 返回遍历结果
}

const editor = {
  emitCommandListEmpty,
  emitAddCommand,
  emitShowNodeData,
  addNodeByDrag,
  addNodeByCopy,
  addNodeByExtraData,
  addConnector,
  changeNodePosition,
  init,
  render,
  getScale,
  removeNode,
  removeConnector,
  renameNode,
  execAddConnectorCommand,
  removeConnectorByUuids,
  checkGraph,
  depthFirstTraversal,
  breadthFirstTraversal
}

export default editor
