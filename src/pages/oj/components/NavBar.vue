<template>
  <div class="header">
    <div class="header-center">
      <img src="../../../assets/futureschool_logo.png" alt="" class="logo">
      <div class="menu-right">
        <Menu theme="light" mode="horizontal" @on-select="handleRoute" :active-name="activeMenu" class="oj-menu">
          <Menu-item name="/">
            {{$t('m.Home')}}
          </Menu-item>
          <Menu-item name="/problem">
            {{$t('m.NavProblems')}}
          </Menu-item>
          <Menu-item name="/contest">
            {{$t('m.Contests')}}
          </Menu-item>
          <Menu-item name="/status">
            {{$t('m.NavStatus')}}
          </Menu-item>
          <Menu-item name="/acm-rank">
            {{$t('m.ACM_Rank')}}
          </Menu-item>
          <Submenu name="about">
            <template slot="title">
              {{$t('m.About')}}
            </template>
            <Menu-item name="/about">
              {{$t('m.Judger')}}
            </Menu-item>
            <Menu-item name="/FAQ">
              {{$t('m.FAQ')}}
            </Menu-item>
          </Submenu>
        </Menu>
        <div class="user-btn">
          <template v-if="!isAuthenticated">
            <div class="btn-menu">
              <Button type="ghost"
                      ref="loginBtn"
                      shape="circle"
                      @click="handleBtnClick('login')">{{$t('m.Login')}}
              </Button>
              <Button v-if="website.allow_register"
                      type="ghost"
                      shape="circle"
                      @click="handleBtnClick('register')"
                      style="margin-left: 5px;">{{$t('m.Register')}}
              </Button>
            </div>
          </template>
          <template v-else>
            <Dropdown class="drop-menu" @on-click="handleRoute" placement="bottom" trigger="click">
              <Button type="text" class="drop-menu-title">{{ user.username }}
                <Icon type="arrow-down-b"></Icon>
              </Button>
              <Dropdown-menu slot="list">
                <Dropdown-item name="/user-home">{{$t('m.MyHome')}}</Dropdown-item>
                <Dropdown-item name="/status?myself=1">{{$t('m.MySubmissions')}}</Dropdown-item>
                <Dropdown-item name="/setting/profile">{{$t('m.Settings')}}</Dropdown-item>
                <Dropdown-item v-if="isAdminRole" name="/admin">{{$t('m.Management')}}</Dropdown-item>
                <Dropdown-item divided name="/logout">{{$t('m.Logout')}}</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </template>
        </div>
      </div>
    </div>
    <Modal v-model="modalVisible" :width="400">
      <div slot="header" class="modal-title">{{$t('m.Welcome_to')}} {{website.website_name_shortcut}}</div>
      <component :is="modalStatus.mode" v-if="modalVisible"></component>
      <div slot="footer" style="display: none"></div>
    </Modal>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import login from '@oj/views/user/Login'
  import register from '@oj/views/user/Register'

  export default {
    components: {
      login,
      register
    },
    mounted () {
      this.getProfile()
    },
    methods: {
      ...mapActions(['getProfile', 'changeModalStatus']),
      handleRoute (route) {
        if (route && route.indexOf('admin') < 0) {
          this.$router.push(route)
        } else {
          window.open('/admin/')
        }
      },
      handleBtnClick (mode) {
        this.changeModalStatus({
          visible: true,
          mode: mode
        })
      }
    },
    computed: {
      ...mapGetters(['website', 'modalStatus', 'user', 'isAuthenticated', 'isAdminRole']),
      // 跟随路由变化
      activeMenu () {
        return '/' + this.$route.path.split('/')[1]
      },
      modalVisible: {
        get () {
          return this.modalStatus.visible
        },
        set (value) {
          this.changeModalStatus({visible: value})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    height: 66px;
    width: 100%;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    .header-center{
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      min-width: 1100px;
      width: 58%;
      .logo {
        width: auto;
        height:46px;
      }
      .menu-right{
        display: flex;
        align-items: center;

        .user-btn{
          max-width: 100px;
          height: 30px;
          border: 1px solid @color-theme;
          border-radius: 10px;
        }
      }
    }
  }

  .modal {
    &-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
</style>