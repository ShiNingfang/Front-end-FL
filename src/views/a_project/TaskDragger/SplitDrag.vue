<template>
  <div class="components-container">
    <split-pane class="flowChartWrap" :min-percent="5" :default-percent="17" split="vertical">
      <!-- <div slot="paneL" class="left-container" /> -->
      <ComponentTree slot="paneL" style="width: auto;" />
      <split-pane slot="paneR" class="flowChartWrap" :default-percent="node_outerSplitPaneSize" split="vertical">
        <el-main slot="paneL">
          <el-container>
            <!-- 2.2 画布内容 -->
            <el-container>
              <!-- 2.2.1 flow面板 -->
              <el-main class="main">
                <!-- 2.2.1.1操作按钮 -->
                <!-- <div id="mainMenu">
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
                    <el-tooltip content="适应画布">
                      <el-button
                        icon="el-icon-money"
                        circle
                      />
                    </el-tooltip>
                    <el-tooltip content="全屏">
                      <el-button
                        icon="el-icon-full-screen"
                        circle
                      />
                    </el-tooltip>
                  </div>
                </div> -->
                <!-- 2.2.1.2 画布容器 -->
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
                <!-- <el-dialog
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
                </el-dialog> -->
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
                <div class="title">参数配置-{{ currentNodeType }}</div>
                <div class="model-attr">
                  <!-- 数据源 -->
                  <div v-if="currentNodeType == '数据源' " style="height: 100%;">
                    <!-- <div class="title">参数配置-选择数据源样本</div> -->
                    <div class="model-attr" style="height: calc(100% - 41px);">
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
                      >
                        <el-table-column label="选择" width="55" align="center">
                          <template slot-scope="scope">
                            <el-radio
                              v-model="tenderProjectId"
                              :label="scope.row.name"
                            >{{ '' }}</el-radio>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="name"
                          label="样本名称"
                          align="center"
                          width="100px"
                          show-overflow-tooltip
                        />
                        <el-table-column
                          prop="count"
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
                  <el-form v-if="currentNodeType === '标准模式训练' || currentNodeType === '负数据库' || currentNodeType === '改进的生成对抗网络' || currentNodeType === '共享权重模式协作学习'" :model="paramsForm" class="demo-form-inline" style="height:100%; padding-right:20px;" label-width="100px">
                    <el-col :span="12">
                      <el-form-item label="no_models">
                        <el-input-number v-model="paramsForm.no_models" :min="1" :step="1" step-strictly size="mini" style="vertical-align: middle;" />
                      </el-form-item>
                      <el-form-item label="model_name">
                        <el-select v-model="paramsForm.model_name" placeholder="请选择" size="mini">
                          <el-option label="resnet50" value="resnet50" />
                          <el-option label="vgg16" value="vgg16" />
                          <el-option label="inception" value="inception" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="type">
                        <el-select v-model="paramsForm.type" placeholder="请选择" size="mini">
                          <el-option label="cifar" value="cifar" />
                          <el-option label="mnist" value="mnist" />
                          <el-option label="imagenet" value="imagenet" />
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
                    <el-col :span="12">
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
                  <el-form v-if="currentNodeType === '差分隐私训练'" :model="paramsForm" class="demo-form-inline" style="height:100%; padding-right:20px;" label-width="100px">
                    <el-col :span="12">
                      <el-form-item label="no_models">
                        <el-input-number v-model="paramsForm.no_models" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="model_name">
                        <el-select v-model="paramsForm.model_name" placeholder="请选择" size="mini">
                          <el-option label="resnet50" value="resnet50" />
                          <el-option label="vgg16" value="vgg16" />
                          <el-option label="inception" value="inception" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="type">
                        <el-select v-model="paramsForm.type" placeholder="请选择" size="mini">
                          <el-option label="cifar" value="cifar" />
                          <el-option label="mnist" value="mnist" />
                          <el-option label="imagenet" value="imagenet" />
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
                    <el-col :span="12">
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
                  <el-form v-if="currentNodeType === '同态加密'" :model="paramsForm" class="demo-form-inline" style="height:100%; padding-right:20px;" label-width="100px">
                    <el-col :span="12">
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
                    <el-col :span="12">
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

                  <!-- <el-form v-if="currentNodeType === '负数据库'" :model="negative_database_params" class="demo-form-inline" style="height:100%; padding-right:20px;" label-width="100px">
                    <el-col :span="12">
                      <el-form-item label="no_models">
                        <el-input-number v-model="negative_database_params.no_models" :min="1" :step="1" step-strictly size="mini" style="vertical-align: middle;" />
                      </el-form-item>
                      <el-form-item label="model_name">
                        <el-select v-model="negative_database_params.model_name" placeholder="请选择" size="mini">
                          <el-option label="resnet50" value="resnet50" />
                          <el-option label="vgg16" value="vgg16" />
                          <el-option label="inception" value="inception" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="type">
                        <el-select v-model="negative_database_params.type" placeholder="请选择" size="mini">
                          <el-option label="cifar" value="cifar" />
                          <el-option label="mnist" value="mnist" />
                          <el-option label="imagenet" value="imagenet" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="global_epochs">
                        <el-input-number v-model="negative_database_params.global_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="local_epochs">
                        <el-input-number v-model="negative_database_params.local_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="batch_size">
                        <el-input-number v-model="negative_database_params.batch_size" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="k">
                        <el-input-number v-model="negative_database_params.k" :min="1" :max="negative_database_params.no_models" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="lr">
                        <el-input-number v-model="negative_database_params.lr" :min="0.001" :max="1.0" :step="0.001" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="momentum">
                        <el-input-number v-model="negative_database_params.momentum" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="lambda_">
                        <el-input-number v-model="negative_database_params.lambda_" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="prop">
                        <el-input-number v-model="negative_database_params.prop" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                  </el-form>
                  <el-form v-if="currentNodeType === '改进的生成对抗网络'" :model="improved_gan_params" class="demo-form-inline" style="height:100%; padding-right:20px;" label-width="100px">
                    <el-col :span="12">
                      <el-form-item label="no_models">
                        <el-input-number v-model="improved_gan_params.no_models" :min="1" :step="1" step-strictly size="mini" style="vertical-align: middle;" />
                      </el-form-item>
                      <el-form-item label="model_name">
                        <el-select v-model="improved_gan_params.model_name" placeholder="请选择" size="mini">
                          <el-option label="resnet50" value="resnet50" />
                          <el-option label="vgg16" value="vgg16" />
                          <el-option label="inception" value="inception" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="type">
                        <el-select v-model="improved_gan_params.type" placeholder="请选择" size="mini">
                          <el-option label="cifar" value="cifar" />
                          <el-option label="mnist" value="mnist" />
                          <el-option label="imagenet" value="imagenet" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="global_epochs">
                        <el-input-number v-model="improved_gan_params.global_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="local_epochs">
                        <el-input-number v-model="improved_gan_params.local_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="batch_size">
                        <el-input-number v-model="improved_gan_params.batch_size" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="k">
                        <el-input-number v-model="improved_gan_params.k" :min="1" :max="improved_gan_params.no_models" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="lr">
                        <el-input-number v-model="improved_gan_params.lr" :min="0.001" :max="1.0" :step="0.001" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="momentum">
                        <el-input-number v-model="improved_gan_params.momentum" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="lambda_">
                        <el-input-number v-model="improved_gan_params.lambda_" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="prop">
                        <el-input-number v-model="improved_gan_params.prop" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                  </el-form>
                  <el-form v-if="currentNodeType === '共享权重模式协作学习'" :model="weight_sharing_params" class="demo-form-inline" style="height:100%; padding-right:20px;" label-width="100px">
                    <el-col :span="12">
                      <el-form-item label="no_models">
                        <el-input-number v-model="weight_sharing_params.no_models" :min="1" :step="1" step-strictly size="mini" style="vertical-align: middle;" />
                      </el-form-item>
                      <el-form-item label="model_name">
                        <el-select v-model="weight_sharing_params.model_name" placeholder="请选择" size="mini">
                          <el-option label="resnet50" value="resnet50" />
                          <el-option label="vgg16" value="vgg16" />
                          <el-option label="inception" value="inception" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="type">
                        <el-select v-model="weight_sharing_params.type" placeholder="请选择" size="mini">
                          <el-option label="cifar" value="cifar" />
                          <el-option label="mnist" value="mnist" />
                          <el-option label="imagenet" value="imagenet" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="global_epochs">
                        <el-input-number v-model="weight_sharing_params.global_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="local_epochs">
                        <el-input-number v-model="weight_sharing_params.local_epochs" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="batch_size">
                        <el-input-number v-model="weight_sharing_params.batch_size" :min="1" :step="1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="k">
                        <el-input-number v-model="weight_sharing_params.k" :min="1" :max="weight_sharing_params.no_models" :step="1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="lr">
                        <el-input-number v-model="weight_sharing_params.lr" :min="0.001" :max="1.0" :step="0.001" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="momentum">
                        <el-input-number v-model="weight_sharing_params.momentum" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="lambda_">
                        <el-input-number v-model="weight_sharing_params.lambda_" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                      <el-form-item label="prop">
                        <el-input-number v-model="weight_sharing_params.prop" :min="0" :max="1.0" :step="0.1" step-strictly size="mini" />
                      </el-form-item>
                    </el-col>
                  </el-form> -->
                </div>
              </el-main>
            </el-container>
          </el-aside>
          <!-- Tab -->
          <el-tabs slot="paneR" v-model="activeName2" style="margin-top:0px; height:100%; overflow-y: auto;" type="border-card">
            <!-- <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key"> -->
            <!-- </el-tab-pane> -->

            <!-- 本方数据输出 -->
            <el-tab-pane label="本方数据输出" name="output">
              <el-collapse v-model="output_activeNames" @change="handleChange">
                <el-collapse-item title="统计信息" name="1">
                  <el-descriptions title="用户信息">
                    <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
                    <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
                    <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
                    <el-descriptions-item label="备注">
                      <el-tag size="small">学校</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
                  </el-descriptions>
                </el-collapse-item>
                <el-collapse-item title="元数据信息" name="2">
                  <div class="filter-container">
                    <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
                      Export
                    </el-button>
                  </div>
                  <el-table
                    :key="tableKey"
                    v-loading="listLoading"
                    :data="list"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;"
                  >
                    <el-table-column label="样本名称" prop="id" align="center" width="80">
                      <template slot-scope="{row}">
                        <span>{{ row.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="样本集" width="100px" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.set }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="原始文件名称" width="110px" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.origin_name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="样本计数" width="100px" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.data_count }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="加入项目数" align="center" width="95">
                      <template slot-scope="{row}">
                        <span>{{ row.join_count }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="修改时间" class-name="status-col" align="center" width="140">
                      <template slot-scope="{row}">
                        <el-tag :type="row.status">
                          {{ row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>

                  <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <!-- 评估报告 -->
            <el-tab-pane label="评估报告" name="evaluate">
              <div id="evaluateInfo" style="width: 100%;">
                <div id="RocChart" style="width: 100%;height:400px;" />
              </div>
            </el-tab-pane>
            <!-- 模型对比报告 -->
            <el-tab-pane label="模型对比报告" name="contrast">
              <el-collapse v-model="contrast_activeNames" @change="handleChange">
                <el-collapse-item title="模型信息" name="1">
                  <el-descriptions title="用户信息">
                    <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
                    <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
                    <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
                    <el-descriptions-item label="备注">
                      <el-tag size="small">学校</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
                  </el-descriptions>
                </el-collapse-item>
                <el-collapse-item id="contrastInfo" title="图表" name="2">
                  <div class="filter-container">
                    <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
                      Export
                    </el-button>
                  </div>
                  <el-table
                    :key="tableKey"
                    v-loading="listLoading"
                    :data="list"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;"
                  >
                    <el-table-column label="样本名称" prop="id" align="center" width="80">
                      <template slot-scope="{row}">
                        <span>{{ row.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="样本集" width="100px" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.set }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="原始文件名称" width="110px" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.origin_name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="样本计数" width="100px" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.data_count }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="加入项目数" align="center" width="95">
                      <template slot-scope="{row}">
                        <span>{{ row.join_count }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="修改时间" class-name="status-col" align="center" width="140">
                      <template slot-scope="{row}">
                        <el-tag :type="row.status">
                          {{ row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>

                  <div id="BarChart" style="width: 100%;height:300px; margin-top: 30px;" />
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
import ComponentTree from '@/components/ComponentTree.vue'
import splitPane from 'vue-splitpane'
// import TabPane from './TabPane'
import { getFlowChartData } from '@/api/task'
import { taskboard_getSimples } from '@/api/minedata'
import FlowChart from './FlowChart/index'
import PluginFlowExec from './FlowChart/pluginFlowExec'

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
      // showInnerSplitPane: false, // 控制内部 split-pane 显示的状态
      isShowNode: false,
      isShowTab: true,
      currentNodeId: '',
      currentNodeType: '',
      isUndoDisable: true,
      isExecDisable: false,
      table: true,
      tenderProjectId: '',

      tableData2: [],
      dialogTableVisible: false,
      tabMapOptions: [
        { label: '本方数据输出', key: 'output' },
        { label: '日志', key: 'logger' },
        { label: '当前评估报告', key: 'evaluate' },
        { label: '模型对比报告', key: 'contrast' }
      ],
      activeName2: 'CN',
      createdTimes: 0,
      paramsForm: {},

      output_activeNames: ['1', '2'],
      contrast_activeNames: ['1', '2'],
      tableKey: 0,
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
      downloadLoading: false,
      contrastInfo: null,
      BarChart: null, // 用于存储ECharts实例
      evaluateInfo: null,
      RocChart: null
    }
  },
  computed: {
    node_outerSplitPaneSize() {
      return this.isShowNode ? 55 : 100 // 55 100
    },
    tab_outerSplitPaneSize() {
      return this.isShowTab ? 60 : 100 // 60 100
    }
  },
  watch: {
    activeName2(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    },
    isShowNode(newVal) {
      if (newVal === true) {
        console.log(newVal)
        this.$nextTick(() => {
          // 在DOM更新完成后，初始化图表
          this.initCharts()
        })
      }
    },
    currentNodeId(val) {
      // console.log('id:' + val)
      this.paramsForm = FlowChart.getNodeParams(val)
      // console.log(this.paramsForm)
      // console.log()
    }
  },
  created() {
    // init the default selected tab
    this.getSimple()

    const tab = this.$route.query.tab
    if (tab) {
      this.activeName2 = tab
    }
    this.getList()
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
    FlowChart.on('selectNode', (id, type) => {
      this.isShowNode = true
      // console.log('isshownode' + this.isShowNode)
      this.currentNodeId = id
      this.currentNodeType = type
    })
    getFlowChartData().then((data) => {
      FlowChart.loadData(data.data)
    })

    this.checkAndInitCharts()
  },
  methods: {
    dragoverHandle(ev) {
      ev.preventDefault()
    },
    dropHandle(ev) {
      FlowChart.addNode({ pageX: ev.pageX, pageY: ev.pageY }, ev.dataTransfer.getData('target'))
    },
    // clickBgHandle() {
    //   this.isShowNode = false
    // },
    execModel() {
      this.isExecDisable = true
      FlowChart.runModel().then(() => {
        this.isExecDisable = false
      })
    },
    saveData() {
      const modelData = FlowChart.getModelData()
      console.log(modelData)
      // console.log(modelData)
      this.$message.success('模型保存成功')
    },
    rowClick(val) {
      // console.log('val:' + val.name)
      this.tenderProjectId = val.name
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    initBarChart() {
      const chartDom = document.getElementById('BarChart')
      this.BarChart = echarts.init(chartDom)
      this.BarChart.setOption({
        legend: {},
        grid: {
          show: false, // 是否显示直角坐标系网格
          z: 0, // 组件的所有图形的 zlevel 值
          left: '10%', // grid 组件离容器左侧的距离
          top: 50, // grid 组件离容器顶部的距离
          right: '10%', // grid 组件离容器右侧的距离
          bottom: 20, // grid 组件离容器底部的距离
          containLabel: true, // grid 区域是否包含坐标轴的刻度标签
          backgroundColor: 'rgba(0,0,0,0)', // 网格背景色
          borderWidth: 1, // 网格的边框宽度
          borderColor: '#ccc' // 网格的边框颜色
        },
        tooltip: {},
        dataset: {
          dimensions: ['product', '2015', '2016'],
          source: [
            { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8 },
            { product: 'Milk Tea', 2015: 83.1, 2016: 73.4 },
            { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2 },
            { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9 }
          ]
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0 // 显示所有标签
          }},
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }]
      })
    },
    initRocChart() {
      const chartDom = document.getElementById('RocChart')
      this.RocChart = echarts.init(chartDom)
      this.RocChart.setOption({
        title: {
          // text: 'ROC Curve'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['TPR', 'FPR']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: 'FPR',
          min: 0,
          max: 1,
          interval: 0.1,
          splitLine: {
            show: true, // 显示x轴分割线
            lineStyle: {
              color: '#EDEFF3' // 分割线颜色，这里设置为红色
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'TPR',
          min: 0,
          max: 1,
          interval: 0.1,
          splitLine: {
            show: true, // 显示x轴分割线
            lineStyle: {
              color: '#EDEFF3' // 分割线颜色，这里设置为红色
            }
          }
        },
        series: [
          {
            name: 'TPR',
            type: 'line',
            smooth: true,
            data: [[0, 0], [0.1, 0.3], [0.2, 0.5], [0.3, 0.7], [0.4, 0.8], [1, 1]]
          },
          {
            name: 'FPR',
            type: 'line',
            smooth: true,
            data: [[0, 0], [0.1, 0.2], [0.2, 0.4], [0.3, 0.6], [0.4, 0.7], [1, 1]]
          }
        ]
      })
    },
    observeContrastInfoResize() {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // 当contrastInfo大小变化时，调整ECharts实例的大小
          if (this.BarChart) {
            this.BarChart.resize()
          }
          if (this.RocChart) {
            this.RocChart.resize()
          }
        }
      })
      if (this.contrastInfo) resizeObserver.observe(this.contrastInfo) // 开始观察
      if (this.evaluateInfo) resizeObserver.observe(this.evaluateInfo)
    },
    initCharts() {
      this.contrastInfo = document.getElementById('contrastInfo')
      if (this.contrastInfo) {
        this.initBarChart()
      }
      this.evaluateInfo = document.getElementById('evaluateInfo')
      if (this.evaluateInfo) {
        this.initRocChart()
      }
      this.observeContrastInfoResize() // 设置ResizeObserver监听
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
</style>
