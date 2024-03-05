<template>
  <div class="components-container">
    <split-pane class="flowChartWrap" :min-percent="5" :default-percent="17" split="vertical">
      <ComponentTree slot="paneL" style="width: auto;" />
      <split-pane slot="paneR" class="flowChartWrap" :default-percent="node_outerSplitPaneSize" split="vertical">
        <!-- 画布 -->
        <el-main slot="paneL">
          <el-container>
            <!-- 2.2 画布内容 -->
            <el-container>
              <!-- 2.2.1 flow面板 -->
              <el-main class="main">
                <div
                  class="mainContainer"
                  @drop="dropHandle"
                  @dragover="dragoverHandle"
                >
                  <div>
                    <el-button
                      style="margin-top: 10px; margin-left: 10px;;"
                      icon="el-icon-video-play"
                      :disabled="isExecDisable"
                      size="small"
                      @click="execModel"
                    >执行</el-button>
                    <el-button
                      style="margin-top: 10px; margin-right: 10px; float: right;"
                      icon="el-icon-video-play"
                      size="small"
                      @click="saveData"
                    >保存</el-button>
                  </div>
                  <div
                    id="mainContainer"
                  />
                </div>
              </el-main>
            </el-container>
          </el-container>
        </el-main>
        <split-pane v-if="isShowNode" slot="paneR" :default-percent="tab_outerSplitPaneSize" class="flowChartWrap" split="horizontal">
          <!-- 参数 -->
          <el-aside
            slot="paneL"
            width="100%"
            style="height: 100%;"
            class="right"
          >
            <el-container id="mainNodeInfo" style="height: 100%;">
              <el-main>
                <div class="title">参数配置-{{ currentNodeType }}</div>
                <div class="model-attr">
                  <el-form v-if="currentNodeType === '标准模式' || currentNodeType === 'XNegDL' || currentNodeType === 'PPUTL' || currentNodeType === '共享数据'" :model="paramsForm" class="demo-form-inline" style="height:100%; padding-right:20px;" label-width="100px">
                    <el-col class="leftForm" :span="12">
                      <el-form-item label="no_models">
                        <el-input-number v-model="paramsForm.no_models" :min="1" :step="1" step-strictly size="mini" style="vertical-align: middle;" />
                      </el-form-item>
                      <el-form-item label="model_name">
                        <el-select v-model="paramsForm.model_name" placeholder="请选择" size="mini">
                          <el-option label="resnet18" value="resnet18" />
                          <el-option label="resnet50" value="resnet50" />
                          <el-option label="densenet121" value="densenet121" />
                          <el-option label="alexnet" value="alexnet" />
                          <el-option label="vgg16" value="vgg16" />
                          <el-option label="vgg19" value="vgg19" />
                          <el-option label="inception_v3" value="inception_v3" />
                          <el-option label="googlenet" value="googlenet" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="type">
                        <el-select v-model="paramsForm.type" placeholder="请选择" size="mini">
                          <el-option label="cifar" value="cifar" />
                          <el-option label="mnist" value="mnist" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="global_epochs">
                        <el-input-number v-model="paramsForm.global_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="local_epochs">
                        <el-input-number v-model="paramsForm.local_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="batch_size">
                        <el-input-number v-model="paramsForm.batch_size" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                    <el-col class="rightForm" :span="12">
                      <el-form-item label="k">
                        <el-input-number v-model="paramsForm.k" :min="1" :max="paramsForm.no_models" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="lr">
                        <el-input-number v-model="paramsForm.lr" :min="0.001" :max="1.0" :step="0.001" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="momentum">
                        <el-input-number v-model="paramsForm.momentum" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="lambda_">
                        <el-input-number v-model="paramsForm.lambda_" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="prop">
                        <el-input-number v-model="paramsForm.prop" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                  </el-form>
                  <el-form v-else-if="currentNodeType === '差分隐私'" :model="paramsForm" class="demo-form-inline" style="height:100%; padding-right:20px;" label-width="100px">
                    <el-col class="leftForm" :span="12">
                      <el-form-item label="no_models">
                        <el-input-number v-model="paramsForm.no_models" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="model_name">
                        <el-select v-model="paramsForm.model_name" placeholder="请选择" size="mini">
                          <el-option label="resnet18" value="resnet18" />
                          <el-option label="resnet50" value="resnet50" />
                          <el-option label="densenet121" value="densenet121" />
                          <el-option label="alexnet" value="alexnet" />
                          <el-option label="vgg16" value="vgg16" />
                          <el-option label="vgg19" value="vgg19" />
                          <el-option label="inception_v3" value="inception_v3" />
                          <el-option label="googlenet" value="googlenet" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="type">
                        <el-select v-model="paramsForm.type" placeholder="请选择" size="mini">
                          <el-option label="cifar" value="cifar" />
                          <el-option label="mnist" value="mnist" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="global_epochs">
                        <el-input-number v-model="paramsForm.global_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="local_epochs">
                        <el-input-number v-model="paramsForm.local_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="batch_size">
                        <el-input-number v-model="paramsForm.batch_size" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="k">
                        <el-input-number v-model="paramsForm.k" :min="1" :max="paramsForm.no_models" :step="1" size="mini" />
                      </el-form-item>
                      <el-form-item label="lr">
                        <el-input-number v-model="paramsForm.lr" :min="0.001" :max="1.0" :step="0.001" size="mini" />
                      </el-form-item>
                    </el-col>
                    <el-col class="rightForm" :span="12">
                      <el-form-item label="momentum">
                        <el-input-number v-model="paramsForm.momentum" :min="0" :max="1.0" :step="0.1" size="mini" />
                      </el-form-item>
                      <el-form-item label="lambda_">
                        <el-input-number v-model="paramsForm.lambda_" :min="0" :max="1.0" :step="0.1" size="mini" />
                      </el-form-item>
                      <el-form-item label="prop">
                        <el-input-number v-model="paramsForm.prop" :min="0" :max="1.0" :step="0.1" size="mini" />
                      </el-form-item>
                      <el-form-item label="dp">
                        <el-switch v-model="paramsForm.dp" active-color="#13ce66" inactive-color="#ff4949" />
                      </el-form-item>
                      <el-form-item label="C">
                        <el-input-number v-model="paramsForm.C" :min="0" size="mini" />
                      </el-form-item>
                      <el-form-item label="sigma">
                        <el-input-number v-model="paramsForm.sigma" :min="0" :step="0.01" size="mini" />
                      </el-form-item>
                      <el-form-item label="q">
                        <el-input-number v-model="paramsForm.q" :min="0" :max="1.0" :step="0.1" size="mini" />
                      </el-form-item>
                      <el-form-item label="w">
                        <el-input-number v-model="paramsForm.w" :step="1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                  </el-form>
                  <el-form v-else-if="currentNodeType === '同态加密'" :model="paramsForm" class="demo-form-inline" style="height:100%; padding-right:20px;" label-width="100px">
                    <el-col class="leftForm" :span="12">
                      <el-form-item label="no_models">
                        <el-input-number v-model="paramsForm.no_models" :min="1" :step="1" step-strictly size="mini" style="vertical-align: middle;" />
                      </el-form-item>
                      <el-form-item label="global_epochs">
                        <el-input-number v-model="paramsForm.global_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="local_epochs">
                        <el-input-number v-model="paramsForm.local_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="batch_size">
                        <el-input-number v-model="paramsForm.batch_size" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="k">
                        <el-input-number v-model="paramsForm.k" :min="1" :max="paramsForm.no_models" :step="1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                    <el-col class="rightForm" :span="12">
                      <el-form-item label="lr">
                        <el-input-number v-model="paramsForm.lr" :min="0.001" :max="1.0" :step="0.001" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="momentum">
                        <el-input-number v-model="paramsForm.momentum" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="lambda_">
                        <el-input-number v-model="paramsForm.lambda_" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="prop">
                        <el-input-number v-model="paramsForm.prop" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="feature_num">
                        <el-input-number v-model="paramsForm.feature_num" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                  </el-form>
                  <!-- 数据源 -->
                  <div v-else style="height: 100%;">
                    <!-- <div class="title">参数配置-选择数据源样本</div> -->
                    <div class="model-attr" style="height: calc(100% - 41px);">
                      <el-tabs v-model="SourceActiveName" style="margin-top:0px; height:100%; overflow-y: auto; " tab-position="left">
                        <el-tab-pane v-for="(cooperater, index) in cooperateList" :key="index" :label="cooperater" :name="cooperater">
                          <el-table
                            ref="multipleTable"
                            :data="tableData2"
                            tooltip-effect="dark"
                            style="width: 100%;"
                            height="100%"
                            show-overflow-tooltip
                            highlight-current-row
                            stripe
                            @row-click="rowClick"
                            @selection-change="handleSelectionChange"
                          >
                            <el-table-column
                              type="selection"
                              width="55"
                              align="center"
                            />
                            <el-table-column
                              prop="simple_name"
                              label="样本名称"
                              align="center"
                              width="100px"
                              show-overflow-tooltip
                            />
                            <el-table-column
                              prop="data_count"
                              label="样本记录数"
                              align="center"
                              width="100px"
                              show-overflow-tooltip
                            />
                            <el-table-column
                              prop="description"
                              label="描述"
                              min-width="100px"
                              show-overflow-tooltip
                            />
                          </el-table>
                        </el-tab-pane>
                      </el-tabs>
                    </div>
                  </div>
                </div>
              </el-main>
            </el-container>
          </el-aside>
          <!-- Tab -->
          <el-tabs slot="paneR" v-model="TabActiveName" style="margin-top:0px; height:100%; overflow-y: auto;" type="border-card">
            <el-tab-pane label="日志" name="logger">
              <div v-for="(log, index) in logMessages" :key="index" style="color:  #888; padding-left: 15px;">
                {{ log }}
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="completedModelList.length > 0" id="modelResult" ref="modelResult" style="height: 100%;" label="模型对比报告" name="result">
              <el-tabs v-model="ResultActiveName" style="margin-top:0px; height:100%; overflow-y: auto; " tab-position="left">
                <el-tab-pane v-for="(modelNode, index) in completedModelList" :key="index" :label="modelNode.data.type" :name="modelNode.data.type">
                  <el-table :data="allTableData[modelNode.data.type] ? allTableData[modelNode.data.type].tableData : []" border style="width: 100%;">
                    <el-table-column prop="type" label="类型" width="100" />
                    <el-table-column v-for="(iteration, resultIndex) in (allTableData[modelNode.data.type] ? allTableData[modelNode.data.type].iterations : [])" :key="resultIndex" :prop="iteration" :label="iteration" align="center" />
                  </el-table>
                  <div :id="'RocChart-' + modelNode.data.type" style="width: 100%;height:400px;" />
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </split-pane>
      </split-pane>
    </split-pane>
  </div>
