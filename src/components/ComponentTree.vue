<template>
  <el-aside width="240px" class="left">
    <div class="search">
      <el-input v-model="filterText" placeholder="搜索" size="small">
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
    </div>
    <el-tree ref="tree2" :data="nodeData" node-key="id" :default-expanded-keys="['source','preHandle','sign','learn']" icon-class="el-icon-arrow-right" :render-content="renderContentFunction" :filter-node-method="filterNode" :props="defaultProps" />
  </el-aside>
</template>

<script>
import Vue from 'vue'
import { getMenuData } from '@/api/task'

export default Vue.extend({
  data() {
    return {
      nodeData: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  mounted() {
    getMenuData().then(data => {
      this.nodeData = data.data
    })
  },
  methods: {
    renderContentFunction(h, { node, data }) {
      const className = node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'
      const classNameChild = (!data.children && data.icon) ? data.icon : ''
      return h('div', {
        class: { leafNode: !data.children },
        style: {
          height: '38px',
          lineHeight: '38px',
          fontSize: '12px',
          color: '#1b1c23'
        }
      }, [
        h('el-tooltip', {
          attrs: {
            content: data.label,
            placement: 'top-end',
            disabled: !!data.children
          }
        }, [
          h('span', {
            attrs: {
              draggable: !data.children,
              id: data.id
            },
            on: {
              dragstart: this.dragHandle
            },
            class: 'node',
            style: {
              display: 'inline-block',
              marginTop: '4px',
              height: '30px',
              lineHeight: '30px',
              width: '140px',
              borderRadius: '4px',
              position: 'relative',
              outline: 'none',
              border: !data.children ? '1px solid transparent' : 'none'
            }
          }, [
            h('i', {
              class: {
                [className]: !!data.children,
                [classNameChild]: !data.children
              },
              style: {
                color: '#00cdea',
                marginLeft: data.children ? '10px' : '15px'
              }
            }),
            h('span', {
              style: {
                fontSize: '13px',
                marginLeft: '10px'
              }
            }, data.label)
          ])
        ])
      ])
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    dragHandle(ev) {
      ev.dataTransfer.setData('target', ev.target.id)
    }
  }
})
</script>

<!-- <style scoped>
    .left {
      border-right: 1px solid #e5e5e5;
      height: 100%;
      .el-tree {
        height: calc(100% - 40px);
        overflow-y: auto;
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

</style> -->

<!-- <template>
  <el-tree
    :data="nodeData"
    node-key="id"
    :default-expanded-keys="['source','preHandle','sign','learn']"
    icon-class="el-icon-arrow-right"
    :render-content="renderContentFunction"
    :filter-node-method="filterNode"
    :props="defaultProps"
  />
</template>

<script>
import { getMenuData } from '@/api/task'

export default {
  name: 'ComponentTree',
  data() {
    return {
      nodeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    getMenuData().then(data => {
      this.nodeData = data.data
    })
  },
  methods: {
    // ...你的方法...
  }
}
</script> -->
