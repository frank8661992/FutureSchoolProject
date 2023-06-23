<template>
  <div>
    <Panel>
      <div slot="title">{{$t('m.ACM_Ranklist')}}</div>
      <div class="echarts">
        <ECharts :options="options" ref="chart" auto-resize></ECharts>
      </div>
    </Panel>
    <Table :data="dataRank" :columns="columns" :loading="loadingTable" class="table-wrapper" :border="false"></Table>
    <Pagination :total="total" :page-size.sync="limit" :current.sync="page"
                @on-change="getRankData" show-sizer
                @on-page-size-change="getRankData(1)"></Pagination>
  </div>
</template>

<script>
  import api from '@oj/api'
  import Pagination from '@oj/components/Pagination'
  import utils from '@/utils/utils'
  import { RULE_TYPE } from '@/utils/constants'

  export default {
    name: 'acm-rank',
    components: {
      Pagination
    },
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loadingTable: false,
        dataRank: [],
        mainColor: '#5363ED',
        columns: [
          {
            align: 'center',
            width: 60,
            render: (h, params) => {
              return h('span', {}, params.index + (this.page - 1) * this.limit + 1)
            }
          },
          {
            title: this.$i18n.t('m.User_User'),
            align: 'left',
            render: (h, params) => {
              return h('span', {
                class: {
                  'link-color': true
                },
                style: {
                  'display': 'inline-block',
                  'max-width': '200px',
                  'color': this.mainColor
                },
                on: {
                  click: () => {
                    this.$router.push(
                      {
                        name: 'user-home',
                        query: {username: params.row.user.username}
                      })
                  }
                }
              }, params.row.user.username)
            }
          },
          {
            title: this.$i18n.t('m.mood'),
            align: 'left',
            key: 'mood',
            render: (h, params) => {
              const moodText = params.row.mood || ''
              if (moodText.length > 22) {
                return h('Tooltip', {
                  props: {
                    'placement': 'top-start',
                    'delay': 1000
                  }
                }, [
                  h('span', {
                    class: {
                      'text-ellipsis': true
                    },
                    style: {
                      width: '290px'
                    }
                  }, moodText),
                  h('div', {
                    slot: 'content',
                    style: {
                      'white-space': 'normal'
                    }
                  }, moodText)
                ])
              }
              return h('div', {
                slot: 'content',
                style: {
                  'white-space': 'normal'
                }
              }, params.row.mood)
            },
            width: 300
          },
          {
            title: this.$i18n.t('m.AC'),
            align: 'left',
            key: 'accepted_number'
          },
          {
            title: this.$i18n.t('m.Total'),
            align: 'left',
            key: 'submission_number'
          },
          {
            title: this.$i18n.t('m.Rating'),
            align: 'left',
            render: (h, params) => {
              return h('span', utils.getACRate(params.row.accepted_number, params.row.submission_number))
            }
          }
        ],
        options: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: [this.$i18n.t('m.AC'), this.$i18n.t('m.Total')],
            left: '0%',
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 20
          },
          grid: {
            x: '3%',
            x2: '3%'
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: {
                show: true,
                readOnly: true,
                buttonColor: this.mainColor
              },
              magicType: {
                show: true,
                type: ['line', 'bar', 'stack'],
                icon: {
                  line: 'path://M56.888889 938.666667V56.888889h56.888889v853.333333h853.333333v56.888889H56.888889z" fill="#333333" p-id="2646"></path><path d="M193.422222 648.533333l-45.511111-45.511111L398.222222 358.4l199.111111 199.111111 347.022223-352.711111 45.511111 45.511111-392.533334 386.844445L398.222222 438.044444z'
                }
              },
              restore: { show: true },
              saveAsImage: {
                show: true,
                icon: 'path://M840.5 900.3h-657c-16.5 0-29.9 13.4-29.9 29.9s13.4 29.9 29.9 29.9h657.1c16.5 0 29.9-13.4 29.9-29.9-0.1-16.6-13.5-29.9-30-29.9zM631.5 123.7V541.8H763.1L512 769.9l-251.2-228h131.7V123.7h239m0-59.7h-239c-33 0-59.7 26.7-59.7 59.7v358.4H183.5c-26.6 0-39.9 32.2-21.1 51l328.5 298.2c5.8 5.8 13.5 8.7 21.1 8.7s15.3-2.9 21.1-8.7l328.5-298.2c18.8-18.8 5.5-51-21.1-51H691.2V123.7c0-33-26.7-59.7-59.7-59.7z'
              }
            },
            right: '2%',
            itemSize: 11,
            emphasis: {
              iconStyle: {
                color: this.mainColor,
                borderColor: this.mainColor
              }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: ['root'],
              axisLabel: {
                interval: 0,
                showMinLabel: true,
                showMaxLabel: true,
                align: 'center',
                formatter: (value, index) => {
                  return utils.breakLongWords(value, 10)
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: this.$i18n.t('m.AC'),
              type: 'bar',
              data: [0],
              markPoint: {
                data: [
                  {type: 'max', name: 'max'}
                ]
              },
              itemStyle: {
                normal: {color: '#5363ED'}
              },
              barWidth: '30%',
              barGap: '20%'
            },
            {
              name: this.$i18n.t('m.Total'),
              type: 'bar',
              data: [0],
              markPoint: {
                data: [
                  {type: 'max', name: 'max'}
                ]
              },
              itemStyle: {
                normal: {color: '#43B0EA'}
              },
              barWidth: '30%'
            }
          ]
        }
      }
    },
    mounted () {
      this.getRankData(1)
    },
    methods: {
      getRankData (page) {
        let offset = (page - 1) * this.limit
        let bar = this.$refs.chart
        bar.showLoading({
          maskColor: 'rgba(250, 250, 250, 0.8)',
          color: this.mainColor
        })
        this.loadingTable = true
        api.getUserRank(offset, this.limit, RULE_TYPE.ACM).then(res => {
          this.loadingTable = false

          // ady mock data
          res.data.data = {results: [{
            user: {username: 'ady1'},
            accepted_number: 10,
            submission_number: 15,
            mood: '就算前进的路再苦，也比站在原地更接近幸福,就算前进的路再苦，也比站在原地更接近幸福就算前进的路再苦，也比站在原地更接近幸福'
          }, {
            user: {username: 'ady2'},
            accepted_number: 20,
            submission_number: 25,
            mood: '就算前进的路再苦，也比站在原地更接近幸福'
          }, {
            user: {username: 'ady3'},
            accepted_number: 30,
            submission_number: 35,
            mood: '就算前进的路再苦，也比站在原地更接近幸福,也比'
          }, {
            user: {username: 'ady4'},
            accepted_number: 30,
            submission_number: 35,
            mood: '就算前进的路再苦，也比站在原地更接近幸福,也比站'
          }, {
            user: {username: 'ady5'},
            accepted_number: 25,
            submission_number: 35,
            mood: '就算前进的路再苦，也比站在原地更接近幸福,也比站在'
          }, {
            user: {username: 'ady6'},
            accepted_number: 10,
            submission_number: 25
          }, {
            user: {username: 'ady7'},
            accepted_number: 20,
            submission_number: 35
          }, {
            user: {username: 'ady8'},
            accepted_number: 40,
            submission_number: 40
          }, {
            user: {username: 'ady9'},
            accepted_number: 10,
            submission_number: 25
          }, {
            user: {username: 'ady10'},
            accepted_number: 20,
            submission_number: 45
          }],
            total: 20}
  
          if (page === 1) {
            this.changeCharts(res.data.data.results.slice(0, 10))
          }
          this.total = res.data.data.total
          this.dataRank = res.data.data.results
          bar.hideLoading()
        }).catch(() => {
          this.loadingTable = false
          bar.hideLoading()
        })
      },
      changeCharts (rankData) {
        let [usernames, acData, totalData] = [[], [], []]
        rankData.forEach(ele => {
          usernames.push(ele.user.username)
          acData.push(ele.accepted_number)
          totalData.push(ele.submission_number)
        })
        this.options.xAxis[0].data = usernames
        this.options.series[0].data = acData
        this.options.series[1].data = totalData
      }
    }
  }
</script>

<style scoped lang="less">
  .echarts {
    width: 100%;
    height: 245px;
  }
  .table-wrapper{
    margin-top: -20px;
  }
</style>
