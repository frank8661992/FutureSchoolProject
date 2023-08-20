const pieColorMap = {
  '正确': {color: '#5363ED'},
  '错误': {color: '#53C2ED'},
  '超时': {color: '#ff9300'},
  '超出内存限制': {color: '#f7de00'},
  '运行时出错': {color: '#ff6104'},
  '编译错误': {color: '#f7ac04'},
  '部分正确': {color: '#2d8cf0'}
}

const legendStyle = {
  left: 'center',
  orient: 'horizontal',
  itemWidth: 8,
  itemGap: 40,
  icon: 'circle'
}

function getItemColor (obj) {
  return pieColorMap[obj.name].color
}

const pie = {
  legend: {
    ...legendStyle,
    data: ['正确', '错误']
  },
  series: [
    {
      name: 'Summary',
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: {
        normal: {
          color: getItemColor,
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        }
      },
      data: [
        {value: 0, name: '错误'},
        {value: 0, name: '正确'}
      ],
      label: {
        normal: {
          position: 'inner', // 数据会显示在图形上
          show: true,
          formatter: '{c}',
          textStyle: {
            fontWeight: 'bold'
          }
        }
      }
    }
  ]
}

const largePie = {
  legend: {
    ...legendStyle,
    data:
      ['正确', '运行时出错', '错误', '超时', '部分正确', '超出内存限制']
  },
  series: [
    {
      name: 'Detail',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: 0, name: '运行时出错'},
        {value: 0, name: '错误'},
        {value: 0, name: '超时'},
        {value: 0, name: '正确'},
        {value: 0, name: '超出内存限制'},
        {value: 0, name: '部分正确'}
      ],
      label: {
        normal: {
          formatter: '{b}: {c}\n {d}%'
        }
      },
      labelLine: {
        normal: {}
      }
    },
    {
      name: 'Summary',
      type: 'pie',
      radius: '30%',
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: '0', name: '错误'},
        {value: 0, name: '正确', selected: true}
      ],
      label: {
        normal: {
          position: 'inner',
          formatter: '{b}: {c}\n {d}%'
        }
      }
    }
  ]
}

export { pie, largePie }