</template>
<script>
import Vue from 'vue'
import ComponentTree from '@/components/ComponentTree.vue'
import splitPane from 'vue-splitpane'
import { getFlowChartData } from '@/api/task'
import { taskboard_getSimples } from '@/api/minedata'
import FlowChart from '../../../utils/FlowChart/index'
import PluginFlowExec from '../../../utils/FlowChart/pluginFlowExec'

import { fetchList } from '@/api/minedata'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import * as echarts from 'echarts'

FlowChart.use(PluginFlowExec)

export default Vue.extend({
  components: { ComponentTree, splitPane, Pagination },
  directives: { waves },
  props: {
    sidebarComponentName: String
  },
  data() {
    return {
      isShowNode: false,
      isShowTab: false,
      currentNodeId: '',
      currentNodeType: '数据源',
      isExecDisable: false,

      tableData2: [],
      cooperateList: ['自有数据'],
      SourceActiveName: '自有数据',
      TabActiveName: 'logger',
      ResultActiveName: '',
      paramsForm: {},
      node: {},
      completedModelList: [],
      allTableData: {}, // 用于存储所有模型类型的表格数据

      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 2,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '-lastTime'
      },
      RocChart: null
    }
  },
  computed: {
    node_outerSplitPaneSize() {
      return this.isShowNode ? 55 : 100 // 55 100
    },
    tab_outerSplitPaneSize() {
      return this.isShowTab ? 60 : 100 // 60 100
    },
    logMessages() {
      return this.$store.getters.logs
    }
  },
  watch: {
    isShowTab(newVal) {
      if (newVal === true) {
        this.$nextTick(() => {
          this.initCharts()
        })
      }
    },
    currentNodeId(val) {
      this.paramsForm = FlowChart.getNodeParams(val)
      this.node = FlowChart.getNode(val)
    }
  },
  created() {
    this.getSimple()
    this.getList()
    if (this.$route.query.cooperators) {
      const cooperatorsArray = this.$route.query.cooperators.split(',')
      this.cooperateList = ['自有数据', ...cooperatorsArray]
    }
  },
  mounted() {
    FlowChart.setContainer('mainContainer')
    FlowChart.on('selectNode', (id, type) => {
      this.isShowNode = true
      this.currentNodeId = id
      this.currentNodeType = type
    })
    FlowChart.on('modelCompleted', (node) => {
      const nodeType = node.data.type
      this.completedModelList.push(node)
      if (this.completedModelList.length === 1) {
        this.TabActiveName = 'result'
        this.ResultActiveName = nodeType
      }
      console.log(node.data.result)
      // 转换结果为表格数据并根据模型类型存储
      this.transformResultsToTableData(nodeType, node.data.result)

      // 渲染结果
      this.$nextTick(() => {
        // 渲染图表
        this.initRocChart('RocChart-' + nodeType, node.data.result)

        // 添加大小变化的监听器
        const chartContainer = document.getElementById('RocChart-' + nodeType)
        if (chartContainer) {
          const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
              const echartsInstance = echarts.getInstanceByDom(entry.target)
              if (echartsInstance) {
                echartsInstance.resize()
              }
            }
          })
          resizeObserver.observe(chartContainer)

          // 如果需要，可以在组件销毁时停止观察
          this.$once('hook:beforeDestroy', () => {
            resizeObserver.unobserve(chartContainer)
          })
        }
      })
    })

    getFlowChartData().then((data) => {
      FlowChart.loadData(data.data)
    })
  },
  methods: {
    dragoverHandle(ev) {
      ev.preventDefault()
    },
    dropHandle(ev) {
      FlowChart.addNode({ pageX: ev.pageX, pageY: ev.pageY }, ev.dataTransfer.getData('target'))
    },
    execModel() {
      this.isExecDisable = true
      this.isShowNode = true
      this.isShowTab = true
      FlowChart.runModel(this.$store).then(() => {
        this.isExecDisable = false
      })
    },
    saveData() {
      const modelData = FlowChart.getModelData()
      // console.log(modelData)
      // console.log(FlowChart.getCompletedModel())
      // console.log(modelData)
      this.$message.success('模型保存成功')
    },
    getSimple() {
      taskboard_getSimples().then(response => {
        this.tableData2 = response.data
      })
    },
    traverseGraph(data, startNodeId) {
      const visitedNodes = new Set() // 记录已访问的节点，避免重复访问
      const paths = [] // 存储遍历路径

      // 根据源端点ID找到所有出边
      function findEdgesBySourceId(sourceId) {
        return data.edges.filter(edge => edge.split('&&')[0] === sourceId)
      }

      // 根据节点ID找到所有源端点
      function findSourceEndpointsByNodeId(nodeId) {
        const node = data.nodes.find(node => node.id === nodeId)
        return node ? node.points.sources : []
      }

      // 遍历路径
      function traverse(sourceId, path = []) {
        // 记录当前路径
        if (!visitedNodes.has(sourceId)) {
          visitedNodes.add(sourceId)
          path.push(sourceId)
        }

        // 找到源端点对应的所有出边
        const sourceEndpoints = findSourceEndpointsByNodeId(sourceId)
        sourceEndpoints.forEach(sourceEndpoint => {
          const edges = findEdgesBySourceId(sourceEndpoint)
          edges.forEach(edge => {
            const targetId = edge.split('&&')[1]
            // 递归遍历目标端点对应的节点
            traverse(targetId, path.slice()) // 使用slice()来传递路径副本
          })
        })

        // 如果当前节点没有出边，则认为是路径的终点
        if (sourceEndpoints.length === 0 || findEdgesBySourceId(sourceEndpoints[0]).length === 0) {
          paths.push(path)
        }
      }

      // 从起点开始遍历
      traverse(startNodeId)

      // 输出遍历到的路径
      console.log('Traversed paths:', paths)
      return paths
    },
    handleChange(val) {
      console.log(val)
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    initRocChart(id, data) {
      const chartDom = document.getElementById(id)
      this.RocChart = echarts.init(chartDom)
      this.RocChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Acc', 'Loss']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.acc.map((_, i) => `Epoch ${i + 1}`) // 假设每个epoch对应一个数据点
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Acc',
            type: 'line',
            data: data.acc
          },
          {
            name: 'Loss',
            type: 'line',
            data: data.loss
          }
        ]
      })
    },
    // 转换特定模型类型的结果数据为表格数据
    transformResultsToTableData(modelType, result) {
      const { acc, loss } = result
      const iterations = acc.map((_, index) => `训练${index + 1}`)
      const accRow = { type: 'Acc', ...acc.reduce((obj, value, index) => ({ ...obj, [`训练${index + 1}`]: value }), {}) }
      const lossRow = { type: 'Loss', ...loss.reduce((obj, value, index) => ({ ...obj, [`训练${index + 1}`]: value }), {}) }
      const tableData = [accRow, lossRow]

      // 将转换后的表格数据存储在allTableData对象中，按模型类型组织
      this.$set(this.allTableData, modelType, { tableData, iterations })
    }
  }
})
</script>

