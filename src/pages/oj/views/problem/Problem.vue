<template>
  <Row type="flex"  :gutter="20">
    <Col :span="18">
      <!--problem main-->
      <div class="main-content padding-bottom-20">
        <Panel>
          <div slot="title">{{problem.title}}</div>
          <div id="problem-content" class="markdown-body" v-katex>
            <div class="one-item">
              <p class="title">{{$t('m.Description')}}</p>
              <p class="content" v-html=problem.description></p>
            </div>
            <div class="one-item">
              <p class="title">{{$t('m.Input')}} <span v-if="problem.io_mode.io_mode=='File IO'">({{$t('m.FromFile')}}: {{ problem.io_mode.input }})</span></p>
              <p class="content" v-html=problem.input_description></p>
            </div>

            <div class="one-item">
              <p class="title">{{$t('m.Output')}} <span v-if="problem.io_mode.io_mode=='File IO'">({{$t('m.ToFile')}}: {{ problem.io_mode.output }})</span></p>
              <p class="content" v-html=problem.output_description></p>
            </div>

            <div v-for="(sample, index) of problem.samples" :key="index">
              <div class="sample mb6">
                <div class="sample-input">
                  <p class="title">{{$t('m.Sample_Input')}} {{index + 1}}：</p>
                  <pre>{{sample.input}}</pre>
                    <a class="copy"
                      v-clipboard:copy="sample.input"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onCopyError">
                      <Icon type="ios-copy-outline" />
                    </a>
                </div>
                <div class="sample-output">
                  <p class="title">{{$t('m.Sample_Output')}} {{index + 1}}：</p>
                  <pre>{{sample.output}}</pre>
                </div>
              </div>
            </div>

            <div v-if="problem.hint" class="mb6">
              <p class="title">{{$t('m.Hint')}}：</p>
              <Card dis-hover :padding="8">
                <div class="hint-content" v-html=problem.hint></div>
              </Card>
            </div>

            <div v-if="problem.source" class="mb6">
              <p class="title">{{$t('m.Source')}}：</p>
              <pre>{{problem.source}}</pre>
            </div>

          </div>
        </Panel>
      </div>
      <!--problem main end-->
      <div id="submit-code">
        <CodeMirror :value.sync="code"
                    :languages="problem.languages"
                    :language="language"
                    :theme="theme"
                    @resetCode="onResetToTemplate"
                    @changeTheme="onChangeTheme"
                    @changeLang="onChangeLang"></CodeMirror>
        <Row type="flex" justify="space-between">
          <Col>
            <div class="status" v-if="statusVisible">
              <template v-if="!this.contestID || (this.contestID && OIContestRealTimePermission)">
                <span>{{$t('m.Status')}}</span>
                <Tag type="dot" :color="submissionStatus.color" @click.native="handleRoute('/status/'+submissionId)">
                  {{$t('m.' + submissionStatus.text.replace(/ /g, "_"))}}
                </Tag>
              </template>
              <template v-else-if="this.contestID && !OIContestRealTimePermission">
                <Alert type="success" show-icon>{{$t('m.Submitted_successfully')}}</Alert>
              </template>
            </div>
            <div v-else-if="problem.my_status === 0">
              <Alert type="success" show-icon>{{$t('m.You_have_solved_the_problem')}}</Alert>
            </div>
            <div v-else-if="this.contestID && !OIContestRealTimePermission && submissionExists">
              <Alert type="success" show-icon>{{$t('m.You_have_submitted_a_solution')}}</Alert>
            </div>
            <div v-if="contestEnded">
              <Alert type="warning" show-icon>{{$t('m.Contest_has_ended')}}</Alert>
            </div>
          </Col>

          <Col :span="12">
            <template v-if="captchaRequired">
              <div class="captcha-container">
                <Tooltip v-if="captchaRequired" content="Click to refresh" placement="top">
                  <img :src="captchaSrc" @click="getCaptchaSrc"/>
                </Tooltip>
                <Input v-model="captchaCode" class="captcha-code"/>
              </div>
            </template>
            <Button type="primary" :loading="submitting" @click="submitCode" shape="circle"
                    :disabled="problemSubmitDisabled || submitted"
                    class="fl-right submit-button">
              <span v-if="submitting">{{$t('m.Submitting')}}</span>
              <span v-else>{{$t('m.Submit')}}</span>
            </Button>
          </Col>
        </Row>
      </div>
    </Col>

    <Col :span="6">
      <VerticalMenu @on-click="handleRoute" class="vertical-menu">
        <template v-if="this.contestID">
          <VerticalMenu-item class="vertical-menu-item" :route="{name: 'contest-problem-list', params: {contestID: contestID}}">
            <img src="../../../../assets/problem.svg" class="icon-img w19"/>
            <span class="menu-title">{{$t('m.Problems')}}</span>
          </VerticalMenu-item>

          <VerticalMenu-item class="vertical-menu-item"  :route="{name: 'contest-announcement-list', params: {contestID: contestID}}">
            <img src="../../../../assets/message.svg" class="icon-img w19"/>
            <span class="menu-title">{{$t('m.Announcements')}}</span>
          </VerticalMenu-item>
        </template>

        <VerticalMenu-item class="vertical-menu-item"  v-if="!this.contestID || OIContestRealTimePermission" :route="submissionRoute">
          <img src="../../../../assets/submit-info.svg" class="icon-img w19"/>
          <span class="menu-title">{{$t('m.Submissions')}}</span>
        </VerticalMenu-item>

        <template v-if="this.contestID">
          <VerticalMenu-item v-if="!this.contestID || OIContestRealTimePermission" class="vertical-menu-item"
                             :route="{name: 'contest-rank', params: {contestID: contestID}}">
            <img src="../../../../assets/rank.svg" class="icon-img w19"/>
            <span class="menu-title">{{$t('m.Rankings')}}</span>
          </VerticalMenu-item>
          <VerticalMenu-item :route="{name: 'contest-details', params: {contestID: contestID}}"  class="vertical-menu-item">
            <img src="../../../../assets/view-race.svg" class="icon-img w19"/>
            <span class="menu-title">{{$t('m.View_Contest')}}</span>
          </VerticalMenu-item>
        </template>
      </VerticalMenu>

      <Card id="info" :padding="0">
        <div slot="title" class="vertical-menu-item">
          <img src="../../../../assets/problem-info.svg" class="icon-img w19"/>
          <span class="menu-title">{{$t('m.Information')}}</span>
        </div>
        <ul>
          <li>
            <p>ID</p>
            <p>{{problem._id}}</p>
          </li>
          <li>
            <p>{{$t('m.Time_Limit')}}</p>
            <p>{{problem.time_limit}}MS</p>
          </li>
          <li>
            <p>{{$t('m.Memory_Limit')}}</p>
            <p>{{problem.memory_limit}}MB</p>
          </li>
          <li>
            <p>{{$t('m.IOMode')}}</p>
            <p>{{problem.io_mode.io_mode}}</p>
          </li>
          <li>
            <p>{{$t('m.Created')}}</p>
            <p>管理员</p>
          </li>
          <li v-if="problem.difficulty">
            <p>{{$t('m.Level')}}</p>
            <p>{{$t('m.' + problem.difficulty)}}</p>
          </li>
          <li v-if="problem.total_score">
            <p>{{$t('m.Score')}}</p>
            <p>{{problem.total_score}}</p>
          </li>
          <li>
            <p>{{$t('m.Tags')}}</p>
            <p>
              <Poptip trigger="hover" placement="left-end">
                <a>{{$t('m.Show')}}</a>
                <div slot="content">
                  <Tag v-for="tag in problem.tags" :key="tag">{{tag}}</Tag>
                </div>
              </Poptip>
            </p>
          </li>
        </ul>
      </Card>

      <Card id="pieChart" :padding="0" v-if="!this.contestID || OIContestRealTimePermission">
        <div slot="title" class="title-line">
          <div class="title-wrapper vertical-menu-item">
            <img src="../../../../assets/count.svg" class="icon-img w19"/>  
            <span class="menu-title">{{$t('m.Statistic')}}</span>
          </div>
          <Button type="ghost" shape="circle" @click="graphVisible = !graphVisible"><span>详情</span></Button>
        </div>
        <div class="echarts">
          <ECharts :options="pie"></ECharts>
        </div>
      </Card>
    </Col>

    <Modal v-model="graphVisible">
      <div id="pieChart-detail">
        <ECharts :options="largePie" :initOptions="largePieInitOpts"></ECharts>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="graphVisible=false">{{$t('m.Close')}}</Button>
      </div>
    </Modal>
  </Row>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {types} from '../../../../store'
  import CodeMirror from '@oj/components/CodeMirror.vue'
  import storage from '@/utils/storage'
  import {FormMixin} from '@oj/components/mixins'
  import {JUDGE_STATUS, CONTEST_STATUS, buildProblemCodeKey} from '@/utils/constants'
  import api from '@oj/api'
  import {pie, largePie} from './chartData'

  // 只显示这些状态的图形占用
  const filtedStatus = ['-1', '-2', '0', '1', '2', '3', '4', '8']

  export default {
    name: 'Problem',
    components: {
      CodeMirror
    },
    mixins: [FormMixin],
    data () {
      return {
        statusVisible: false,
        captchaRequired: false,
        graphVisible: false,
        submissionExists: false,
        captchaCode: '',
        captchaSrc: '',
        contestID: '',
        problemID: '',
        submitting: false,
        code: '',
        language: 'C++',
        theme: 'solarized',
        submissionId: '',
        submitted: false,
        result: {
          result: 9
        },
        problem: {
          title: '',
          description: '',
          hint: '',
          my_status: '',
          template: {},
          languages: [],
          created_by: {
            username: ''
          },
          tags: [],
          io_mode: {'io_mode': 'Standard IO'}
        },
        pie: pie,
        largePie: largePie,
        // echarts 无法获取隐藏dom的大小，需手动指定
        largePieInitOpts: {
          width: '500',
          height: '480'
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      let problemCode = storage.get(buildProblemCodeKey(to.params.problemID, to.params.contestID))
      if (problemCode) {
        next(vm => {
          vm.language = problemCode.language
          vm.code = problemCode.code
          vm.theme = problemCode.theme
        })
      } else {
        next()
      }
    },
    mounted () {
      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: false})
      this.init()
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      init () {
        this.$Loading.start()
        this.contestID = this.$route.params.contestID
        this.problemID = this.$route.params.problemID
        let func = this.$route.name === 'problem-details' ? 'getProblem' : 'getContestProblem'
        api[func](this.problemID, this.contestID).then(res => {
          this.$Loading.finish()
          let problem = res.data.data
          this.changeDomTitle({title: problem.title})
          api.submissionExists(problem.id).then(res => {
            this.submissionExists = res.data.data
          })
          problem.languages = problem.languages.sort()
          this.problem = problem
          if (problem.statistic_info) {
            this.changePie(problem)
          }

          // 在beforeRouteEnter中修改了, 说明本地有code，无需加载template
          if (this.code !== '') {
            return
          }
          // try to load problem template
          this.language = this.problem.languages[0]
          let template = this.problem.template
          if (template && template[this.language]) {
            this.code = template[this.language]
          }
        }, () => {
          this.$Loading.error()
        })
      },
      changePie (problemData) {
        // 只显示特定的一些状态
        for (let k in problemData.statistic_info) {
          if (filtedStatus.indexOf(k) === -1) {
            delete problemData.statistic_info[k]
          }
        }
        let acNum = problemData.accepted_number
        let data = [
          {name: '错误', value: problemData.submission_number - acNum},
          {name: '正确', value: acNum}
        ]
        this.pie.series[0].data = data
        // 只把大图的AC selected下，这里需要做一下deepcopy
        let data2 = JSON.parse(JSON.stringify(data))
        data2[1].selected = true
        this.largePie.series[1].data = data2

        // 根据结果设置legend,没有提交过的legend不显示
        let legend = Object.keys(problemData.statistic_info).map(ele => JUDGE_STATUS[ele].name)
        if (legend.length === 0) {
          legend.push('正确', '错误')
        }
        this.largePie.legend.data = legend

        // 把ac的数据提取出来放在最后
        let acCount = problemData.statistic_info['0']
        delete problemData.statistic_info['0']

        let largePieData = []
        Object.keys(problemData.statistic_info).forEach(ele => {
          largePieData.push({name: JUDGE_STATUS[ele].name, value: problemData.statistic_info[ele]})
        })
        largePieData.push({name: '正确', value: acCount})
        this.largePie.series[0].data = largePieData
      },
      handleRoute (route) {
        this.$router.push(route)
      },
      onChangeLang (newLang) {
        if (this.problem.template[newLang]) {
          if (this.code.trim() === '') {
            this.code = this.problem.template[newLang]
          }
        }
        this.language = newLang
      },
      onChangeTheme (newTheme) {
        this.theme = newTheme
      },
      onResetToTemplate () {
        this.$Modal.confirm({
          content: this.$i18n.t('m.Are_you_sure_you_want_to_reset_your_code'),
          onOk: () => {
            let template = this.problem.template
            if (template && template[this.language]) {
              this.code = template[this.language]
            } else {
              this.code = ''
            }
          }
        })
      },
      checkSubmissionStatus () {
        // 使用setTimeout避免一些问题
        if (this.refreshStatus) {
          // 如果之前的提交状态检查还没有停止,则停止,否则将会失去timeout的引用造成无限请求
          clearTimeout(this.refreshStatus)
        }
        const checkStatus = () => {
          let id = this.submissionId
          api.getSubmission(id).then(res => {
            this.result = res.data.data
            if (Object.keys(res.data.data.statistic_info).length !== 0) {
              this.submitting = false
              this.submitted = false
              clearTimeout(this.refreshStatus)
              this.init()
            } else {
              this.refreshStatus = setTimeout(checkStatus, 2000)
            }
          }, res => {
            this.submitting = false
            clearTimeout(this.refreshStatus)
          })
        }
        this.refreshStatus = setTimeout(checkStatus, 2000)
      },
      submitCode () {
        if (this.code.trim() === '') {
          this.$error(this.$i18n.t('m.Code_can_not_be_empty'))
          return
        }
        this.submissionId = ''
        this.result = {result: 9}
        this.submitting = true
        let data = {
          problem_id: this.problem.id,
          language: this.language,
          code: this.code,
          contest_id: this.contestID
        }
        if (this.captchaRequired) {
          data.captcha = this.captchaCode
        }
        const submitFunc = (data, detailsVisible) => {
          this.statusVisible = true
          api.submitCode(data).then(res => {
            this.submissionId = res.data.data && res.data.data.submission_id
            // 定时检查状态
            this.submitting = false
            this.submissionExists = true
            if (!detailsVisible) {
              this.$Modal.success({
                title: this.$i18n.t('m.Success'),
                content: this.$i18n.t('m.Submit_code_successfully')
              })
              return
            }
            this.submitted = true
            this.checkSubmissionStatus()
          }, res => {
            this.getCaptchaSrc()
            if (res.data.data.startsWith('Captcha is required')) {
              this.captchaRequired = true
            }
            this.submitting = false
            this.statusVisible = false
          })
        }

        if (this.contestRuleType === 'OI' && !this.OIContestRealTimePermission) {
          if (this.submissionExists) {
            this.$Modal.confirm({
              title: '',
              content: '<h3>' + this.$i18n.t('m.You_have_submission_in_this_problem_sure_to_cover_it') + '<h3>',
              onOk: () => {
                // 暂时解决对话框与后面提示对话框冲突的问题(否则一闪而过）
                setTimeout(() => {
                  submitFunc(data, false)
                }, 1000)
              },
              onCancel: () => {
                this.submitting = false
              }
            })
          } else {
            submitFunc(data, false)
          }
        } else {
          submitFunc(data, true)
        }
      },
      onCopy (event) {
        this.$success('Code copied')
      },
      onCopyError (e) {
        this.$error('Failed to copy code')
      }
    },
    computed: {
      ...mapGetters(['problemSubmitDisabled', 'contestRuleType', 'OIContestRealTimePermission', 'contestStatus']),
      contest () {
        return this.$store.state.contest.contest
      },
      contestEnded () {
        return this.contestStatus === CONTEST_STATUS.ENDED
      },
      submissionStatus () {
        return {
          text: JUDGE_STATUS[this.result.result]['name'],
          color: JUDGE_STATUS[this.result.result]['color']
        }
      },
      submissionRoute () {
        if (this.contestID) {
          return {name: 'contest-submission-list', query: {problemID: this.problemID}}
        } else {
          return {name: 'submission-list', query: {problemID: this.problemID}}
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      // 防止切换组件后仍然不断请求
      clearInterval(this.refreshStatus)

      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: true})
      storage.set(buildProblemCodeKey(this.problem._id, from.params.contestID), {
        code: this.code,
        language: this.language,
        theme: this.theme
      })
      next()
    },
    watch: {
      '$route' () {
        this.init()
      }
    }
  }
