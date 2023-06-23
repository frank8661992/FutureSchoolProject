<template>
  <div>
    <NavBar></NavBar>
    <div class="content-app">
      <transition name="fadeInUp" mode="out-in">
        <div class="content">
          <router-view></router-view>
        </div>
      </transition>
    </div>
    <div class="footer">
      <p v-html="website.website_footer"></p>
      <p>Powered by <a href="https://github.com/QingdaoU/OnlineJudge">OnlineJudge</a>
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
    padding: 0 2%;
    height:calc(100vh - 120px);
    background-size:100% 100%;
    background-size:cover;
    background-repeat: no-repeat;
    background-attachment:fixed; 
    background:url("../../assets/background.jpg");
    .content{
      width: 100%;
      height:calc(100vh - 120px);
      overflow: auto;
    }
  }

  .footer {
    height: 60px;
    text-align: center;
    font-size: small;
    background: #FFFFFF;
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }


</style>
