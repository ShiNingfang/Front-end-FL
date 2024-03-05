const Mock = require('mockjs')

// 有意义的单词数组
const cifar10Words = [
  '狗', '猫', '鸟', '鱼', '马', '自行车', '汽车', '飞机', '船', '家具',
  '水果', '蔬菜', '电子产品', '服装', '体育用品'
]
const similarCifar10Categories = [
  '飞机', '汽车', '鸟', '猫', '鹿', '狗', '青蛙', '马', '船', '卡车',
  '摩托车', '公交车', '火车', '熊', '鱼',
  '花', '树', '蘑菇', '桥', '建筑'
]
const similarCifar10Task = [
  '任务a', '任务b', 'test_01', 'cifar_05'
]

// 有意义的句子数组
const cifar10Descriptions = [
  '这个数据集包含来自10个不同类别的彩色图像。',
  '每个类别有大约6000张图像，共计60000张图像。',
  '图像的分辨率为32x32像素。',
  '这个数据集是用于图像分类任务的标准基准。',
  '图像类别包括动物、交通工具、家具等。',
  '每张图像都有一个标签，指示它属于哪个类别。',
  '数据集已经被预处理和标准化，可以直接用于训练机器学习模型。',
  'CIFAR-10数据集是计算机视觉领域中最常用的数据集之一。',
  '这个数据集广泛用于研究图像分类、目标检测和图像生成等任务。',
  'CIFAR-10数据集的类别丰富多样，适合用于各种图像识别任务。',
  '这个数据集包含10个类别的彩色图像，是机器学习领域的经典数据集之一。',
  '图像类别包括猫、狗、汽车、飞机等。',
  'CIFAR-10数据集的图像已经被标注和分类。',
  '图像的质量和内容涵盖了多个现实世界的场景和对象。',
  '这个数据集可以用于测试图像分类算法的性能和准确度。',
  '每个图像都经过了大小标准化和预处理，以便于机器学习算法的处理。',
  'CIFAR-10数据集的图像经过了人工验证和筛选，确保了数据的质量和准确性。',
  '这个数据集是学术界和工业界广泛使用的基准测试集之一。',
  'CIFAR-10数据集的图像涵盖了多个角度和视角，具有一定的挑战性。',
  '该数据集包含了来自不同摄影师、场景和时间的图像。',
  '每个图像都包含了丰富的信息，可以用于各种计算机视觉任务。',
  '这个数据集的图像分布均匀，确保了各个类别的样本数量相近。',
  'CIFAR-10数据集已经成为了深度学习模型性能评估的标准数据集之一。',
  '图像的标签信息已经经过了严格的验证和审查，确保了数据的正确性。',
  '该数据集可以用于训练分类器、生成器和判别器等各种神经网络模型。',
  'CIFAR-10数据集已经被广泛用于教学和研究领域。',
  '这个数据集可以用于检验图像分类算法的鲁棒性和泛化能力。',
  '每个类别的图像都具有一定的变化和多样性。',
  'CIFAR-10数据集的图像已经经过了去噪和预处理，以便于机器学习算法的学习。',
  '这个数据集可以用于分析图像分类算法的错误模式和改进方向。',
  '图像的内容和主题涵盖了生活的各个方面和领域。',
  'CIFAR-10数据集的图像可以用于训练监督学习和无监督学习模型。',
  '每个图像都具有丰富的语义信息和视觉特征。',
  '该数据集包含了大量的真实世界图像样本。',
  'CIFAR-10数据集已经被广泛用于图像生成和风格迁移等任务。',
  '这个数据集可以用于测试和验证各种图像处理和增强算法。',
  '图像的标签信息是可靠和准确的。',
  'CIFAR-10数据集的图像来源于各种不同的来源和途径。',
  '该数据集是学术界和工业界研究的重要资源之一。',
  '这个数据集可以用于训练各种卷积神经网络模型。',
  '图像的分布是均匀的，确保了模型训练的有效性和准确性。',
  'CIFAR-10数据集的图像具有一定的挑战性和复杂性。',
  '每个图像都具有清晰的边界和特征。',
  '该数据集可以用于评估和比较不同图像分类算法的性能。',
  '图像的质量和清晰度都经过了严格的控制和测试。',
  'CIFAR-10数据集的图像是多样化和全面的。',
  '这个数据集可以用于研究图像分类模型的鲁棒性和稳定性。',
  '图像的类别和标签信息是完整和准确的。',
  '该数据集可以用于图像识别、检测和分割等任务。',
  'CIFAR-10数据集的图像是无偏的，确保了模型的泛化能力。',
  '每个图像都包含了丰富的颜色和纹理信息。',
  '这个数据集可以用于研究数据增强和样本平衡等技术。',
  '图像的内容和主题是多样化和丰富的。',
  'CIFAR-10数据集的图像可以用于训练端到端的深度学习模型。',
  '这个数据集包含来自10个不同类别的彩色图像。',
  '每个类别有大约6000张图像，共计60000张图像。',
  '图像的分辨率为32x32像素。',
  '这个数据集是用于图像分类任务的标准基准。',
  '图像类别包括动物、交通工具、家具等。',
  '每张图像都有一个标签，指示它属于哪个类别。',
  '数据集已经被预处理和标准化，可以直接用于训练机器学习模型。',
  'CIFAR-10数据集是计算机视觉领域中最常用的数据集之一。',
  '这个数据集广泛用于研究图像分类、目标检测和图像生成等任务。',
  'CIFAR-10数据集的类别丰富多样，适合用于各种图像识别任务。',
  '这个数据集具有较低的图像分辨率，但仍然是许多计算机视觉算法的重要基准。',
  'CIFAR-10数据集的类别包括猫、狗、鸟、飞机等常见物体。',
  '这个数据集被广泛用于测试深度学习模型的性能。',
  'CIFAR-10数据集的图像来自真实世界，具有一定的复杂性。',
  '数据集中的图像经过手工标注，确保了标签的准确性。',
  'CIFAR-10数据集是深度学习入门者和研究人员的首选。',
  '使用CIFAR-10数据集可以帮助研究人员理解和解决图像分类问题。',
  '这个数据集的图像经过归一化处理，使其适合用于各种深度学习模型。',
  'CIFAR-10数据集的类别之间存在一定程度的类内相似性和类间差异性。',
  '研究人员可以通过在CIFAR-10数据集上进行实验来评估他们的图像分类算法。',
  'CIFAR-10数据集是机器学习社区中最受欢迎的图像数据集之一。',
  '这个数据集包含了各种不同种类的物体，使其适合用于多任务学习。',
  'CIFAR-10数据集的图像质量较高，适合用于训练高质量的图像分类模型。',
  '这个数据集已经被用于许多研究项目和竞赛，如ImageNet挑战赛。',
  'CIFAR-10数据集是评估图像分类算法性能的基准之一。',
  '这个数据集的图像分布均匀，每个类别的样本数量相似。',
  'CIFAR-10数据集是用于评估迁移学习和数据增强方法的理想选择。',
  '研究人员可以通过在CIFAR-10数据集上进行实验来验证他们的研究成果。',
  '这个数据集中的图像具有不同的光照、角度和背景，使其更具挑战性。',
  'CIFAR-10数据集是用于评估卷积神经网络性能的重要基准。',
  '这个数据集的图像经过了严格的筛选和过滤，确保了质量的一致性。',
  'CIFAR-10数据集是机器学习研究领域中最具代表性的图像数据集之一。',
  '使用CIFAR-10数据集可以加速图像分类算法的开发和研究。',
  '这个数据集的图像覆盖了许多不同的场景和环境。',
  'CIFAR-10数据集的图像经过了严格的质量控制，确保了数据的可靠性。',
  '研究人员可以通过在CIFAR-10数据集上进行实验来比较不同算法的性能。',
  '这个数据集包含了各种各样的图像，使其适合用于多领域的研究项目。',
  'CIFAR-10数据集的类别具有一定的语义相关性，使其更易于理解和分析。',
  '这个数据集已经成为机器学习教育和培训的标准资料之一。',
  'CIFAR-10数据集是深度学习算法开发和测试的重要资源。',
  '这个数据集的图像包含了许多不同的物体形态和姿态。',
  'CIFAR-10数据集的图像经过了严格的分类和标注，确保了数据的准确性。',
  '研究人员可以通过在CIFAR-10数据集上进行实验来评估他们的模型的泛化能力。',
  '这个数据集的图像具有不同的图像质量和清晰度，使其更具挑战性。',
  'CIFAR-10数据集是评估图像分类算法鲁棒性的重要基准。',
  '这个数据集包含了许多不同种类的物体，使其适合用于多样化的研究项目。',
  'CIFAR-10数据集的图像涵盖了各种各样的环境和场景。'
]
const cifar10TrainingProjectDescriptions = [
  'CIFAR-10数据集是一个多样化的图像库，包含10种不同类别的小图像，非常适合用来训练图像识别模型。',
  '每个类别由6000张32x32像素的彩色图像组成，提供了一个平衡的数据基础，用于训练和验证算法。',
  '这个数据集经常被用作计算机视觉和深度学习研究的入门级挑战，是理解图像分类技术的理想材料。',
  'CIFAR-10提供了一个实验平台，研究人员可以在此基础上测试新的图像处理算法和神经网络架构。',
  '由于其多样性和复杂性，CIFAR-10数据集成为了机器学习社区中的一个标准测试集，用于评估模型的准确度和效率。',
  '项目目标包括提高分类准确率、降低过拟合和探索数据增强技术，以改善模型的泛化能力。',
  '通过在CIFAR-10数据集上的训练，研究人员可以掌握卷积神经网络(CNN)等先进图像识别技术。',
  '数据集的多样性要求模型能够识别从动物到交通工具等广泛的对象，这对算法的鲁棒性提出了挑战。',
  'CIFAR-10数据集广泛应用于学术界和工业界，帮助开发出更加高效和精确的图像识别工具。',
  '研究团队使用CIFAR-10数据集来探索深度学习中的关键问题，如网络架构设计、激活函数选择和优化算法。',
  'CIFAR-10的普及和应用促进了图像分类技术的快速发展，为自动驾驶、医疗成像和安全监控等领域奠定了基础。',
  '这个数据集不仅适用于经典的监督学习任务，还可以用于半监督学习、无监督学习和迁移学习的研究。',
  'CIFAR-10的应用案例包括图像自动标注、内容检索和对象识别，展示了深度学习技术的多样性和潜力。',
  '项目中使用CIFAR-10数据集进行实验，可以帮助新手理解数据预处理、模型训练和评估指标等基本概念。',
  '数据集的标准化和公开可用性确保了实验结果的可重复性和比较性，促进了科学研究的透明度和进步。',
  'CIFAR-10挑战不仅在于提高分类精度，还在于如何有效地处理计算资源，实现快速的训练速度和低延迟的推断。',
  '该数据集被用作基准，以评估和比较不同图像分类技术的性能，包括传统的机器学习方法和最新的深度学习模型。'
]