</script>

<style lang="less" scoped>
  .padding-bottom-20{
    padding-bottom: 20px;
  }
  #problem-content {
    .one-item{
      border-bottom: 1px solid rgba(233,233,233,1);
      padding-bottom: 19px;
      margin-bottom: 20px;
      .title {
        font-size: 16px;
        color: #5363ED;
        font-weight: 500;
        margin-bottom: 8px;
      }
    }
    
    .content {
      margin: 0;
      font-size: 14px;
      font-family: HelveticaNeue;
      color: #666666;
      font-weight: 400;
      margin: 0;
    }
    .sample {
      display: flex;
      align-items: stretch;
      font-size: 14px;
      color: rgba(0,0,0,0.65);
      line-height: 22px;
      font-weight: 400;
      &-input, &-output {
        width: 50%;
        flex: 1 1 auto;
        display: flex;
        flex-direction: row;
        margin-right: 5%;
        align-items: center;
      }
      .copy {
        font-size: 20px;
        margin-left: 8px;
      }
    }
    .mb6{
      margin-bottom: 6px;
    }

    pre {
      flex: 1 1 auto;
      align-self: stretch;
      border-style: solid;
      background: transparent;
    }
  }

  #submit-code {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 24px 32px;
    background:#fff;
    .status {
      float: left;
      span {
        margin-right: 10px;
        margin-left: 10px;
      }
    }
    .captcha-container {
      display: inline-block;
      .captcha-code {
        width: auto;
        margin-top: -20px;
        margin-left: 20px;
      }
    }
    .submit-button{
      padding: 5px 27px;
      font-size: 14px;
    }
  }
  
  .vertical-menu-item{
    display: flex;
    align-items: center;
    cursor: pointer;
    .menu-title{
      opacity: 0.85;
      font-size: 16px;
      color: #000000;
      font-weight: 700;
      margin-left: 9px;
    }
  }

  #info {
    margin-bottom: 20px;
    margin-top: 20px;
    padding: 20px;
    ul {
      margin-top: 10px;
      list-style-type: none;
      li {
        padding: 10px 0;
        border-bottom: 1px dotted #e9eaec;
        p {
          display: inline-block;
        }
        p:first-child {
          width: 90px;
        }
        p:last-child {
          float: right;
        }
      }
    }
  }

  .fl-right {
    float: right;
  }

  #pieChart {
    .title-line{
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title-wrapper{
      display: flex;
      align-items: center;
    }
    .echarts {
      margin: 0 auto;
      width: 258px;
      height: 260px;
    }
  }

  #pieChart-detail {
    margin-top: 20px;
    width: 500px;
    height: 480px;
  }
</style>

