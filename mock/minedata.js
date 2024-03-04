const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    idcode: '@guid', // 生成唯一标识符
    name: '@word', // 生成随机单词作为名称
    set: '横向建模', // 生成1到10之间的随机整数作为集合编号
    source: '@url', // 生成随机URL作为来源
    origin_name: '@word', // 生成随机单词作为原始名称
    data_count: '@integer(1, 100)', // 生成1到100之间的随机整数作为数据计数
    description: '@sentence', // 生成随机句子作为描述
    join_count: '@integer(1, 50)', // 生成1到50之间的随机整数作为加入数量
    update_time: '@datetime', // 生成随机日期时间作为更新时间
    path: '@url', // 生成随机URL作为路径
    is_upload: '@boolean', // 随机生成布尔值作为是否上传标识
    origin: '@word', // 生成随机单词作为来源
    is_apply: '@boolean', // 随机生成布尔值作为是否申请标识
    usage: '深度神经网络', // 固定字符串作为使用
    deadline: '@datetime', // 生成随机日期时间作为截止日期
    is_agree: '@pick(["yes", "no", "unhandle"])' // 从数组中随机选择一个状态作为同意状态
  }))
}

const List2 = [] // 确保List数组被初始化

for (let i = 0; i < 100; i++) {
  List2.push(Mock.mock({
    name: '@word', // 生成随机单词作为名称
    author: 'admin', // 作者固定为'admin'
    'cooperator|1-5': ['@name'],
    description: '@sentence', // 生成随机句子作为描述
    lastTime: '@datetime', // 生成随机日期时间作为最后一次时间
    type: '@pick(["type1", "type2", "type3"])', // 从数组中随机选择一个类型
    startTime: '@datetime' // 生成随机日期时间作为开始时间
  }))
}

const List3 = [] // 确保list3数组被初始化

for (let i = 0; i < 100; i++) {
  List3.push(Mock.mock({
    name: '@word', // 生成随机单词作为名称，假设原始数据中未定义则使用随机单词
    type: '@pick(["type1", "type2", "type3"])', // 从数组中随机选择一个类型
    author: 'admin', // 作者固定为'admin'
    'cooperator|1-5': ['@name'],
    startTime: '@date("yyyy-MM-dd")' // 生成随机日期作为开始时间
  }))
}

module.exports = [
  {
    url: '/data_mine/getItems',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      const mockList = List.filter(item => {
        // if (importance && item.importance !== +importance) return false
        // if (type && item.type !== type) return false
        // if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      //   if (sort === '-id') {
      //     mockList = mockList.reverse()
      //   }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/data_mine/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/data_mine/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/data_other/getItems',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      const mockList = List.filter(item => {
        // if (importance && item.importance !== +importance) return false
        // if (type && item.type !== type) return false
        // if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      //   if (sort === '-id') {
      //     mockList = mockList.reverse()
      //   }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/data_other/apply',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/data_author/getItems',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      const mockList = List.filter(item => {
        // if (importance && item.importance !== +importance) return false
        // if (type && item.type !== type) return false
        // if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      //   if (sort === '-id') {
      //     mockList = mockList.reverse()
      //   }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/data_author/handle',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/project_mine/getItems',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      const mockList = List2.filter(item => {
        // if (importance && item.importance !== +importance) return false
        // if (type && item.type !== type) return false
        // if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      //   if (sort === '-id') {
      //     mockList = mockList.reverse()
      //   }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/project_mine/getOptions',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: {
            number: ['snf', 'zzr', 'zzy', 'oyrl', 'wyx'],
            cooperator: ['snf', 'zzr', 'zzy', 'oyrl', 'wyx']
          }
        }
      }
    }
  },
  {
    url: '/project_mine/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/taskboard/getsimples',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: List
      }
    }
  },
  {
    url: '/project_mine/task/getItems',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      const mockList = List3
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/project_mine/task/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/project_other/getItems',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      const mockList = List2
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]

