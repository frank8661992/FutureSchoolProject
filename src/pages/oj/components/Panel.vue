<template>
  <Card :padding="padding" :shadow="shadow" :dis-hover="disHover" :bordered="bordered">
    <div slot="title" class="panel-title">
      <slot name="title"></slot>
    </div>
    <div slot="extra" class="panel-extra">
      <slot name="extra"></slot>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
  </Card>
</template>

<script>
  export default {
    name: 'Panel',
    props: {
      shadow: {
        required: false,
        type: Boolean,
        default: false
      },
      padding: {
        required: false,
        type: Number,
        default: 0
      },
      disHover: {
        required: false,
        type: Boolean,
        default: true
      },
      bordered: {
        required: false,
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="less">
  @import (reference) '../../../styles/common.less';

  .panel-title {
    .section-title;
    height: 40px;
    line-height: 40px;
    padding: 0;
    margin:0 0 16px 0;
  }
  .ivu-card-extra{
    top: 0;
    right:0;
  }
  .panel-extra {
    height: 40px;
    line-height: 40px;
    ul.filter {
      > li {
        display: inline-block;
        padding: 0 10px;
      }
    }
  }
  .panel-body {
    word-break: break-all;
    word-wrap: break-word;
  }
</style>
