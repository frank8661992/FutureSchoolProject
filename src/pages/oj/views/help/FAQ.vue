<template>
  <panel class="container main-content">
    <div slot="title" class="FAQTitleNameDiv">{{$t('m.Frequently_Asked_Questions')}}</div>
    <div class="FAQcontent markdown-body">
      <ul>
        <li><span>{{$t('m.Where_is_the_input_and_the_output')}}</span> 
          <p>{{$t('m.Where_is_the_input_and_the_output_answer_part_1')}} stdin ('{{$t('m.Standard_Input')}}') {{$t('m.Where_is_the_input_and_the_output_answer_part_3')}} stdout
            ('{{$t('m.Standard_Output')}}') {{$t('m.Where_is_the_input_and_the_output_answer_part_5')}} scanf {{$t('m.Where_is_the_input_and_the_output_answer_part_6')}} cin
            {{$t('m.Where_is_the_input_and_the_output_answer_part_7')}} printf {{$t('m.Where_is_the_input_and_the_output_answer_part_8')}} cout {{$t('m.Where_is_the_input_and_the_output_answer_part_9')}} {{$t('m.Runtime_Error')}}.
          </p>
        </li>
        <li><span>{{$t('m.What_is_the_meaning_of_submission_execution_time')}}</span> 
        <p>{{$t('m.What_is_the_meaning_of_submission_execution_time_answer')}} 
        </p>
        </li>
        <li><span>{{$t('m.How_Can_I_use_CPP_Int64')}}</span> 
          <p>{{$t('m.How_Can_I_use_CPP_Int64_answer_part_1')}} long long {{$t('m.How_Can_I_use_CPP_Int64_answer_part_2')}} cin/cout {{$t('m.or')}} %lld, {{$t('m.using')}} __int64 {{$t('m.How_Can_I_use_CPP_Int64_answer_part_3')}} {{$t('m.Compile_Error')}}.</p>
        </li>
        <li><span>{{$t('m.Java_specifications')}}</span>
          <p>{{$t('m.Java_specifications_answer_part_1')}} Main {{$t('m.Java_specifications_answer_part_2')}} Main {{$t('m.Java_specifications_answer_part_3')}}</p>
        </li>
        <li><span>{{$t('m.About_presentation_error')}}</span>
          <p>{{$t('m.About_presentation_error_answer_part_1')}} {{$t('m.last')}} {{$t('m.About_presentation_error_answer_part_2')}} {{$t('m.Wrong_Answer')}}.</p>
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
       font-weight: bold;
    }
    
    .FAQcontent {
      font-size: 16px;
      margin-left: 15px;
    > ul {
      list-style: disc;
      padding-bottom: 40px;
      li {
        font-size: 16px;
        margin-top: 18px;
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
