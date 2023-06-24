<template>
  <Row type="flex"  :gutter="20">
    <Col :span="18">
      <div class="main-content">
      <Panel shadow>
        <div slot="title">{{$t('m.Problem_List')}}</div>
        <div slot="extra">
          <ul class="filter">
            <li>
              <Dropdown @on-click="filterByDifficulty">
                <span>{{query.difficulty === '' ? this.$i18n.t('m.Difficulty') : this.$i18n.t('m.' + query.difficulty)}}
                  <Icon type="arrow-down-b"></Icon>
                </span>
                <Dropdown-menu slot="list">
                  <Dropdown-item name="">{{$t('m.All')}}</Dropdown-item>
                  <Dropdown-item name="Low">{{$t('m.Low')}}</Dropdown-item>
                  <Dropdown-item name="Mid" >{{$t('m.Mid')}}</Dropdown-item>
                  <Dropdown-item name="High">{{$t('m.High')}}</Dropdown-item>
                </Dropdown-menu>
              </Dropdown>
            </li>
            <li>
              <i-switch size="large" @on-change="handleTagsVisible">
                <span slot="open">{{$t('m.Tags')}}</span>
                <span slot="close">{{$t('m.Tags')}}</span>
              </i-switch>
            </li>
            <li>
              <Input v-model="query.keyword"
                    @on-enter="filterByKeyword"
                    @on-click="filterByKeyword"
                    placeholder="keyword"
                    icon="ios-search-strong"/>
            </li>
            <li>
              <Button type="primary" @click="filterByKeyword" shape="circle" >
                <Icon type="search"></Icon>
                {{$t('m.Search')}}
              </Button>
              <Button @click="onReset" shape="circle" >
                <Icon type="refresh"></Icon>
                {{$t('m.Reset')}}
              </Button>
            </li>
          </ul>
        </div>
        <Table style="width: 100%; font-size: 16px;"
              :columns="problemTableColumns"
              :data="problemList"
              :loading="loadings.table" :border="false"></Table>
      </Panel>
      <Pagination
        class="problem-pagination"
        :total="total" :page-size.sync="query.limit" 
        @on-change="pushRouter" @on-page-size-change="pushRouter" 
        :current.sync="query.page" :show-sizer="true"
      ></Pagination>
      </div>
    </Col>

    <Col :span="6">
      <div class="tag-content">
      <Panel :padding="0">
        <div slot="title">{{$t('m.Tags')}}</div>
        <Button v-for="tag in tagList"
                :key="tag.name"
                class="tag-btn" 
                :class="{'tag-btn-checked':checkedMap[tag.id]}"
                @click="filterByTag(tag)">{{tag.name}}</Button>

        <Button long id="pick-one" @click="pickone">
          <Icon type="shuffle"></Icon>
          {{$t('m.Pick_One')}}
        </Button>
      </Panel>
      <Spin v-if="loadings.tag" fix size="large"></Spin>
      </div>
    </Col>
  </Row>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from '@oj/api'
  import utils from '@/utils/utils'
  import { ProblemMixin } from '@oj/components/mixins'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'ProblemList',
    mixins: [ProblemMixin],
    components: {
      Pagination
    },
    data () {
      return {
        tagList: [],
        checkedMap: {},
        problemTableColumns: [
          {
            title: '#',
            key: '_id',
            align: 'center',
            width: 50,
            render: (h, params) => {
              return h('span', {
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'problem-details', params: {problemID: params.row._id}})
                  }
                }
              }, params.row._id)
            }
          },
          {
            title: this.$i18n.t('m.Title'),
            width: 200,
            render: (h, params) => {
              return h('span', {
                on: {
                  click: () => {
                    this.$router.push({name: 'problem-details', params: {problemID: params.row._id}})
                  }
                },
                class: {
                  'text-ellipsis': true
                },
                style: {
                  cursor: 'pointer'
                }
              }, params.row.title)
            }
          },
          {
            title: this.$i18n.t('m.Level'),
            render: (h, params) => {
              let t = params.row.difficulty
              let color = 'blue'
              if (t === 'Low') color = 'green'
              else if (t === 'High') color = 'yellow'
              return h('Tag', {
                props: {
                  color: color
                }
              }, this.$i18n.t('m.' + params.row.difficulty))
            }
          },
          {
            title: this.$i18n.t('m.Total'),
            key: 'submission_number'
          },
          {
            title: this.$i18n.t('m.AC_Rate'),
            render: (h, params) => {
              return h('span', this.getACRate(params.row.accepted_number, params.row.submission_number))
            }
          }
        ],
        problemList: [],
        limit: 20,
        total: 0,
        loadings: {
          table: true,
          tag: true
        },
        routeName: '',
        query: {
          keyword: '',
          difficulty: '',
          tag: '',
          page: 1,
          limit: 10
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init (simulate = false) {
        this.routeName = this.$route.name
        let query = this.$route.query
        this.query.difficulty = query.difficulty || ''
        this.query.keyword = query.keyword || ''
        this.query.tag = query.tag || ''
        this.query.page = parseInt(query.page) || 1
        if (this.query.page < 1) {
          this.query.page = 1
        }
        this.query.limit = parseInt(query.limit) || 10
        if (!simulate) {
          this.getTagList()
        }
        this.getProblemList()
      },
      pushRouter () {
        this.$router.push({
          name: 'problem-list',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getProblemList () {
        let offset = (this.query.page - 1) * this.query.limit
        this.loadings.table = true
        api.getProblemList(offset, this.limit, this.query).then(res => {
          this.loadings.table = false
          this.total = res.data.data.total
          this.problemList = res.data.data.results
          if (this.isAuthenticated) {
            this.addStatusColumn(this.problemTableColumns, res.data.data.results)
          }
        }, res => {
          this.loadings.table = false
        })
      },
      getTagList () {
        api.getProblemTagList().then(res => {
          const list = res.data.data
          this.tagList = list
          // 初始化标签选中状态
          const queryTagName = this.query.tag
          list.forEach(item => {
            if (item.name === queryTagName) {
              this.checkedMap[item.id] = true
            } else {
              this.checkedMap[item.id] = false
            }
          })
          this.loadings.tag = false
        }, res => {
          this.loadings.tag = false
        })
      },
      filterByTag (tagInfo) {
        const {id: tagId, name: tagName} = tagInfo
        this.checkedMap = {}
        if (this.query.tag === tagName) {
          this.checkedMap[tagId] = false
          this.query.tag = ''
        } else {
          this.checkedMap[tagId] = true
          this.query.tag = tagName
        }
        this.query.page = 1
        this.pushRouter()
      },
      filterByDifficulty (difficulty) {
        this.query.difficulty = difficulty
        this.query.page = 1
        this.pushRouter()
      },
      filterByKeyword () {
        this.query.page = 1
        this.pushRouter()
      },
      handleTagsVisible (value) {
        if (value) {
          this.problemTableColumns.push(
            {
              title: this.$i18n.t('m.Tags'),
              align: 'center',
              render: (h, params) => {
                let tags = []
                params.row.tags.forEach(tag => {
                  tags.push(h('Tag', {}, tag))
                })
                return h('div', {
                  style: {
                    margin: '8px 0'
                  }
                }, tags)
              }
            })
        } else {
          this.problemTableColumns.splice(this.problemTableColumns.length - 1, 1)
        }
      },
      onReset () {
        this.$router.push({name: 'problem-list'})
      },
      pickone () {
        api.pickone().then(res => {
          this.$success('Good Luck')
          this.$router.push({name: 'problem-details', params: {problemID: res.data.data}})
        })
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated'])
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init(true)
        }
      },
      'isAuthenticated' (newVal) {
        if (newVal === true) {
          this.init()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @color-theme: #5363ED;
  .tag-btn {
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 15px;
    font-size: 10px !important;
    &.tag-btn-checked{
      background:@color-theme;
      border: 1px solid @color-theme;
      color: #fff;
      &:focus{
        color: #fff !important;
      }
    }
    &:focus{
      color: @color-theme;
    }
  }

  #pick-one {
    margin: 10px 0;
  }
  .tag-content{
    background: #fff;
    padding: 24px 16px 0 16px;
  }
  .main-content{
    .problem-pagination{
      margin: 0;
      float: none;
      padding: 20px 0;
      text-align: right;
    }
  }
</style>
