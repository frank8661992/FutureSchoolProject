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

  .setbg {
    height: 918px;
    // border-color: pink;
    border: 1px solid red;
    background:url("../../assets/bg1.png");
    // width:100%;			//大小设置为100%
    // height:100%;			//大小设置为100%
    // position:fixed;
    // background-size:100% 100%;//宽 高均为100%
  }

  //调整home problem contest rank模块的上下间距 
  .ivu-row-flex{
    margin-top: 20px;
    justify-content: center;
  }

  //调整status模块的上下间距 
  .flex-container #main[data-v-04bb703c] {
    margin-top: 20px;
  }

  //调整about模块的上下间距 
  .container[data-v-614e2a40] {
    margin-top: 20px;
}

  .ivu-col-span-22 {
    //.ivu-col-span-22对应的是home和rank两个模块的样式
    //这个样式对应首页和home里的容器，将其设置为宽度58%
    
    width: 58%;
  }

  //problems with调整
  .ivu-col-span-19 {
    width: 38%;
  }

  //contest width调整
  .ivu-col-span-24 {
    display: block;
    width: 58%;
}

//status居中调整
.flex-container {
  width: 58%;
  margin: auto //居中
}

//about居中调整
.container[data-v-614e2a40]{
  margin: auto;
  width: 58%;
}

  // .ivu-col-span-24{
  //   width: 58%;

  // }
  


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
    margin-top: 20px;
    margin-bottom: 10px;
    text-align: center;
    font-size: small;
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }


</style>
