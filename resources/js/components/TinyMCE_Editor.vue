<!--
  /**
  * TinuMCE编辑器
  * @module /components
  * @desc 对TinyMCE编辑器进行封装，数据实时同步至父组件，父组件通过调用函数将数据传入该组件，初始化数据通过props传输，之后通过setValue方法传输
  * @author Otstar Lin
  * @date 2019年4月
  * @param {String} [value]  - 初始数据
  * @example 调用示例
  *  <tinymce v-model="html_content" ref="tinymce"></tinymce>
  *  <button @click="switchEditor('tinymce')">switchToTinymce</button>
  * @import 导入
  *  import TinyMCE from './components/TinyMCE_Editor.vue'
  *  Vue.component('tinymce', TinyMCE)
  */
-->
<template>
  <div class="tinymce">
    <textarea v-model="tinymceValue" id="tinymce-textarea"></textarea>
  </div>
</template>

<script>
// import tinyMCE from 'tinymce/tinymce'
// import 'tinymce/themes/silver'
// import Editor from '@tinymce/tinymce-vue'
// import 'tinymce/plugins/print'
// import 'tinymce/plugins/preview'
// import 'tinymce/plugins/fullpage'
// import 'tinymce/plugins/searchreplace'
// import 'tinymce/plugins/autolink'
// import 'tinymce/plugins/directionality'
// import 'tinymce/plugins/code'
// import 'tinymce/plugins/visualblocks'
// import 'tinymce/plugins/visualchars'
// import 'tinymce/plugins/fullscreen'
// import 'tinymce/plugins/image'
// import 'tinymce/plugins/link'
// import 'tinymce/plugins/media'
// import 'tinymce/plugins/template'
// import 'tinymce/plugins/codesample'
// import 'tinymce/plugins/table'
// import 'tinymce/plugins/charmap'
// import 'tinymce/plugins/hr'
// import 'tinymce/plugins/pagebreak'
// import 'tinymce/plugins/nonbreaking'
// import 'tinymce/plugins/anchor'
// import 'tinymce/plugins/toc'
// import 'tinymce/plugins/insertdatetime'
// import 'tinymce/plugins/advlist'
// import 'tinymce/plugins/lists'
// import 'tinymce/plugins/wordcount'
// import 'tinymce/plugins/imagetools'
// import 'tinymce/plugins/textpattern'
export default {
  // components: {
  //   'editor': Editor
  // },
  props: {
    value: String,
    setting: Object
  },
  data() {
    return {
      tinymceValue: '',
      init: this.setting
    }
  },
  created() {
    //设置目标div
    this.init.selector = '#tinymce-textarea'
    //上传功能
    if(this.$parent.setting.xkSetting.imgUpload) {
      this.init.images_upload_handler = function(blobInfo, success, failure) {
        window.XKEditorAPI.imgUpload(blobInfo.blob(), function(response) {
          success(response.path)
          //TODO: 上传成功之后的提示
        }, function(error) {
          //TODO: 上传失败后的提示
          failure(error)
        })
      }
    }
    //添加自定义按钮
    this.init.setup = function (editor) {
      editor.ui.registry.addButton('tex-$', {
        text: '行内公式',
        onAction(_) {
          editor.insertContent('<p>$$$$</p>')
        }
      })
      editor.ui.registry.addButton('tex-math', {
        text: '块公式',
        onAction(_) {
          editor.insertContent('<pre>&nbsp;```math&nbsp;```&nbsp;</pre>')
        }
      })
      editor.ui.registry.addButton('flow', {
        text: '流程图',
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">graph </pre>')
        }
      })
      editor.ui.registry.addButton('seq', {
        text: '时序图',
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">sequenceDiagram&nbsp;</pre>')
        }
      })
      editor.ui.registry.addButton('gantt', {
        text: '甘特图',
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">gantt&nbsp;</pre>')
        }
      })
      editor.ui.registry.addButton('mermaid', {
        text: '添加图',
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">&nbsp;</pre>')
        }
      })
      editor.ui.registry.addButton('prismjs', {
        text: '代码块',
        onAction(_) {
          editor.insertContent('<pre><code class="line-numbers language-javascript">&nbsp;</code></pre>')
        }
      })
      editor.ui.registry.addButton('toMarkdownEditor', {
        text: '切换编辑器',
        onAction(_) {
          window.$switchEditor()
        }
      })
    }
  },
  mounted () {
    var _this = this
    //初始化tinymce编辑器
    tinyMCE.init(this.init)
    //赋初值
    this.tinymceValue = this.value
    tinyMCE.editors['tinymce-textarea'].setContent(this.tinymceValue)
    tinyMCE.editors['tinymce-textarea'].on('Change', function (e) {
      _this.tinymceValue = tinyMCE.editors['tinymce-textarea'].getContent()
    })
  },
  methods: {
    setValue(val) {
      this.tinymceValue = val
      tinyMCE.editors['tinymce-textarea'].setContent(this.tinymceValue)
    },
    updateValue() {
      tinyMCE.editors['tinymce-textarea'].setContent(this.tinymceValue)
      this.$emit('input', this.tinymceValue)
    }
  },
  watch: {
    tinymceValue() {
      this.updateValue()
    }
  }
}
</script>

<style scoped>
.tinymce {
  height: 100%;
}
</style>