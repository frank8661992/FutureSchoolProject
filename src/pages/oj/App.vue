<template>
  <div>
    <NavBar></NavBar>
    <div class="content-app">
      <div class="setbg">
        <transition name="fadeInUp" mode="out-in">
        <router-view></router-view>
      </transition>

      </div>
      
      <div class="footer">
        <p v-html="website.website_footer"></p>
        <p>Powered by <a href="https://github.com/QingdaoU/OnlineJudge">OnlineJudge</a>
          <span v-if="version">&nbsp; Version: {{ version }}</span>
        </p>
      </div>
    </div>
    <BackTop></BackTop>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import NavBar from '@oj/components/NavBar.vue'

  export default {
    name: 'app',
    components: {
      NavBar
    },
    data () {
      return {
        version: process.env.VERSION
      }
    },
    created () {
      try {
        document.body.removeChild(document.getElementById('app-loader'))
      } catch (e) {
      }
    },
    mounted () {
      this.getWebsiteConfig()
    },
    methods: {
      ...mapActions(['getWebsiteConfig', 'changeDomTitle'])
    },
    computed: {
      ...mapState(['website'])
    },
    watch: {
      'website' () {
        this.changeDomTitle()
      },
      '$route' () {
        this.changeDomTitle()
      }
    }
  }
</script>

<style lang="less">

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    background-color: transparent;
    &:active, &:hover {
      outline-width: 0;
    }
  }

  //设置桌面背景图
  .setbg {
    position:fixed;
    height: 100%;
    width: 100%;
    background-size:100% 100%;
    background-size:cover;
    background-repeat: no-repeat;
    background-attachment:fixed; 
    
    background:url("../../assets/bg1.png");
  }

//.ivu-col-span-22对应的是home和rank两个模块的样式
  .ivu-col-span-22 {    
    width: 58%;
    margin-top: 20px;
    // height: 154px;
  }

  //调整problem contest rank模块的组件居中显示 
  .ivu-row-flex{
    justify-content: center;
  }

  //调整status模块的上下间距 
  .flex-container #main[data-v-04bb703c] {
    margin-top: 20px;
  }
  //status width和居中调整
  .flex-container {
    width: 58%;
    margin: auto //居中
  }

  //调整about模块的上下间距 
  .container[data-v-614e2a40] {
    margin-top: 20px;
}

  //problems模块中 problems list 的width调整
  .ivu-col-span-19 {
    width: 38%;
    margin-top: 20px;
  }

   //problems模块中 problems tag 的width调整
  .ivu-col-span-5 {
    margin-top: 20px;
  }

  //contest width调整
  .ivu-col-span-24 {
    width: 58%;
    margin-top: 20px;
}



//about居中调整
.container[data-v-614e2a40]{
  margin: auto;
  // display: flex;

  width: 58%;
}
  


  @media screen and (max-width: 1200px) {
  .content-app {
    margin-top: 66px;
    
    // padding: 0 2%;  //取消padding 对应除home外的容器 宽度均设置为100% 整个content的范围
  }
}

@media screen and (min-width: 1200px) {
  .content-app {
    margin-top: 66px;
    // padding: 0 2%;
  }
}

  .footer {
    background-color: #EEEEEE;
    position:absolute;
    left: 0;
    bottom: 0;
    right: 0;
    margin-top: 20px;
    margin-bottom: 10px;
    
    text-align: center;
    font-size: small;
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }


</style>
