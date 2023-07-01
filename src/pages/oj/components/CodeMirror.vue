<template>
  <div style="margin: 0px 0px 15px 0px">
    <Row type="flex" justify="space-between" class="header">
      <Col :span=12>
      <div class="code-operater">
        <span>{{$t('m.Language')}}:</span>
        <Select :value="language" @on-change="onLangChange" class="adjust">
          <Option v-for="item in languages" :key="item" :value="item">{{item}}
          </Option>
        </Select>

        <Tooltip :content="this.$i18n.t('m.Reset_to_default_code_definition')" placement="top" class="tooltip-icon">
          <div @click="onResetClick">
           <svg viewBox="0 0 1024 1024" width="16" height="16">
            <path d="M934.4 206.933c-17.067-4.266-34.133 6.4-38.4 23.467l-23.467 87.467C797.867 183.467 654.933 96 497.067 96c-232.534 0-422.4 185.6-422.4 416s189.866 416 422.4 416c179.2 0 339.2-110.933 398.933-275.2 6.4-17.067-2.133-34.133-19.2-40.533-17.067-6.4-34.133 2.133-40.533 19.2C785.067 770.133 648.533 864 497.067 864c-198.4 0-358.4-157.867-358.4-352s162.133-352 358.4-352c145.066 0 277.333 87.467 330.666 217.6l-128-36.267c-17.066-4.266-34.133 6.4-38.4 23.467-4.266 17.067 6.4 34.133 23.467 38.4l185.6 49.067c2.133 0 6.4 2.133 8.533 2.133 6.4 0 10.667-2.133 17.067-4.267 6.4-4.266 12.8-10.666 14.933-19.2L960 245.333c0-17.066-8.533-34.133-25.6-38.4z" fill="#666"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip :content="this.$i18n.t('m.Upload_file')" placement="top" class="tooltip-icon">
          <div @click="onUploadFile">
            <svg viewBox="0 0 1024 1024" width="16" height="16">
            <path d="M896 629.333c-17.067 0-32 14.934-32 32V832c0 6.4-4.267 10.667-10.667 10.667H170.667c-6.4 0-10.667-4.267-10.667-10.667V661.333c0-17.066-14.933-32-32-32s-32 14.934-32 32V832c0 40.533 34.133 74.667 74.667 74.667h682.666C893.867 906.667 928 872.533 928 832V661.333c0-17.066-14.933-32-32-32z" fill="#666"/><path d="M322.133 407.467 480 249.6V704c0 17.067 14.933 32 32 32s32-14.933 32-32V247.467l157.867 157.866c6.4 6.4 14.933 8.534 23.466 8.534s17.067-2.134 23.467-8.534c12.8-12.8 12.8-32 0-44.8L535.467 147.2c-12.8-12.8-32-12.8-44.8 0L277.333 360.533c-12.8 12.8-12.8 32 0 44.8 10.667 12.8 32 12.8 44.8 2.134z" fill="#666"/>
            </svg>
          </div>
        </Tooltip>

        <input type="file" id="file-uploader" style="display: none" @change="onUploadFileDone">

      </div>
      </Col>
      <Col :span=12>
      <div class="fl-right">
        <span>{{$t('m.Theme')}}:</span>
        <Select :value="theme" @on-change="onThemeChange" class="adjust">
          <Option v-for="item in themes" :key="item.label" :value="item.value">{{item.label}}
          </Option>
        </Select>
      </div>
      </Col>
    </Row>
    <codemirror :value="value" :options="options" @change="onEditorCodeChange" ref="myEditor">
    </codemirror>
  </div>
</template>
<script>
  import utils from '@/utils/utils'
  import { codemirror } from 'vue-codemirror-lite'

  // theme
  import 'codemirror/theme/monokai.css'
  import 'codemirror/theme/solarized.css'
  import 'codemirror/theme/material.css'

  // mode
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/go/go.js'
  import 'codemirror/mode/javascript/javascript.js'

  // active-line.js
  import 'codemirror/addon/selection/active-line.js'

  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/indent-fold.js'

  export default {
    name: 'CodeMirror',
    components: {
      codemirror
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      languages: {
        type: Array,
        default: () => {
          return ['C', 'C++', 'Java', 'Python2']
        }
      },
      language: {
        type: String,
        default: 'C++'
      },
      theme: {
        type: String,
        default: 'solarized'
      }
    },
    data () {
      return {
        options: {
          // codemirror options
          tabSize: 4,
          mode: 'text/x-csrc',
          theme: 'solarized',
          lineNumbers: true,
          line: true,
          // 代码折叠
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          // 选中文本自动高亮，及高亮方式
          styleSelectedText: true,
          lineWrapping: true,
          highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
        },
        mode: {
          'C++': 'text/x-csrc'
        },
        themes: [
          {label: this.$i18n.t('m.Monokai'), value: 'monokai'},
          {label: this.$i18n.t('m.Solarized_Light'), value: 'solarized'},
          {label: this.$i18n.t('m.Material'), value: 'material'}
        ]
      }
    },
    mounted () {
      utils.getLanguages().then(languages => {
        let mode = {}
        languages.forEach(lang => {
          mode[lang.name] = lang.content_type
        })
        this.mode = mode
        this.editor.setOption('mode', this.mode[this.language])
      })
      this.editor.focus()
    },
    methods: {
      onEditorCodeChange (newCode) {
        this.$emit('update:value', newCode)
      },
      onLangChange (newVal) {
        this.editor.setOption('mode', this.mode[newVal])
        this.$emit('changeLang', newVal)
      },
      onThemeChange (newTheme) {
        this.editor.setOption('theme', newTheme)
        this.$emit('changeTheme', newTheme)
      },
      onResetClick () {
        this.$emit('resetCode')
      },
      onUploadFile () {
        document.getElementById('file-uploader').click()
      },
      onUploadFileDone () {
        let f = document.getElementById('file-uploader').files[0]
        let fileReader = new window.FileReader()
        let self = this
        fileReader.onload = function (e) {
          var text = e.target.result
          self.editor.setValue(text)
          document.getElementById('file-uploader').value = ''
        }
        fileReader.readAsText(f, 'UTF-8')
      }
    },
    computed: {
      editor () {
        // get current editor object
        return this.$refs.myEditor.editor
      }
    },
    watch: {
      'theme' (newVal, oldVal) {
        this.editor.setOption('theme', newVal)
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    margin: 5px 5px 15px 5px;
    .adjust {
      width: 150px;
      margin-left: 10px;
    }
    .tooltip-icon{
      margin-left: 30px;
    }
    .fl-right {
      float: right;
    }
  }
</style>

<style>
  .CodeMirror {
    height: auto !important;
  }
  .CodeMirror-scroll {
    min-height: 300px;
    max-height: 1000px;
  }
  .code-operater{
    display: flex;
    align-items: center;
  }
</style>
