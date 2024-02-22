<template>
  <el-aside
    width="240px"
    class="left"
  >
    <div class="search">
      <el-input
        v-model="filterText"
        placeholder="搜索"
        size="small"
      >
        <i
          slot="prefix"
          class="el-input__icon el-icon-search"
        />
      </el-input>
    </div>
    <el-tree
      ref="tree2"
      :data="nodeData"
      node-key="id"
      :default-expanded-keys="['source','preHandle','sign','learn']"
      icon-class="el-icon-arrow-right"
      :render-content="renderContentFunction"
      :filter-node-method="filterNode"
      :highlight-current="true"
      :props="defaultProps"
      @node-contextmenu="handleNodeContextMenu"
    />
    <el-button class="btn-new" icon="el-icon-plus">新建实验</el-button>
  </el-aside>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      // ...保持data不变
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  mounted() {
    // ...保持mounted不变
  },
  methods: {
    renderContentFunction(h, { node, data }) {
      // ...保持renderContentFunction不变
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeContextMenu(event, data) {
      if (data.children) {
        this.openFolderContextMenu(event)
      } else {
        this.openLeafContextMenu(event)
      }
    },
    openFolderContextMenu(event) {
      // ...保持openFolderContextMenu不变
    },
    openLeafContextMenu(event) {
      // ...保持openLeafContextMenu不变
    }
  }
})
</script>

<style lang="scss" scoped>
.left {
  position: relative;
  .btn-new {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>
<style>
/* 右键 */
.contentmenu-ctn {
  font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB", "PingFang SC",
  "Microsoft YaHei", tahoma, simsun, 宋体, serif;
}
</style>