<style scoped>
  .components-container {
    position: relative;
    /* height: 100vh; */
    height: calc(100vh - 85px);
    margin: 0;
  }
  .tab-container {
    margin: 0px;
  }
  .leftForm{
    padding-left: 20px;
  }
  ::v-deep .el-tabs__content{
    padding-left: 0px;
  }
</style>

<style lang="scss">
.flowChartWrap {
    height: 100%;
    .left {
    border-right: 1px solid #e5e5e5;
    height: 100%;
    .el-tree {
        height: calc(100% - 40px);
        overflow-y: auto;
    }
    }
    .right {
    border-left: 1px solid #e5e5e5;
    }
    .main {
    #mainMenu {
        height: 41px;
        border-bottom: 1px solid #e1e1e1;
        .tool-left {
        float: left;
        .el-button {
            &:first-child {
            margin-left: 10px;
            }
            border: none;
            margin-top: 8px;
        }
        }
        .tool-right {
        float: right;
        .el-button {
            position: relative;
            border: none;
            margin: 3px 0 0 0;
            &:last-child {
            margin-right: 10px;
            }
            background: transparent;
        }
        }
    }
    .mainContainer {
        height: calc(100vh - 42px);
        position: relative;
        // background-color: pink ;
        background-color: rgb(237,239,243); /* 背景颜色 */
        background-size: 10px 10px;
        background-image: radial-gradient(circle, rgb(210, 210, 210) 1px, transparent 1px);
        overflow: hidden;
        outline: none !important;
        #mainContainer {
        outline: none !important;
        height: 100%;
        width: 100%;
        position: relative;
        }
    }
    }
    #mainNodeInfo {
    .nodeInfoToolBar {
        border-left: 1px solid #e5e5e5;
        overflow: hidden;
        .tool {
        padding: 8px 0;
        writing-mode: vertical-rl;
        line-height: 32px;
        font-size: 12px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        &.acitve {
            background: #eee;
        }
        span {
            margin: 5px 0;
        }
        }
    }
    .title {
        border-bottom: 1px solid #e5e5e5;
        height: 41px;
        font-size: 16px;
        font-weight: bolder;
        // color: #1c9bec;
        line-height: 40px;
        text-align: center;
    }
    // .model-attr {
    //     padding: 0;
    //     .item {
    //     font-size: 12px;
    //     }
    //     .value {
    //     font-size: 12px;
    //     color: #999;
    //     margin-left: 10px;
    //     }
    //     .el-input {
    //     margin-top: 5px;
    //     }
    //     textarea {
    //     margin-top: 5px;
    //     font-family: inherit;
    //     }
    // }
    .node-attr {
        padding: 10px;
        .item {
        font-size: 12px;
        }
        .value {
        font-size: 12px;
        color: #999;
        margin-left: 10px;
        }
    }
    .messageInfo {
        padding: 0px;
        margin: 10px;
        color: #333;
        font-size: 14px;
        .el-card__body {
        padding: 10px;
        }
        p {
        padding: 0;
        margin: 0;
        font-size: 12px;
        }
    }
    }
    .el-aside {
    background: #f8f8f8;
    padding: 0;
    margin:0;
    .search {
        height: 40px;
        background-color: #f3f3f3;
        padding: 8px 12px;
        box-sizing: border-box;
        border-bottom: 1px solid #e5e5e5;
        .el-input {
        height: 24px;
        .el-input__inner {
            height: 24px;
        }
        }
        .el-input--small .el-input__icon {
        line-height: 24px;
        }
    }
    .el-tree {
        background: transparent;
    }
    .right{
        margin:0;
    }
    }
    .el-container {
    height: 100%;
    }
    .tabsNav {
    padding: 0;
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border-top: 3px solid #01c1de;
        border-radius: 0;
    }
    .el-tabs__item.is-active {
        color: #333 !important;
    }
    .el-tabs__item {
        font-size: 12px;
    }
    .el-tabs__item:focus.is-active.is-focus:not(:active) {
        box-shadow: none !important;
    }
    }
    .el-tree-node__content,
    .el-tree-node {
    min-height: 38px !important;
    }
    .leafNode {
    .node::before {
        content: "";
        position: absolute;
        top: 2px;
        left: 3px;
        border-radius: 2px;
        padding: 13px 2px;
        background: transparent;
    }
    &:hover span.node {
        border: 1px solid #1c9bec !important;
        background: #fff;
        &::before {
        background: #1c9bec;
        }
    }
    }
}

.el-main{
    padding: 0,
}
</style>
