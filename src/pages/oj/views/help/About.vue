<template>
  <div>
    <panel class="container  main-content">
      <div slot="title">{{$t('m.Compiler')}} & {{$t('m.Judger')}}</div>
      <div class="compiler-content markdown-body">
        <ul>
          <li v-for="lang in languages">
            <p class="langTitleNameDiv">{{lang.name}} ( {{lang.description}} )</p>
            <pre>{{lang.config.compile.compile_command}}</pre>
          </li>
        </ul>
      </div>
    </panel>

    <panel class="container  main-content">
      <div slot="title">{{$t('m.Result_Explanation')}}</div>
      <div class="result-content">
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
  
  .container {
      margin-bottom: 20px;
    .markdown-body{
      padding-bottom: 10px;
      color: blue;

    }
    .langTitleNameDiv {
       color:black;
    }
    
    .resultExpContentDiv {
      color: black;

    }
    .compiler-content {
      font-size: 15px;
      margin-left:18px;
      > ul {
        list-style: disc;
        pre {
          background: rgba(83,99,237,0.06);
        }

        li {
          line-height: 2;
          color: blue;

          .title {
            font-weight: 500;
          }
        }
      }
    }

    .result-content {
      font-size: 15px;
      margin-left:36px;
      
      > ul {
        list-style: disc;
        padding-bottom: 40px;

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
