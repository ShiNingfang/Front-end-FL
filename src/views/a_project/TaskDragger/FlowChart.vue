<template>
  <el-container class="flowChartWrap">
    <!-- 1. 左侧搜索树 -->
    <ComponentTree />
    <!-- 2. 右侧面板 -->
    <el-main>
      <el-container>
        <!-- 2.1 头部tab -->
        <el-header
          height="40px"
          class="tabsNav"
        >
          <el-tabs
            v-model="activeName"
            type="card"
            closable
          >
            <el-tab-pane name="first">
              <span slot="label"><i class="el-icon-s-promotion" /> 我的模型一</span></el-tab-pane>
          </el-tabs>
        </el-header>
        <!-- 2.2 画布内容 -->
        <el-container>
          <!-- 2.2.1 flow面板 -->
          <el-main class="main">
            <!-- 2.2.1.1操作按钮 -->
            <div id="mainMenu">
              <div class="tool-left">
                <el-button
                  icon="el-icon-video-play"
                  :disabled="isExecDisable"
                  size="small"
                  @click="execModel"
                >执行</el-button>
                <el-button
                  icon="el-icon-video-play"
                  size="small"
                  @click="saveData"
                >保存</el-button>
                <el-button
                  icon="el-icon-upload"
                  size="small"
                >部署</el-button>
                <el-button
                  icon="el-icon-box"
                  size="small"
                >Auto ML</el-button>
              </div>
              <div class="tool-right">
                <el-tooltip content="撤销">
                  <el-button
                    icon="el-icon-refresh-left"
                    :disabled="isUndoDisable"
                    circle
                    @click="undo"
                  />
                </el-tooltip>
                <el-tooltip content="放大">
                  <el-button
                    icon="el-icon-zoom-in"
                    circle
                    @click="zoomOut"
                  />
                </el-tooltip>
                <el-tooltip content="缩小">
                  <el-button
                    icon="el-icon-zoom-out"
                    circle
                    @click="zoomIn"
                  />
                </el-tooltip>
                <el-tooltip content="自动布局">
                  <el-button
                    icon="el-icon-bangzhu"
                    circle
                  />
                </el-tooltip>
                <!-- <el-tooltip content="适应画布">
                    <el-button icon="el-icon-money"
                               circle></el-button>
                  </el-tooltip> -->
                <el-tooltip content="全屏">
                  <el-button
                    icon="el-icon-full-screen"
                    circle
                  />
                </el-tooltip>
              </div>
            </div>
            <!-- 2.2.1.2 画布容器 -->
            <div
              class="mainContainer"
              @drop="dropHandle"
              @dragover="dragoverHandle"
            >
              <div
                id="mainContainer"
                @click="clickBgHandle"
              />
            </div>
            <el-dialog
              title="数据探查-（仅显示前100条）"
              :visible.sync="dialogTableVisible"
            >
              <el-table :data="gridData">
                <el-table-column
                  property="date"
                  label="日期"
                  width="150"
                />
                <el-table-column
                  property="name"
                  label="姓名"
                  width="200"
                />
                <el-table-column
                  property="address"
                  label="地址"
                />
              </el-table>
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button
                  type="primary"
                  @click="dialogTableVisible = false"
                >复 制</el-button>
                <el-button @click="dialogTableVisible = false">取 消</el-button>
              </div>
            </el-dialog>
          </el-main>
          <!-- 2.2.2 组件属性设置 -->
          <el-aside
            v-show="dataInfo"
            width="500px"
            class="right"
          >
            <el-container id="mainNodeInfo">
              <el-main>
                <div>
                  <!-- simple\params\console -->
                  <div v-show="toolBarShow==='simple'">
                    <div class="title">参数配置-</div>
                    <div class="model-attr" />
                  </div>
                  <!-- <div v-show="toolBarShow==='simple'">
                    <div class="title">参数配置-选择数据源样本</div>
                    <div class="model-attr">
                      <el-table
                        :data="tableData"
                        highlight-current-row
                        style="width: 100%"
                        max-height="100%"
                        @current-change="handleCurrentChange"
                      >
                        <el-table-column
                          fixed
                          prop="date"
                          label="样本名称"
                          align="center"
                          min-width="150"
                        />
                        <el-table-column
                          prop="name"
                          label="样本记录数"
                          align="center"
                          width="100"
                        />
                        <el-table-column
                          prop="province"
                          label="描述"
                          align="center"
                          min-width="120"
                        />
                      </el-table>
                    </div>
                  </div> -->
                  <!-- <div v-show="toolBarShow==='component'">
                    <div v-show="!isShowNode">
                      <div class="title">实验属性</div>
                      <div class="model-attr">
                        <p>
                          <span class="item">项目名称</span>
                          <span class="value">Test</span>
                        </p>
                        <p>
                          <span class="item">创建日期</span>
                          <span class="value">2019-04-19 12:14:39</span>
                        </p>
                        <p>
                          <span class="item">名称</span>
                          <el-input
                            v-model="modelName"
                            size="small"
                          />
                        </p>
                        <p>
                          <span class="item">描述</span>
                          <el-input
                            v-model="modelDescription"
                            type="textarea"
                            size="small"
                          />
                        </p>
                      </div>
                    </div>
                    <div v-show="isShowNode">
                      <div class="title">节点属性</div>
                      <div class="node-attr">
                        <p>
                          <span class="item">节点ID</span>
                          <span class="value">{{ currentNodeId }}</span>
                        </p>
                      </div>
                    </div>
                  </div> -->
                  <!-- <div v-show="toolBarShow==='message'">
                    <div class="title">消息管理</div>
                    <div>
                      <el-card
                        v-for="(m,idx) in messagesList"
                        :key="idx"
                        class="messageInfo"
                      >
                        <p>{{ m.time }}</p>
                        <div>
                          <i
                            class="el-icon-circle-close"
                            style="color:red;font-size:26px;position:relative;top:5px;"
                          />
                          {{ m.message }}
                        </div>
                      </el-card>
                    </div>
                  </div> -->
                </div>
              </el-main>
              <!-- <el-aside
                width="32px"
                class="nodeInfoToolBar"
              >
                <div
                  :class="{'tool':true, 'component':true, 'acitve': toolBarShow==='component'}"
                  @click="toolBarShow='component'"
                >
                  <i class="el-icon-tickets" />
                  <span> 组件参数</span>
                </div>
                <div
                  :class="{'tool':true, 'message':true, 'acitve': toolBarShow==='message'}"
                  @click="toolBarShow='message'"
                >
                  <i class="el-icon-chat-dot-round" />
                  <span> 消息提醒</span>
                </div>
              </el-aside> -->
            </el-container>
          </el-aside>
        </el-container>
      </el-container>
    </el-main>
    <!-- <el-drawer
      title="我嵌套了表格!"
      :visible.sync="table"
      direction="rtl"
      size="50%"
      modal="false"
    >
      <el-table
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        max-height="100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          fixed
          prop="date"
          label="样本名称"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="name"
          label="样本记录数"
          align="center"
          width="100"
        />
        <el-table-column
          prop="province"
          label="描述"
          align="center"
          min-width="120"
        />
      </el-table>
    </el-drawer> -->
  </el-container>
