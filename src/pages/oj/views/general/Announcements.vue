<template>
  <div>
    <transition-group name="announcement-animate" mode="in-out">
      <div class="no-announcement" v-if="!announcements.length" key="no-announcement">
        <p>{{$t('m.No_Announcements')}}</p>
      </div>
      <template v-if="listVisible">
        <ul class="announcements-container" key="list">
          <li v-for="announcement in announcements" :key="announcement.title">
            <div class="notice_img">
              <img src="../../../../assets/notice.png" alt="">
            </div>
            <div class="message-info">
              <div class="title" @click="goAnnouncement(announcement)">
                {{announcement.title}}
              </div>
              <div class="date">{{announcement.create_time | localtime }}</div>
              <div class="creator"> {{$t('m.By')}}<span>:</span> 管理员</div>
            </div>
            <Button class="button-detail" type="primary" shape="circle" @click="goAnnouncement(announcement)" >{{$t('m.Detail')}}</Button>
          </li>
        </ul>
        <Pagination v-if="!isContest"
                    key="page"
                    :total="total"
                    :page-size="limit"
                    @on-change="getAnnouncementList">
        </Pagination>
      </template>
    </transition-group>
    <Panel class="announcement-panel" v-if="!listVisible">
      <div slot="title">
        <div class="title-button">
          <span>{{title}}</span>
          <Button class="button-extra" type="primary" shape="circle" @click="goBack">
            <div class="icon-text" >
              <Icon type="ios-undo" class="icon"/>
              <span>{{$t('m.Back')}}</span>
            </div>
            </Button>
        </div>
      </div>
      <!-- <div slot="extra" class="padding20">
        <Button class="button-extra" v-if="listVisible" type="primary" shape="circle" @click="init" :loading="btnLoading">{{$t('m.Refresh')}}</Button>
      </div> -->

      <transition-group name="announcement-animate" mode="in-out">
          <div v-katex v-html="announcement.content" key="content" class="content-container markdown-body"></div>
      </transition-group>
  </Panel>
  </div>
  
</template>

<script>
  import api from '@oj/api'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'Announcement',
    components: {
      Pagination
    },
    data () {
      return {
        limit: 5,
        total: 5,
        btnLoading: false,
        announcements: [],
        announcement: '',
        listVisible: true
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        if (this.isContest) {
          this.getContestAnnouncementList()
        } else {
          this.getAnnouncementList()
        }
      },
      getAnnouncementList (page = 1) {
        this.btnLoading = true
        api.getAnnouncementList((page - 1) * this.limit, this.limit).then(res => {
          this.btnLoading = false
          this.announcements = res.data.data.results
          this.total = res.data.data.total
        }, () => {
          this.btnLoading = false
        })
      },
      getContestAnnouncementList () {
        this.btnLoading = true
        api.getContestAnnouncementList(this.$route.params.contestID).then(res => {
          this.btnLoading = false
          this.announcements = res.data.data
        }, () => {
          this.btnLoading = false
        })
      },
      goAnnouncement (announcement) {
        this.announcement = announcement
        this.listVisible = false
      },
      goBack () {
        this.listVisible = true
        this.announcement = ''
      }
    },
    computed: {
      title () {
        if (this.listVisible) {
          return this.isContest ? this.$i18n.t('m.Contest_Announcements') : this.$i18n.t('m.Announcements')
        } else {
          return this.announcement.title
        }
      },
      isContest () {
        return !!this.$route.params.contestID
      }
    }
  }
</script>
<style lang="less">
  .announcement-container {
    // 放scoped不生效
    p{
      opacity: 0.85;
      font-family: SourceHanSansCN-Regular;
      font-size: 16px;
      color: #666666;
      line-height: 20px;
      font-weight: 400;
      margin-bottom: 26px;
    }
    img{
      max-width: 1036px;
    }
  }

</style>

<style scoped lang="less">
.announcement-panel{
  padding: 20px;
  .title-button{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
  .button-extra{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    .icon-text{
      display: flex;
      align-items: center;
      .icon{
        font-size: 22px;
        margin-right: 5px;
      }
    }
  }
  .announcements-container {
    margin-top: -10px;
    margin-bottom: 10px;
    li {
      background: #fff;
      display: flex;
      justify-content: space-between;
      padding: 32px 40px;
      list-style: none;
      margin-bottom: 14px;
      border-radius: 8px;
      align-items: center;
      .notice_img{
        height: 87px;
        margin-right: 40px;;
      }
      &:last-child {
        border-bottom: none;
      }
      .message-info {
        flex: 1;
        text-align: left;
        font-family: STYuanti-SC-Regular;
        letter-spacing: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-weight: 400;
        .title {
          font-size: 20px;
          cursor: pointer;
          &:hover {
            color: @color-theme;
          }
        }
        .date {
          font-size: 14px;
          color: #999999;
        }
        .creator{
          margin-top: 20px;
          font-size: 16px;
        }
      }
      .button-detail{
        height: 40px;
        padding: 0 40px;
      }
    }
  }

  .no-announcement {
    text-align: center;
    font-size: 16px;
  }changeLocale

  .announcement-animate-enter-active {
    animation: fadeIn 1s;
  }
  .content-container {
    opacity: 0.85 ;
    font-size: 16px !important;
    color: #666666;
    line-height: 20px !important;
    font-weight: 400 !important;
  }
</style>
