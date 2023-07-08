<template>
  <div>
    <NavBar></NavBar>
    <div class="content-app">
      <transition name="fadeInUp" mode="out-in">
        <div class=content-wrapper>
          <div class="content">
            <router-view></router-view>
          </div>
        </div>
      </transition>
    </div>
    <div class="footer">
      <p v-html="website.website_footer" class="main-footer"></p>
      <p class="sub-footer">Powered by OnlineJudge
        <span v-if="version">&nbsp; Version: {{ version }}</span>
      </p>
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

  .content-app {
    background:url("../../assets/background.png") no-repeat;
    background-size: cover;
    background-position: center 0;
    margin: 0 auto;
    overflow-x:auto;
    .content-wrapper{
      width: 100%;
      display: flex;
      justify-content: center;
      height:calc(100vh - 160px);
      margin: 20px 0;
      overflow: auto;
      .content{
        width: 58%;
        min-width: 1100px;
        height: 100%;
      }
    }
  }

  .footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 60px;
    text-align: center;
    font-size: small;
    background: #FFFFFF;
    position:fixed;
    bottom: 0;
    width: 100%;
    letter-spacing: 0;

    .main-footer{
      font-size: 16px;
      color: #000000;
      font-weight: 600;
    }
    .sub-footer{
      font-size: 14px;
      color: #666666;
      font-weight: 400;
    }
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }

</style>
