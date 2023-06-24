<template>
  <div class="showFrame">
    <panel class="container  main-content">
      <div slot="title">{{$t('m.Compiler')}} & {{$t('m.Judger')}}</div>
      <div class="about-content markdown-body">
        <ul>
          <li v-for="lang in languages">
            <p class="langTitleNameDiv">{{lang.name}} ( {{lang.description}} )</p>
            <pre>{{lang.config.compile.compile_command}}</pre>
          </li>
        </ul>
      </div>
    </panel>

    <panel :padding="15" class="container  main-content">
      <div slot="title" class="resultExpTitleDiv">{{$t('m.Result_Explanation')}}</div>
      <div class="content">
        <ul>
          <li><b>{{$t('m.Pending')}} & {{$t('m.Judging')}}</b>: <b class="resultExpContentDiv">{{$t('m.Pending_Judging_Description')}}</b></li>
          <li><b>{{$t('m.Compile_Error')}}</b>: <b class="resultExpContentDiv">{{$t('m.Compile_Error_Description')}}</b></li>
          <li><b>{{$t('m.Accepted')}}</b>:	<b class="resultExpContentDiv">{{$t('m.Accepted_Description')}}</b></li>
          <li><b>{{$t('m.Wrong_Answer')}}</b>:	<b class="resultExpContentDiv">{{$t('m.Wrong_Answer_Description')}}</b></li>
          <li>
            <b>{{$t('m.Runtime_Error')}}</b>:	<b class="resultExpContentDiv">{{$t('m.Runtime_Error_Description')}}</b>
          </li>
          <li><b>{{$t('m.Time_Limit_Exceeded')}}</b>:	<b class="resultExpContentDiv">{{$t('m.Time_Limit_Exceeded_Description')}}</b>
          </li>
          <li><b>{{$t('m.Memory_Limit_Exceeded')}}</b>:	<b class="resultExpContentDiv">{{$t('m.Memory_Limit_Exceeded_Description')}}</b></li>
          <li><b>{{$t('m.System_Error')}}</b>: <b class="resultExpContentDiv">{{$t('m.System_Error_Description')}}</b>
          </li>
        </ul>
      </div>
    </panel>

  </div>
</template>

<script>
  import utils from '@/utils/utils'

  export default {
    data () {
      return {
        languages: []
      }
    },
    beforeRouteEnter (to, from, next) {
      utils.getLanguages().then(languages => {
        next(vm => {
          vm.languages = languages
        })
      })
    }
  }
</script>

<style scoped lang="less">
  .showFrame {
    padding-bottom: 10px;
  }
  .container {
      margin-bottom: 10px;
    .markdown-body{
      // width: 90%;
      padding-bottom: 10px;
      color: blue;

    }
    

    .langTitleNameDiv {
       color:black;
    }
    .resultExpTitleDiv {
      font-size: 20px;
      text-align: left;
      padding-top:30px;
      padding-left:40px;
      line-height: 0;

    }
    .resultExpContentDiv {
      color: black;

    }
    .about-content {
      font-size: 15px;
      > ul {
        list-style: disc;

        li {
          line-height: 2;
          color: blue;

          .title {
            font-weight: 500;
          }
        }
      }
    }
  }
</style>
