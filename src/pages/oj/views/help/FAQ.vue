<template>
  <panel class="container main-content">
    <div slot="title" class="FAQTitleNameDiv">{{$t('m.Frequently_Asked_Questions')}}</div>
    <div class="FAQcontent markdown-body">
      <ul>
        <li><span>{{$t('m.Where_is_the_input_and_the_output')}}</span> 
          <p>{{$t('m.Where_is_the_input_and_the_output_answer_part_1')}} <code>stdin</code> ('{{$t('m.Standard_Input')}}') {{$t('m.Where_is_the_input_and_the_output_answer_part_3')}} <code>stdout</code>
            ('{{$t('m.Standard_Output')}}') {{$t('m.Where_is_the_input_and_the_output_answer_part_5')}} <code>scanf</code> {{$t('m.Where_is_the_input_and_the_output_answer_part_6')}} <code>cin</code>
            {{$t('m.Where_is_the_input_and_the_output_answer_part_7')}} <code>printf</code> {{$t('m.Where_is_the_input_and_the_output_answer_part_8')}} <code>cout</code> {{$t('m.Where_is_the_input_and_the_output_answer_part_9')}} <code>{{$t('m.Runtime_Error')}}</code>.
          </p>
        </li>
        <li><span>{{$t('m.What_is_the_meaning_of_submission_execution_time')}}</span> 
        <p>{{$t('m.What_is_the_meaning_of_submission_execution_time_answer')}} 
        </p>
        </li>
        <li><span>{{$t('m.How_Can_I_use_CPP_Int64')}}</span> 
          <p>{{$t('m.How_Can_I_use_CPP_Int64_answer_part_1')}}<code>long long</code> {{$t('m.How_Can_I_use_CPP_Int64_answer_part_2')}} <code>cin/cout</code> {{$t('m.or')}} <code>%lld</code>, {{$t('m.using')}}<code> __int64</code> {{$t('m.How_Can_I_use_CPP_Int64_answer_part_3')}} <code>{{$t('m.Compile_Error')}}</code>.</p>
        </li>
        <li><span>{{$t('m.Java_specifications')}}</span>
          <p>{{$t('m.Java_specifications_answer_part_1')}} <code>Main</code> {{$t('m.Java_specifications_answer_part_2')}} <code>Main</code> {{$t('m.Java_specifications_answer_part_3')}}</p>
        </li>
        <li><span>{{$t('m.About_presentation_error')}}</span>
          <p>{{$t('m.About_presentation_error_answer_part_1')}} <b>{{$t('m.last')}}</b> {{$t('m.About_presentation_error_answer_part_2')}} <code> {{$t('m.Wrong_Answer')}}</code>.</p>
        </li>
        <li><span>{{$t('m.How_to_report_bugs')}}</span>
          <p>{{$t('m.How_to_report_bugs_answer_part_1')}} Github
            {{$t('m.How_to_report_bugs_answer_part_2')}}
          </p>
        </li>
      </ul>
    </div>
  </panel>
</template>

<script>
</script>

<style lang="less" scoped>

.container {
      margin-bottom: 20px;
    .markdown-body{
      padding-bottom: 10px;
      color: blue;
    }
    .FAQTitleNameDiv {
       color:black;
    }
    
    .FAQcontent {
      font-size: 16px;
      margin-left: 15px;
    > ul {
      list-style: disc;
      padding-bottom: 40px;
      li {
        font-size: 16px;
        margin-top: 30px;
        span {
          color:black;
          font-weight: bold;
        }
        
        p {
          font-size: 14px;
          margin-top: 5px;
          color:black;
        }
      }
    }
  }

    
  }
 
</style>
