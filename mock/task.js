module.exports = [
  // get Flow Chart Data
  {
    url: '/taskboard/getAllinfo',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          nodes: [
          ],
          endpoints: [
            // {
            //   id: 'target1',
            //   data: {
            //     value: '输入'
            //   }
            // },
            // {
            //   id: 'target2',
            //   data: {
            //     value: '输入1'
            //   }
            // },
            // {
            //   id: 'source1',
            //   data: {
            //     value: '输出表1'
            //   }
            // },
            // {
            //   id: 'source2',
            //   data: {
            //     value: '输出表2'
            //   }
            // },
            // {
            //   id: 'source3',
            //   data: {
            //     value: '输出表'
            //   }
            // },
            // {
            //   id: 'ccc111',
            //   data: {
            //     value: '输入c1'
            //   }
            // },
            // {
            //   id: 'ccc222',
            //   data: {
            //     value: '输入c2'
            //   }
            // },
            // {
            //   id: 'ccc333',
            //   data: {
            //     value: '输出表'
            //   }
            // },
            // {
            //   id: 'source10',
            //   data: {
            //     value: '输出表3'
            //   }
            // },
            // {
            //   id: 'target3',
            //   data: {
            //     value: '输入3'
            //   }
            // },
            // {
            //   id: 'ddd111',
            //   data: {
            //     value: '输入'
            //   }
            // },
            // {
            //   id: 'ddd222',
            //   data: {
            //     value: '输出DDD'
            //   }
            // },
            // {
            //   id: 'ddd333',
            //   data: {
            //     value: '输出E'
            //   }
            // }
          ],
          edges: [
            // 'source1&&target1', 'source2&&target2', 'source3&&ccc111', 'source3&&ccc222'
          ] // 边的对应关系(sourceId -> targetId)
        }
      }
    }
  },

  // get Menu Data
  {
    url: '/api/getMenuData',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          {
            label: '数据源',
            id: 'source',
            icon: 'el-icon-coin'
          }, {
            label: '隐私保护算法',
            id: 'learn',
            children: [{
              label: '标准模式',
              id: 'Normal Training',
              icon: 'el-icon-star-off'
            }, {
              label: '差分隐私',
              id: 'Differential Privacy Training',
              icon: 'el-icon-star-off'
            }, {
              label: '同态加密',
              id: 'Homomorphic Encryption',
              icon: 'el-icon-star-off'
            }, {
              label: 'XNegDL',
              id: 'Negative Database',
              icon: 'el-icon-star-off'
            }, {
              label: 'PPUTL',
              id: 'Improved Generative Adversarial Networks',
              icon: 'el-icon-star-off'
            }, {
              label: '共享数据',
              id: 'Weight Sharing for Collaborative Learning',
              icon: 'el-icon-star-off'
            }
            ]
          }, {
            label: '模型对比',
            id: 'contrast',
            icon: 'el-icon-coin'
          }
        ]
      }
    }
  },

  // get Menu Data
  {
    url: '/api/getMenuAttack',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          {
            label: '数据源',
            id: 'source',
            icon: 'el-icon-coin'
          }, {
            label: '加密算法',
            id: 'learn',
            children: [{
              label: '标准模式',
              id: 'Normal',
              icon: 'el-icon-star-off'
            }, {
              label: '差分隐私',
              id: 'Differential Privacy Training',
              icon: 'el-icon-star-off'
            }, {
              label: '同态加密',
              id: 'Homomorphic Encryption',
              icon: 'el-icon-star-off'
            }, {
              label: '负数据库',
              id: 'Negative Database',
              icon: 'el-icon-star-off'
            }, {
              label: '改进的CGAN',
              id: '改进的CGAN',
              icon: 'el-icon-star-off'
            }, {
              label: '矩阵变换与排序',
              id: '矩阵变换与排序',
              icon: 'el-icon-star-off'
            }]
          }, {
            label: '攻击算法',
            id: 'attack',
            children: [
              {
                label: '梯度泄露',
                id: 'Gradient Leakage',
                icon: 'el-icon-star-off'
              },
              {
                label: '成员推理',
                id: 'Membership Inference',
                icon: 'el-icon-star-off'
              },
              {
                label: '模型逆向',
                id: 'Model Inversion',
                icon: 'el-icon-star-off'
              }]
          }
          // , {
          //   label: '模型对比',
          //   id: 'contrast',
          //   icon: 'el-icon-coin'
          // }
        ]
      }
    }
  }
]
