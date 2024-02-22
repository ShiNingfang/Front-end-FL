<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="样本名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.importance" placeholder="样本集" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="数据源" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
      @sort-change="sortChange"
    >
      <el-table-column label="样本名称" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请者" width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.source }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="样本计数" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="样本用途" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.usage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="150px">
        <template slot-scope="{row}">
          <span style="color:blue;">{{ row.description }}</span>
        <!-- <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" /> -->
        </template>
      </el-table-column>
      <el-table-column label="截止日期" class-name="status-col" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.lastTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button v-if="row.is_agree == 'unhandle'" type="primary" size="mini" @click="handleAgree(row)">
            同意
          </el-button>
          <el-button v-if="row.is_agree == 'unhandle'" size="mini" type="danger" @click="handleReject(row, $index)">
            拒绝
          </el-button>
          <!-- <el-button v-if="row.status!='unagree'" size="mini" type="info" @click="handleCancel(row, $index)">
            取消授权
          </el-button> -->
          <el-button v-if="row.is_agree == 'yes'" size="mini" type="primary" disabled>
            已同意
          </el-button>
          <el-button v-if="row.is_agree == 'no'" size="mini" type="danger" disabled>
            已拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="审批" :visible.sync="dialogFormVisible" prop="item_name">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 90%; margin-left:20px;">
        <el-form-item label-width="0px">
          <div> {{ '若同意样本 ' + item_name + ' 的授权申请，请先设置：' }} </div>
        </el-form-item>
        <el-form-item label="融合上限" prop="limit">
          <div class="block">
            <el-radio-group v-model="temp.limit">
              <el-radio label="不限">
                不限
              </el-radio>
              <el-radio label="限制">
                限制
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="算法用途" prop="use">
          <div class="block">
            <el-checkbox v-model="temp.use" :label="深度神经网络">
              深度神经网络
            </el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="截止日期" prop="ddl">
          <el-date-picker v-model="temp.ddl" type="datetime" placeholder="请选择日期" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="checkAgree()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { author_fetchList, handleApply } from '@/api/minedata'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'DataRight',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: '按名称升序', key: '+id' }, { label: '按名称降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        idcode: '', // 该项数据的唯一标识符
        name: '',
        origin: '',
        data_count: undefined, // 数字
        description: '',
        usage: '',
        deadline: undefined, // timestamp类型
        is_agree: 'unhandle' // 三种状态，yes：已经同意，no：已经拒绝，unhandle：未处理
      },
      item_name: '',
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        limit: [{ required: true, message: '融合上限是必选项', trigger: 'change' }],
        use: [{ required: true, message: '算法用途是必选项', trigger: 'change' }],
        ddl: [{ type: 'date', required: true, message: '截止日期是必选项', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      author_fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // handleModifyStatus(row, status) {
    //   this.$message({
    //     message: '操作Success',
    //     type: 'success'
    //   })
    //   row.status = status
    // },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByName(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        idcode: '', // 该项数据的唯一标识符
        name: '',
        origin: '',
        data_count: undefined, // 数字
        usage: '',
        description: '',
        deadline: undefined, // timestamp类型
        is_agree: 'unhandle'
      }
    },
    handleAgree(row) {
      // this.resetTemp()
      this.temp = row
      this.item_name = row.name
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        // 在 Vue.js 中，this.$nextTick() 函数用于延迟执行代码，直到下一次 DOM 更新循环结束后.
        // 它是一个异步操作，常用于确保 DOM 更新已经完成。在这个特定的代码段中，this.$nextTick() 被用于等待 DOM 更新完成后执行某些操作.
      })
    },
    handleReject(row, index) {
      this.$confirm('此操作将拒绝授权且无法撤销，是否拒绝授权?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleApply({ is_agree: false, row }).then(() => {
          row.is_agree = 'no'
          const index = this.list.findIndex(v => v.idcode === this.temp.idcode)
          this.list.splice(index, 1, row)
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
        })
        // 与后端同步
        this.$message({
          type: 'success',
          message: '已拒绝授权!'
        })
      }).catch(() => {
      })
    },
    // handleCancel(row, index) {
    //   this.$confirm('此操作将取消授权且无法撤销，是否取消授权?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     row.status = 'reject'
    //     // 与后端同步
    //     this.handleDelete(row, index)
    //     this.$message({
    //       type: 'success',
    //       message: '已取消授权!'
    //     })
    //   }).catch(() => {
    //   })
    // },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    checkAgree() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.lastTime = +new Date(tempData.timestamp)
          handleApply({ is_agree: true, tempData }).then(() => {
            this.temp.is_agree = 'yes'
            const index = this.list.findIndex(v => v.idcode === this.temp.idcode)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleFetchPv(pv) {
    // fetchPv(pv).then(response => {
    //   this.pvData = response.data.pvData
    //   this.dialogPvVisible = true
    // })
    },
    handleDownload() {
    // this.downloadLoading = true
    // import('@/vendor/Export2Excel').then(excel => {
    //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //   const data = this.formatJson(filterVal)
    //   excel.export_json_to_excel({
    //     header: tHeader,
    //     data,
    //     filename: 'table-list'
    //   })
    //   this.downloadLoading = false
    // })
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    // 这里怎么说，又不是真的传文件，就保留一个文件地址就行了
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    }
  }
}
</script>
