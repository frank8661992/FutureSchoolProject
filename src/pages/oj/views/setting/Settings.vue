<template>
  <div class="container">
    <Card :padding="0">
      <div class="flex-container">
        <div class="menu">
          
          <Menu accordion @on-select="goRoute" :activeName="activeName" style="text-align: center;" width="auto">
            <div class="avatar-editor">
              <div class="avatar-container">
                
                <img class="avatar" src="../../../../assets/bg2-setting.png"/>
                <div class="avatar-mask">
                  <a @click.stop="goRoute({name: 'profile-setting'})">
                    <div class="mask-content">
                      <Icon type="camera" size="30"></Icon>
                      <p class="text">change avatar</p>
                    </div>
                  </a>
                </div>
                <div class="headline1"><span>马萨拉蒂</span></div>
                <div class="headline2"><span>海纳百川 有容乃大</span></div>
              </div>
              <div class="line"></div>

            </div>

            <Menu-item name="/setting/profile" class="profile-class">{{$t('m.Profile')}}</Menu-item>
            <Menu-item name="/setting/account">{{$t('m.Account')}}</Menu-item>
            <Menu-item name="/setting/security">{{$t('m.Security')}}</Menu-item>
          </Menu>
        </div>
        
        <div class="panel">
          <transition name="fadeInUp">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'profile',
    methods: {
      goRoute (routePath) {
        this.$router.push(routePath)
      }
    },
    computed: {
      ...mapGetters(['profile']),
      activeName () {
        return this.$route.path
      }
    }
  }
</script>

<style lang="less" scoped>
  @avatar-radius: 50%;

  .container {
    width: 100%;
    min-width: 800px;
    margin: auto;
  }

  .flex-container {
    .menu {
      flex: 1 0 30%;
      max-width: 30%;
      .profile-class {
       margin-top:-15px;
      //  background-color:red;
      }
      .avatar-editor {
        padding: 8% 22%;
        margin-bottom: 10px;
        .line {
            margin-left:-44px;
            margin-top: 16px;
            width: 258px;
            opacity:1;
            border-bottom: 1px dashed #E8E8E8;
            background-repeat: repeat-x;
          }
        .avatar-container {
          .headline1 {
            color: black;
            font-family:  "黑体", Arial, sans-serif;
            font-size: 22px;
            font-weight: 400;
            margin-top:16px;
          }
          .headline2 {
            margin-top:4px;
            font-size: 14px;
          }
          &:hover {
            .avatar-mask {
              opacity: .5;
            }
          }
          position: relative;
          .avatar {
            height: 106px;
            width: 106px;
            border-radius: @avatar-radius;
          }
          .avatar-mask {
            transition: opacity .2s ease-in;
            z-index: 1;
            height: 106px;
            width: 106px;
            border-radius: @avatar-radius;
            position: absolute;
            top: 0;
            left: 29px;
            right: 0;
            bottom: 0;
            background: black;
            opacity: 0;
            .mask-content {
              position: absolute;
              top: 50%;
              left: 50%;
              z-index: 3;
              color: #fff;
              font-size: 16px;
              text-align: center;
              transform: translate(-50%, -50%);
              .text {
                white-space: nowrap;
              }
            }
          }
          
        }
      }

    }

    .panel {
      flex: auto;
      &::before {
        content: '';
        display: block;
        width: 1px;
        height: 100%;
        background: #dddee1;
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: 1;
      }
    }

  }

  .ivu-menu-vertical.ivu-menu-light:after {
    /*取消默认的伪元素*/
    width: 0;
  }
</style>

<style lang="less">
  .setting-main {
    padding: 24px 40px;
    min-height: 450px;
    .setting-content{
      margin-top: 20px;
    }
    .mini-container {
      width: 310px;
      margin-top: 30px;
    }
  }
</style>