// 使用随机函数从数组中选择一个单词并添加随机数
function getRandomWord(set) {
  const randomWord = set[Math.floor(Math.random() * set.length)]
  const randomNumber = Math.floor(Math.random() * 1000) // 生成一个0到999之间的随机数
  return `${randomWord}_${randomNumber}`
}

// 使用随机函数从数组中选择一个句子
function getRandomSentence(set) {
  return set[Math.floor(Math.random() * set.length)]
}

function generateRandomDateTime() {
  const startDate = new Date('2024-02-25')
  const endDate = new Date('2024-03-05')
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  const randomDateTime = new Date(randomTime)
  // 将日期时间格式化为字符串
  const formattedDateTime = randomDateTime.toISOString().split('T')[0] + ' ' + randomDateTime.toTimeString().split(' ')[0]
  return formattedDateTime
}

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    idcode: '@guid', // 生成唯一标识符
    simple_name: getRandomWord(cifar10Words), // 生成随机单词作为名称
    set: '横向建模', // 生成1到10之间的随机整数作为集合编号
    source: '@url', // 生成随机URL作为来源
    origin_name: '@simple_name', // 生成随机单词作为原始名称
    data_count: '@integer(1, 100)', // 生成1到100之间的随机整数作为数据计数
    description: getRandomSentence(cifar10Descriptions), // 生成随机句子作为描述
    join_count: '@integer(1, 50)', // 生成1到50之间的随机整数作为加入数量
    update_time: generateRandomDateTime(), // 生成随机日期时间作为更新时间
    path: '@url', // 生成随机URL作为路径
    is_upload: '@boolean', // 随机生成布尔值作为是否上传标识
    origin: '@name', // 生成随机单词作为来源
    is_apply: '@boolean', // 随机生成布尔值作为是否申请标识
    usage: '深度神经网络', // 固定字符串作为使用
    deadline: generateRandomDateTime(), // 生成随机日期时间作为截止日期
    is_agree: '@pick(["yes", "no", "unhandle"])' // 从数组中随机选择一个状态作为同意状态
  }))
}

