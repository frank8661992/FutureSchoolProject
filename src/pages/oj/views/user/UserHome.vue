<template>
  <div class="container">
    <div class="avatar-container">
      <img class="avatar" src="../../../../assets/bg2-setting.png"/>

    </div>

    <Card class="cardDiv">

      <div v-if="profile.user">
        <p>
          <span v-if="profile.user" class="emphasis-name">{{profile.user.username}}</span>
          <span v-if="profile.school">@{{profile.school}}</span>
        </p>
        <div class="headline2"><span>海纳百川，有容乃大</span></div>

        <p v-if="profile.mood">
          {{profile.mood}}
        </p>
        <hr id="split"/>

        <div class="flex-container">
          <div class="left">
            <p class="title-left">{{$t('m.MyTodoList')}}</p>
            <p class="emphasis">{{profile.accepted_number}}<span>个任务</span></p>
          </div>
          <div class="middle">
            <p class="title-middle">{{$t('m.Average_task_processing_time_for_the_week')}}</p>
            <p class="emphasis">{{profile.submission_number}}<span>分钟</span></p>
          </div>
          <div class="right">
            <p class="title-right">{{$t('m.Completed_tasks_for_the_week')}}</p>
            <p class="emphasis">{{profile.total_score}}<span>个任务</span></p>
          </div>
        </div>
      
        <div id="icons">
          
            <img class="githublogo" src="../../../../assets/githublogo22px.png" alt="">
       
          
            <img class="letterlogo" src="../../../../assets/letter22px.png" alt="">
          
         
            <img class="multilogo" src="../../../../assets/multi-language22px.png" alt="">
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import time from '@/utils/time'
  import api from '@oj/api'

  export default {
    data () {
      return {
        username: '',
        profile: {},
        problems: []
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      init () {
        this.username = this.$route.query.username
        api.getUserInfo(this.username).then(res => {
          this.changeDomTitle({title: res.data.data.user.username})
          this.profile = res.data.data
          this.getSolvedProblems()
          let registerTime = time.utcToLocal(this.profile.user.create_time, 'YYYY-MM-D')
          console.log('The guy registered at ' + registerTime + '.')
        })
      },
      getSolvedProblems () {
        let ACMProblems = this.profile.acm_problems_status.problems || {}
        let OIProblems = this.profile.oi_problems_status.problems || {}
        // todo oi problems
        let ACProblems = []
        for (let problems of [ACMProblems, OIProblems]) {
          Object.keys(problems).forEach(problemID => {
            if (problems[problemID]['status'] === 0) {
              ACProblems.push(problems[problemID]['_id'])
            }
          })
        }
        ACProblems.sort()
        this.problems = ACProblems
      },
      goProblem (problemID) {
        this.$router.push({name: 'problem-details', params: {problemID: problemID}})
      },
      freshProblemDisplayID () {
        api.freshDisplayID().then(res => {
          this.$success('Update successfully')
          this.init()
        })
      }
    },
    computed: {
      refreshVisible () {
        if (!this.username) return true
        if (this.username && this.username === this.$store.getters.user.username) return true
        return false
      }
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
  .container {
    position: relative;
    width: 100%;
    min-width: 800px;
    text-align: center;
    .cardDiv {
      //ivu-card-body的padding为16px 原型上root距顶164px 163-16=148px
      padding-top: 148px;
      height:509px;
    }
   
    .avatar-container {
      position: absolute;
      width:100%;
      margin-top:34px;
      z-index: 1;
      .avatar {
        width: 106px;
        height: 106px;
        border-radius: 50%;
        box-shadow: 0 1px 1px 0;
      }
    }
    .headline2 {
        margin-top:4px;
        margin-bottom: 24px;
        font-size: 14px;
        color:#000000;
        opacity:0.65;
    }
    .emphasis-name {
      font-size: 20px;
      font-weight: 600;
      color:#000000;
      opacity:0.85;


    }
    #split {
      margin: 20px auto;
      opacity:1;
      border: 1px dashed #E8E8E8;
      width: 90%;
    }
    .flex-container {
      margin-top: 32px;
      padding: auto 20px;

      .emphasis {
        margin-top: 8px;
        font-size: 24px;
        color:#000000;
        opacity:0.85;


    }
      .left {
        flex: 1 1;
        .title-left {
          color:#000000;
          opacity:0.45;
        }
        
      }
      .middle {
        flex: 1 1;
        border-left: 1px solid #E8E8E8;
        border-right: 1px solid #E8E8E8;
        .title-middle {
          color:#000000;
          opacity:0.45;
        }
      }
      .right {
        flex: 1 1;
        .title-right {
          color:#000000;
          opacity:0.45;
        }
      }
    }
    
    #icons {
      position: relative;
      margin-top:94px;
      color:#000000;
      .githublogo {
      position: absolute;
      left:43.8%;
        
      }
      .letterlogo {
      position: absolute;
      left:48.8%;
      top:2px;
        
      }
      .multilogo {
      position: absolute;
      left:53%;
      top:3px;

        
        // margin-top: 30px;
      }
    }
    
}
</style>