</template>
<script>
import Vue from 'vue'
import ComponentTree from '@/components/ComponentTree.vue'
import { getFlowChartData } from '@/api/task'
import FlowChart from '../../../utils/FlowChart/index'
import PluginFlowExec from '../../../utils/FlowChart/pluginFlowExec'

FlowChart.use(PluginFlowExec)

export default Vue.extend({
  components: { ComponentTree },
  props: {
    sidebarComponentName: String
  },
  data() {
    return {
      isShowNode: false,
      currentNodeId: '',
      isUndoDisable: true,
      isExecDisable: false,
      dataInfo: false,
      table: true,

      activeName: 'first',
      toolBarShow: 'component',
      modelName: '你你您',
      modelDescription: '你你您你你您你你您你你您',

      gridData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-08',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-06',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-07',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }],
      dialogTableVisible: false,
      messagesList: [
        {
          time: '2019/6/5 下午3:17:29',
          message: '当前实验中没有可回滚的节点'
        }, {
          time: '2019/6/5 下午3:00:25',
          message: '模型不存在,请生成模型后重试'
        }, {
          time: '2019/6/5 下午3:00:17',
          message: '实验目录不存在'
        }, {
          time: '2019/6/5 下午3:00:09',
          message: '模型不存在,请生成模型后重试'
        }
      ]
    }
  },
  mounted() {
    FlowChart.setContainer('mainContainer')
    FlowChart.on('commandListEmpty', () => {
      this.isUndoDisable = true
    })
    FlowChart.on('showNodeData', () => {
      this.dialogTableVisible = true
    })
    FlowChart.on('addCommand', () => {
      this.isUndoDisable = false
    })
    FlowChart.on('selectNode', (data) => {
      this.isShowNode = true
      this.currentNodeId = data
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
    clickBgHandle() {
      this.isShowNode = false
    },
    zoomOut() {
      FlowChart.zoomOut()
    },
    zoomIn() {
      FlowChart.zoomIn()
    },
    undo() {
      FlowChart.undo()
    },
    execModel() {
      this.isExecDisable = true
      FlowChart.execModel().then(() => {
        this.isExecDisable = false
      })
    },
    saveData() {
      const modelData = FlowChart.getModelData()
      console.log(modelData)
      this.$message.success('模型保存成功')
    }
  }
})
</script>

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
        height: calc(100% - 42px);
        position: relative;
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
        font-size: 12px;
        // color: #999;
        line-height: 40px;
        text-align: center;
      }
      .model-attr {
        padding: 0;
        .item {
          font-size: 12px;
        }
        .value {
          font-size: 12px;
          color: #999;
          margin-left: 10px;
        }
        .el-input {
          margin-top: 5px;
        }
        textarea {
          margin-top: 5px;
          font-family: inherit;
        }
      }
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
../../../utils/FlowChart/index../../../utils/FlowChart/pluginFlowExec