const List2 = [] // 确保List数组被初始化

for (let i = 0; i < 100; i++) {
  List2.push(Mock.mock({
    name: getRandomWord(similarCifar10Categories), // 生成随机单词作为名称
    author: 'admin', // 作者固定为'admin'
    'cooperator|1-5': ['@name'],
    description: getRandomSentence(cifar10TrainingProjectDescriptions), // 生成随机句子作为描述
    lastTime: generateRandomDateTime(), // 生成随机日期时间作为最后一次时间
    type: '横向建模', // 从数组中随机选择一个类型
    startTime: generateRandomDateTime() // 生成随机日期时间作为开始时间
  }))
}

const List3 = [] // 确保list3数组被初始化

for (let i = 0; i < 5; i++) {
  List3.push(Mock.mock({
    name: getRandomWord(similarCifar10Task), // 生成随机单词作为名称，假设原始数据中未定义则使用随机单词
    type: '横向建模', // 从数组中随机选择一个类型
    author: 'admin', // 作者固定为'admin'
    'cooperator|1-5': ['@name'],
    startTime: generateRandomDateTime() // 生成随机日期作为开始时间
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
      const { page = 1, limit = 20 } = config.query
      const pageList = List.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: List.length,
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
      const { page = 1, limit = 20 } = config.query

      const pageList = List.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: List.length,
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

