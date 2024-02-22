module.exports = [
  // get Flow Chart Data
  {
    url: '/api/getFlowChartData',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          nodes: [
            {
              id: 'aaa',
              points: {
                targets: [],
                sources: ['source1', 'source2', 'source10']
              },
              position: {
                left: 300,
                top: 100
              },
              data: {
                value: '数据源1',
                icon: 'el-icon-coin',
                type: '数据源',
                data: []
              }
            },
            {
              id: 'bbb',
              points: {
                targets: ['target1', 'target2', 'target3'],
                sources: ['source3']
              },
              position: {
                left: 300,
                top: 300
              },
              data: {
                value: '数据预处理1',
                icon: 'el-icon-magic-stick',
                type: '求交',
                data: []
              }
            },
            {
              id: 'ccc',
              points: {
                targets: ['ccc111', 'ccc222'],
                sources: ['ccc333']
              },
              position: {
                left: 400,
                top: 500
              },
              data: {
                value: '深度学习1111',
                icon: 'el-icon-coin',
                type: '线性回归',
                data: {}
              }
            },
            {
              id: 'ddd',
              points: {
                targets: ['ddd111'],
                sources: ['ddd333', 'ddd222']
              },
              position: {
                left: 650,
                top: 300
              },
              data: {
                value: '特征1111',
                icon: 'el-icon-star-off',
                type: 'sha',
                nodeState: 'warning',
                data: []
              }
            }
          ],
          endpoints: [
            {
              id: 'target1',
              data: {
                value: '输入'
              }
            },
            {
              id: 'target2',
              data: {
                value: '输入1'
              }
            },
            {
              id: 'source1',
              data: {
                value: '输出表1'
              }
            },
            {
              id: 'source2',
              data: {
                value: '输出表2'
              }
            },
            {
              id: 'source3',
              data: {
                value: '输出表'
              }
            },
            {
              id: 'ccc111',
              data: {
                value: '输入c1'
              }
            },
            {
              id: 'ccc222',
              data: {
                value: '输入c2'
              }
            },
            {
              id: 'ccc333',
              data: {
                value: '输出表'
              }
            },
            {
              id: 'source10',
              data: {
                value: '输出表3'
              }
            },
            {
              id: 'target3',
              data: {
                value: '输入3'
              }
            },
            {
              id: 'ddd111',
              data: {
                value: '输入'
              }
            },
            {
              id: 'ddd222',
              data: {
                value: '输出DDD'
              }
            },
            {
              id: 'ddd333',
              data: {
                value: '输出E'
              }
            }
          ],
          edges: ['source1&&target1', 'source2&&target2', 'source3&&ccc111', 'source3&&ccc222'], // 边的对应关系(sourceId -> targetId)
          head: 'aaa'
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
            label: '数据样本',
            id: 'source',
            children: [{
              label: '数据源',
              id: 'source1',
              icon: 'el-icon-coin'
            }]
          }, {
            label: '数据融合',
            id: 'preHandle',
            children: [{
              label: '求交',
              id: 'preHandle1',
              icon: 'el-icon-magic-stick'
            }]
          }, {
            label: '数据预处理',
            id: 'sign',
            children: [{
              label: '采样',
              id: 'sign4',
              icon: 'el-icon-magic-stick'
            }]
          }, {
            label: '学习算法',
            id: 'learn',
            children: [{
              label: '线性回归',
              id: 'learn6',
              icon: 'el-icon-star-off'
            }]
          }
        ]
      }
    }
  }
]
