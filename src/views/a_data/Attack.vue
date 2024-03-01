<template>
  <div class="components-container">
    <split-pane class="flowChartWrap" :min-percent="5" :default-percent="17" split="vertical">
      <AttackTree slot="paneL" style="width: auto;" />
      <split-pane slot="paneR" class="flowChartWrap" :default-percent="node_outerSplitPaneSize" split="vertical">

        <!-- 画布 -->
        <el-main slot="paneL">
          <el-container>
            <el-container>
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
          <!-- Node -->
          <el-aside
            slot="paneL"
            width="100%"
            style="height: 100%;"
            class="right"
          >
            <el-container id="mainNodeInfo" style="height: 100%;">
              <el-main>
                <!-- 参数配置 -->
                <div class="title">参数配置-选择数据源</div>
                <div class="model-attr">
                  <!-- 数据源 -->
                  <div style="height: 100%;">
                    <div class="model-attr" style="height: calc(100% - 41px);">
                      <el-table
                        ref="multipleTable"
                        :data="sourceTable"
                        tooltip-effect="dark"
                        style="width: 100%;"
                        height="100%"
                        show-overflow-tooltip
                        highlight-current-row
                        stripe
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column
                          type="selection"
                          width="55"
                          align="center"
                        />
                        <el-table-column
                          prop="name"
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

                    </div>
                  </div>
                </div>
              </el-main>
            </el-container>
          </el-aside>

          <!-- Tab -->
          <el-tabs slot="paneR" v-model="TabActiveName" style="margin-top:0px; height:100%; overflow-y: auto;" type="border-card">
            <el-tab-pane label="日志" name="logger">
              <div v-for="(log, index) in logMessages" :key="index" style="color:  #888;">
                {{ log }}
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="hasResult" id="modelResult" ref="modelResult" style="height: 100%;" label="攻击模拟结果展示" name="result">
              <el-collapse v-model="output_attack">
                <el-collapse-item v-if="hasmetrics" title="雷达图" name="radar">
                  <div id="RadarChart" style="width: 100%;height:400px;" />
                </el-collapse-item>
                <el-collapse-item v-if="haspic" title="攻击结果图" name="picture">
                  <el-image v-for="url in picList" :key="url" :src="url" :preview-src-list="picList" lazy />
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
          </el-tabs>
        </split-pane>
      </split-pane>
    </split-pane>
  </div>
</template>
<script>
import Vue from 'vue'
// import { h } from 'vue'
import AttackTree from '@/components/AttackTree.vue'
import splitPane from 'vue-splitpane'
// import TabPane from './TabPane'
import { getFlowChartData } from '@/api/task'
import { taskboard_getSimples } from '@/api/minedata'
import FlowChart from '../../utils/AttackFlow/index'
import PluginFlowExec from '../../utils/AttackFlow/pluginFlowExec'

import { fetchList } from '@/api/minedata'
import waves from '@/directive/waves' // waves directive

import * as echarts from 'echarts'

FlowChart.use(PluginFlowExec)

export default Vue.extend({
  components: { AttackTree, splitPane },
  directives: { waves },
  props: {
    sidebarComponentName: String
  },
  data() {
    return {
      isShowNode: false,
      isShowTab: false,
      currentNodeId: '',
      isExecDisable: false,
      output_attack: [],
      hasResult: false,
      hasmetrics: false,
      haspic: false,
      picList: [],

      sourceTable: [],
      TabActiveName: 'logger',
      node: {},
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
      }
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
      return this.$store.getters.attack_logs
    }
  },
  watch: {
    currentNodeId(val) {
      this.node = FlowChart.getNode(val)
    }
  },
  created() {
    this.getSimple()
    this.getList()
  },
  mounted() {
    FlowChart.setContainer('mainContainer')
    FlowChart.on('selectNode', (id, type) => {
      this.isShowNode = true
      this.currentNodeId = id
    })
    FlowChart.on('modelCompleted', (node) => {
      this.TabActiveName = 'result'
      this.hasResult = true
      const result = node.data.result
      console.log(result)
      // 渲染雷达图
      if (result.metrics) {
        this.output_attack.push('radar')
        this.hasmetrics = true
        this.$nextTick(() => {
        // 渲染图表
          this.initRadarChart(result.metrics)

          // 添加大小变化的监听器
          const chartContainer = document.getElementById('RadarChart')
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
      }

      if (result.pic) {
        this.output_attack.push('picture')
        // 展示图片
        this.haspic = true
        this.picList = result.pic.map(path =>
          path.replace('C:', 'localhost')
        )
        console.log(this.picList)
      }
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
      this.$message.success('模型保存成功')
    },
    getSimple() {
      taskboard_getSimples().then(response => {
        this.sourceTable = response.data
      })
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
    initRadarChart(data) {
      const chartDom = document.getElementById('RadarChart')
      this.RocChart = echarts.init(chartDom)
      this.RocChart.setOption({
        tooltip: {},
        legend: {
          data: ['Class 0', 'Class 1']
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: 'precision', max: 1 },
            { name: 'recall', max: 1 },
            { name: 'f1-score', max: 1 },
            { name: 'support', max: 1 } // Assuming support is normalized
          ]
        },
        series: [{
          name: 'Class Comparison',
          type: 'radar',
          data: [
            {
              value: [
                data[0]['precision'],
                data[0]['recall'],
                data[0]['f1-score'],
                1 // Normalized support
              ],
              name: 'Class 0'
            },
            {
              value: [
                data[1]['precision'],
                data[1]['recall'],
                data[1]['f1-score'],
                1 // Normalized support
              ],
              name: 'Class 1'
            }
          ]
        }]
      })
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
  /* ::v-deep .el-tabs__content{
    padding-left: 0px;
  } */
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
