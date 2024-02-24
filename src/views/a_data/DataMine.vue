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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加样本
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
      <el-table-column label="样本集" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.set }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据源" width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.source }}</el-tag>
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
      <el-table-column label="描述" min-width="100px">
        <template slot-scope="{row}">
          <span style="color:blue;">{{ row.description }}</span>
          <!-- <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" /> -->
        </template>
      </el-table-column>
      <el-table-column label="加入项目数" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.join_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" class-name="status-col" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button> -->
          <el-button v-if="!row.is_upload" size="mini" type="success" @click="handleModifyStatus(row, true, $index)">
            公开
          </el-button>
          <el-button v-if="row.is_upload" size="mini" @click="handleModifyStatus(row, false, $index)">
            隐藏
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <el-button size="mini" type="success" @click="handleAttack(row)">
            攻击模拟
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 90%; margin-left:20px;">
        <el-form-item label="样本名称">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="样本集类别">
          <div class="block">
            <el-radio-group v-model="temp.set">
              <el-radio :label="3">
                横向建模
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="数据源类型">
          <div class="block">
            <el-radio-group v-model="temp.source">
              <el-radio :label="3">
                MySQL
              </el-radio>
              <el-radio :label="6">
                本地文件
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="上传文件">
          <div class="editor-container">
            <UploadFile id="myVueDropzone" url="https://httpbin.org/post" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createArticle, deleteList } from '@/api/minedata'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import UploadFile from './component/UploadFile'

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
  name: 'DataMine',
  components: { Pagination, UploadFile },
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
        sort: '-lastTime'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: '按名称升序', key: '+id' }, { label: '按名称降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        idcode: '',
        name: undefined,
        set: 1,
        source: '',
        origin_name: '', // ？？
        data_count: '', // ？？
        description: '',
        join_count: '', // ？？？
        update_time: new Date(),
        path: '',
        is_upload: false
      },
      // temp: {
      //   name: undefined,
      //   set: 1,
      //   source: '',
      //   oldName: '',
      //   count: '',
      //   description: '',
      //   inclusionCount: '',
      //   lastTime: new Date()
      // },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑样本',
        create: '添加样本'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
      fetchList(this.listQuery).then(response => {
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
    handleModifyStatus(row, status, index) {
      row.is_upload = status
      this.list.splice(index, 1, row)
      this.$message({
        message: '操作Success',
        type: 'success'
      })
    },
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
        idcode: '',
        name: undefined,
        set: 1,
        source: '',
        origin_name: '', // ？？
        data_count: '', // ？？
        description: '',
        join_count: '', // ？？？
        update_time: new Date(),
        path: '',
        is_upload: false
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        // 在 Vue.js 中，this.$nextTick() 函数用于延迟执行代码，直到下一次 DOM 更新循环结束后.
        // 它是一个异步操作，常用于确保 DOM 更新已经完成。在这个特定的代码段中，this.$nextTick() 被用于等待 DOM 更新完成后执行某些操作.
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'snf' // *****
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      // this.dialogStatus = 'update'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    updateData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     const tempData = Object.assign({}, this.temp)
      //     tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      //     updateArticle(tempData).then(() => {
      //       const index = this.list.findIndex(v => v.id === this.temp.id)
      //       this.list.splice(index, 1, this.temp)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: 'Success',
      //         message: 'Update Successfully',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
    },
    handleDelete(row, index) {
      deleteList(this.temp).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    // 攻击模拟函数
    handleAttack(row) {
      // 打开另一个页面
      if (row && row.name) {
        this.$router.push({ path: `/Data/mine/${row.name}` })
      }
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
