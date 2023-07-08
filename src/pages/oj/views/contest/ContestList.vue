<template>
  <div class="main-content">
    <Panel id="contest-card">
      <div slot="title">{{query.rule_type === '' ? this.$i18n.t('m.All') : query.rule_type}} {{$t('m.Contests')}}</div>
      <div slot="extra">
        <ul class="filter">
          <!-- 只有acm赛制，去掉赛制筛选 -->
          <!-- <li>
            <Dropdown @on-click="onRuleChange">
              <span>{{query.rule_type === '' ? this.$i18n.t('m.Rule') : this.$i18n.t('m.' + query.rule_type)}}
                <Icon type="arrow-down-b"></Icon>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item name="">{{$t('m.All')}}</Dropdown-item>
                <Dropdown-item name="OI">{{$t('m.OI')}}</Dropdown-item>
                <Dropdown-item name="ACM">{{$t('m.ACM')}}</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </li> -->
          <li>
            <Dropdown @on-click="onStatusChange">
              <span>{{query.status === '' ? this.$i18n.t('m.Status') : this.$i18n.t('m.' + CONTEST_STATUS_REVERSE[query.status].name.replace(/ /g,"_"))}}
                <Icon type="arrow-down-b"></Icon>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item name="">{{$t('m.All')}}</Dropdown-item>
                <Dropdown-item name="0">{{$t('m.Underway')}}</Dropdown-item>
                <Dropdown-item name="1">{{$t('m.Not_Started')}}</Dropdown-item>
                <Dropdown-item name="-1">{{$t('m.Ended')}}</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </li>
          <li>
            <Input id="keyword" @on-enter="changeRoute" @on-click="changeRoute" v-model="query.keyword"
                   icon="ios-search-strong" placeholder="Keyword"/>
          </li>
          <li>
              <Button type="primary" @click="changeRoute" shape="circle" >
                <Icon type="search"></Icon>
                {{$t('m.Search')}}
              </Button>
          </li>
        </ul>
      </div>
      <p id="no-contest" v-if="contests.length == 0">{{$t('m.No_contest')}}</p>
      <ol id="contest-list">
        <li v-for="contest in contests" :key="contest.title">
          <Row type="flex" justify="space-between" align="middle">
            <Col class="image-wrapper">
              <img class="trophy" src="../../../../assets/notice.png"/>
            </Col>
            <Col class="contest-main">
            <p class="title">
              <a class="entry" @click.stop="goContest(contest)">
                {{contest.title}}
              </a>
              <template v-if="contest.contest_type != 'Public'">
                <Icon type="ios-locked-outline" size="20"></Icon>
              </template>
            </p>
            <p class="date-time">
                {{contest.start_time | localtime('YYYY-M-D HH:mm') }}
            </p>
            <div class="detail">
              <span v-if="contest.created_by && contest.created_by.username" class="creator">
                {{$t('m.Creator')}}:{{contest.created_by.username}}
              </span>
              <span  class="rule-tag">{{contest.rule_type}}</span>
            </div>
            </Col>
            <Col class="status-wrapper" style="text-align: center">
              <Tag  
                :color="CONTEST_STATUS_REVERSE[contest.status].color"
                :type="CONTEST_STATUS_REVERSE[contest.status].type"
                class="status-tag"
              >
                {{$t('m.' + CONTEST_STATUS_REVERSE[contest.status].name.replace(/ /g, "_"))}}
              </Tag>
            </Col>
          </Row>
        </li>
      </ol>
    </Panel>
    <Pagination :total="total" :page-size.sync="limit" @on-change="changeRoute" :current.sync="page" :show-sizer="true" @on-page-size-change="changeRoute"></Pagination>
  </div>
</template>

<script>
  import api from '@oj/api'
  import { mapGetters } from 'vuex'
  import utils from '@/utils/utils'
  import Pagination from '@/pages/oj/components/Pagination'
  import time from '@/utils/time'
  import { CONTEST_STATUS_REVERSE, CONTEST_TYPE } from '@/utils/constants'

  const limit = 10

  export default {
    name: 'contest-list',
    components: {
      Pagination
    },
    data () {
      return {
        page: 1,
        query: {
          status: '',
          keyword: '',
          rule_type: ''
        },
        limit: limit,
        total: 0,
        rows: '',
        contests: [],
        CONTEST_STATUS_REVERSE: CONTEST_STATUS_REVERSE,
//      for password modal use
        cur_contest_id: ''
      }
    },
    beforeRouteEnter (to, from, next) {
      api.getContestList(0, limit).then((res) => {
        next((vm) => {
          vm.contests = res.data.data.results
          vm.total = res.data.data.total
        })
      }, (res) => {
        next()
      })
    },
    methods: {
      init () {
        let route = this.$route.query
        this.query.status = route.status || ''
        this.query.rule_type = route.rule_type || ''
        this.query.keyword = route.keyword || ''
        this.page = parseInt(route.page) || 1
        this.limit = parseInt(route.limit) || 10
        this.getContestList(this.page)
      },
      getContestList (page = 1) {
        let offset = (page - 1) * this.limit
        api.getContestList(offset, this.limit, this.query).then((res) => {
          this.contests = res.data.data.results
          this.total = res.data.data.total
        })
      },
      changeRoute () {
        let query = Object.assign({}, this.query)
        query.page = this.page
        query.limit = this.limit

        this.$router.push({
          name: 'contest-list',
          query: utils.filterEmptyValue(query)
        })
      },
      onRuleChange (rule) {
        this.query.rule_type = rule
        this.page = 1
        this.changeRoute()
      },
      onStatusChange (status) {
        this.query.status = status
        this.page = 1
        this.changeRoute()
      },
      goContest (contest) {
        this.cur_contest_id = contest.id
        if (contest.contest_type !== CONTEST_TYPE.PUBLIC && !this.isAuthenticated) {
          this.$error(this.$i18n.t('m.Please_login_first'))
          this.$store.dispatch('changeModalStatus', {visible: true})
        } else {
          this.$router.push({name: 'contest-details', params: {contestID: contest.id}})
        }
      },

      getDuration (startTime, endTime) {
        return time.duration(startTime, endTime)
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'user'])
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init()
        }
      }
    }

  }
</script>
<style lang="less" scoped>
  #contest-card {
    #no-contest {
      text-align: center;
      font-size: 16px;
      padding: 20px;
    }
    #contest-list {
      > li {
        padding: 30px 0;
        border-bottom: 1px solid rgba(187, 187, 187, 0.5);
        list-style: none;

        .image-wrapper{
          padding-right: 32px;
          .trophy {
            height: 87px;
            width: auto;
          }
        }
        .contest-main {
          flex:1;
          .title {
            font-size: 20px;
            height: 28px;
            line-height: 28px;
            a.entry {
              color: #000;
              &:hover {
                color: @color-theme;
              }
            }
          }
          .date-time{
            color: #999999;
            font-size: 14px;
            height: 20px;
            line-height: 20px;
          }
          .detail {
            display: flex;
            align-items: center;
            margin-top: 20px;
            .creator{
              color: #000;
              font-size: 16px;
              height: 22px;
              margin-right: 10px;
              line-height: 22px;
            }
            .rule-tag{
              font-size: 12px;
              padding: 1px 10px;
              background: #f3f3f3;
              border-radius: 10px;
              line-height: 16px;
              border: 1px solid #DDDDDD;
            }
          }
        }
        .status-wrapper{
          padding-left: 32px;
          .status-tag{
            cursor:default;
            width: 120px;
            height: 40px;
            border-radius: 20px;
            line-height: 40px;
            
          }
        }
      }
    }
  }
</style>
