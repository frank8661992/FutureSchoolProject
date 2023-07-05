<template>
  <div class="annoucementDiv">

    <div class="notice_img">
      <img src="../../../../assets/notice.png" alt="">
    </div>

    

    <div class="notice_detail" name="announcement-animate" mode="in-out">
      <div class="no-announcement" v-if="!announcements.length" key="no-announcement">
        <p>{{$t('m.No_Announcements')}}</p>
      </div>


      <template v-if="listVisible">
        <div class="announcements-container" key="list">
          <div v-for="announcement in announcements" :key="announcement.title">

              <div class="title"><a @click="goAnnouncement(announcement)">
                {{announcement.title}}</a></div>

              <div class="date"><span>{{announcement.create_time | localtime }}</span></div>

              <div class="creator"><span>{{$t('m.By')}} {{announcement.created_by.username}}</span></div>

          </div>
        </div>
          <!-- <Pagination v-if="!isContest"
                    key="page"
                    :total="total"
                    :page-size="limit"
                    @on-change="getAnnouncementList">
        </Pagination> -->
        
      </template>

      <template v-else>
        <div v-katex v-html="announcement.content" key="content" class="content-container markdown-body"></div>
      </template>
    </div>

    <div class="notice_btn" slot="extra">
      <Button clsaa="btn" v-if="listVisible" type="primary" @click="init" :loading="btnLoading">{{$t('m.Refresh')}}</Button>
      <Button clsaa="btn" v-else type="ghost" icon="ios-undo" @click="goBack">{{$t('m.Back')}}</Button>
    </div>

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
        limit: 10,
        total: 10,
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

<style scoped lang="less">
  .annoucementDiv {
    height: 154px;
    display: flex;
    flex-direction: row
    
  }
  .notice_img {
    width: 100px;
    height: 87px;
    flex-grow: 1;
    margin-top: 8px;
    margin-left:8px;

  }
  .notice_detail {
    flex-basis: 200px;
    flex-grow: 11;
  }
  .notice_btn {
    width:80px;
    flex-grow: 1;
    margin-top:37px;
    padding-left:10px; 
    
  }

  .ivu-btn {
    border-radius: 26px;
    width: 120px;
    height: 40px;

  }
  .title {
    a {
      font-size: 22px;
      font-family: 'STYuanti-SC-Regular';
      color: #000000;
    }
  }

  .date {
    span {
      font-size: 16px;
      color: #999999;
    }
  }
  .creator{
    margin-top: 17px;
    span {
      font-size: 20px;

    }


  }



  .content-container {
    padding: 0 20px 20px 20px;
  }

  .no-announcement {
    text-align: center;
    font-size: 16px;
  }changeLocale

  .announcement-animate-enter-active {
    animation: fadeIn 1s;
  }
</style>
