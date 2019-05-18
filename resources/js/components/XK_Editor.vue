<!--
  /**

  当前架构
  ACE_Editor -> Editor(markdownContent)
  TinyMCE_Editor -> Editor(htmlContent)
  预览的HTML == htmlViewContent
  markdownContent.toHtmlFull -> htmlViewContent
  htmlContent -> htmlViewContent

  Set:
  switch时
  htmlContent.toMarkdown -> markdownContent => ACE_Editor
  markdownContent.toHtml -> htmlContent => TinyMCE_Editor

  Render:
  Prism.js 在转换时就渲染
  Mermaid  在转换后推送到DOM后渲染
  KaTex    在转换后推送到DOM后渲染
  TOC      在转换后推送到DOM后渲染

  滚动绑定 在每次输入推送到DOM后进行重新计算

  TODO:
  优化界面
  提升TinyMCE编辑体验
  重构，集中设置项
  添加设置面板，存放部分设置
  */
-->

<template>
<div class="xkeditor">
  <template  v-if="isRenderEditor">
  <div class="row">
    <div :class="aceDivClass" v-show="editorModeShow&&previewShow!='full'">
      <ace v-model="markdownContent" :setting="setting.aceSetting" ref="ace"></ace>
    </div>
    <div :class="aceDivClass" v-show="editorModeShow&&previewShow!='hide'">
      <div :class="setting.xkSetting.previewClass" v-html="htmlViewContent" id="previewHtml" ref="htmlView"></div>
    </div>
    <div class="xk-col-24" v-show="!editorModeShow">
      <tinymce v-model="htmlContent" :setting="setting.tinymceSetting" ref="tinymce"></tinymce>
    </div>
    <button class="xk-button close-preview-full" @click="switchPreviewFull()" v-show="editorModeShow&&previewShow=='full'">关闭</button>
    <transition name="slide-fade">
      <div id="toc" v-show="showToc"></div>
    </transition>
    <div id="toc-button" class="xk-button"><fa-icon icon="bars"/></div>
  </div>
  </template>
</div>
</template>

<script>
//导入基础组件
import '../utils/dialogDrag.js'
import ACE from './ACE_Editor.vue'
import TinyMCE from './TinyMCE_Editor.vue'

import { axiosPro, axios } from "../utils/axiosPro.js"
//HTML和Markdown互转
import { toHtml, toMarkdown, getTocHtml } from '../utils/switchContent.js'

import katex from "katex"
import "katex/dist/katex.min.css"
import renderMathInElement from "katex/dist/contrib/auto-render"
import mermaid from "mermaid"

//fa icon
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
library.add(fas)

export default {
  name: 'XK_Editor',
  components: {
    'ace': ACE,
    'tinymce': TinyMCE,
    "fa-icon": FontAwesomeIcon
  },
  props: {
    settingApi: String,
    contentApi: String,
    settingProps: Object,
    contentProps: String
  },
  data () {
    return {
      isRenderEditor: false,
      markdownContent: '',
      htmlContent: '',
      htmlViewContent: '',
      toc: '',
      showToc: false,
      editorMode: "ace",
      previewShow: 'show',
      aceDivClass: "xk-col-12",
      delayToHtml: null,
      setting: {
        tinymceSetting: {
          language_url: '/static/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/static/tinymce/skins/ui/oxide',
          body_class: 'markdown-body',
          content_css: '/static/github-markdown.css',
          plugins: 'print preview fullpage searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern',
          toolbar: 'formatselect | fontsizeselect | bold italic underline strikethrough blockquote forecolor backcolor prismjs | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | tex-$ tex-math flow seq gantt mermaid | removeformat code toMarkdownEditor | undo redo',
          image_advtab: true,
          importcss_append: true,
          height: '100%',
          template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
          template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
          image_caption: true,
          spellchecker_dialog: true,
          spellchecker_whitelist: ['Ephox', 'Moxiecode']
        },
        aceSetting: {
          minLines: 10,
          fontSize: 14,
          theme: "ace/theme/solarized_light",
          mode: "ace/mode/markdown",
          tabSize: 4,
          fontSize: "17px",
          wrap: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
          enableBasicAutocompletion: true
        },
        xkSetting: {
          apiBaseUrl: "",
          previewCss: "/static/github-markdown.css",
          previewClass: "markdown-body",
          delayToHtml: 500,
          scrollBind: 'both',
          imgUpload: false,
          scrollMode: 'anchor'
        }
      }
    }
  },
  computed: {
    editorModeShow() {
      if(this.editorMode === 'ace') {
        return true
      } else if(this.editorMode === 'tinymce') {
        return false
      }
    },
    isMobile() {
      return window.isMobile
    }
  },
  async mounted() {
    window.isMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent)
    await this.load()
    this.htmlViewContent = toHtml(this.markdownContent, true)
    this.$nextTick(function() {
      this.initEditor()
    })
    this.setInterface()
  },
  methods: {
    async load() {
      let md = null
      let setting = null
      if(!this.contentProps) {
        md = await axiosPro.get(this.contentApi)
      } else {
        md = this.contentProps
      }
      if(!this.settingProps) {
        setting = await axiosPro.get(this.settingApi)
      } else {
        setting = this.settingProps
      }
      this.markdownContent = md
      this.setting = setting
      this.loadCss(setting.xkSetting.previewCss)
      this.isRenderEditor = true
    },
    loadCss(url) {
      let css = document.createElement('link')
      css.href = url
      css.rel = 'stylesheet'
      css.type = 'text/css'
      document.head.appendChild(css)
    },
    initEditor() {
      var _this = this
      mermaid.initialize({startOnLoad:true})
      window.$ace = this.$refs.ace.aceEditor
      window.$switchEditor = this.switchEditor
      window.scrollBind = function(operate = null, bindType = 'both') {
        var currentTab = 1
        var editorDom = document.querySelector('.ace-editor')
        var previewHtmlDom = document.querySelector('#previewHtml')
        var aceContentHeight =  window.$ace.renderer.scrollBarV.scrollHeight - editorDom.offsetHeight
        var previewHtmlHeight = previewHtmlDom.scrollHeight - previewHtmlDom.offsetHeight
        window.scale = previewHtmlHeight/aceContentHeight
        if(operate === 'init') {
          if(bindType === 'left') {
            currentTab = 1
          } else if(bindType === 'right') {
            currentTab = 2
          } else {
            editorDom.addEventListener('mouseover', function() {
              currentTab = 1
            })
            previewHtmlDom.addEventListener('mouseover', function() {
              currentTab = 2
            })
            //兼容触摸设备
            editorDom.addEventListener('touchstart', function() {
              currentTab = 1
            })
            previewHtmlDom.addEventListener('touchstart', function() {
              currentTab = 2
            })
          }
          window.$ace.session.on("changeScrollTop", function(data) {
            if(currentTab === 1) {
              previewHtmlDom.scrollTop = data * window.scale
            }
          })
          previewHtmlDom.addEventListener('scroll', function() {
            if (currentTab === 2) {
              window.$ace.session.setScrollTop(previewHtmlDom.scrollTop / window.scale)
            }
          })
          //兼容触摸设备
          previewHtmlDom.addEventListener('touchmove', function() {
            if (currentTab === 2) {
              window.$ace.session.setScrollTop(previewHtmlDom.scrollTop / window.scale)
            }
          })
          //惯性滚动
          var inertiaScrollTime = null
          editorDom.addEventListener('touchstart', function(event) {
            clearTimeout(inertiaScrollTime)
            var startY = event.changedTouches[0].pageY
            var endY = 0
            var startTime = Date.now()
            var endTime = 0
            editorDom.addEventListener('touchend', function(event) {
              endY = event.changedTouches[0].pageY
              endTime = Date.now()
              var _v = (endY - startY) / (endTime - startTime) * 1.5
              function scrollToTop(v, sTime, contentY) {
                var dir = v > 0 ? -1 : 1
                var deceleration = dir*0.0018
                var duration = v / deceleration
                function inertiaMove() {
                  // if(stopInertia) return
                  var nowTime = Date.now()
                  var t = nowTime - sTime
                  var nowV = v + t*deceleration
                  // 速度方向变化表示速度达到0了
                  if(dir*nowV > 0) {
                    return
                  }
                  var moveY = - (v + nowV)/2 * t
                  window.$ace.session.setScrollTop(contentY + moveY)
                  inertiaScrollTime = setTimeout(inertiaMove, 10)
                }
                inertiaMove()
              }
              scrollToTop(_v, endTime, window.$ace.session.getScrollTop())
            })
          })
        }
      }
      // 模拟锚点
      window.scrollMode = this.setting.xkSetting.scrollMode
      window.sta = function(anchorName) {
        if (anchorName) {
          let anchorElement = document.getElementById(anchorName);
          if(anchorElement) {
            anchorElement.scrollIntoView(true);
          }
        }
      }
      //初始化滚动绑定
      this.$nextTick(function() {
        setTimeout(function() {
          window.scrollBind('init', _this.setting.xkSetting.scrollBind)
        }, 1000)
      })
      //初始化TOC
      this.initTocTree()
      window.toggleToc = this.toggleToc
      //注册TOC按钮
      document.getElementById('toc-button').addEventListener('click', function() {
        _this.switchToc();
      })
    },
    switchEditor() {
      if(this.editorMode !== 'ace') {
        this.markdownContent = toMarkdown(this.htmlContent)
        this.$refs.ace.setValue(this.markdownContent)
        this.editorMode = 'ace'
      } else if(this.editorMode !== 'tinymce') {
        this.htmlContent = toHtml(this.markdownContent, false)
        this.$refs.tinymce.setValue(this.htmlContent)
        this.editorMode = 'tinymce'
      }
    },
    switchPreviewShow() {
      if(this.previewShow == 'show') {
        this.previewShow = 'hide'
        this.aceDivClass = "xk-col-24"
      } else {
        this.previewShow = 'show'
        this.aceDivClass = "xk-col-12"
      }
    },
    switchPreviewFull() {
      if(this.previewShow == 'full') {
        this.previewShow = 'show'
        this.aceDivClass = "xk-col-12"
        document.getElementById('toc-button').style.display = 'block'
        this.showToc = false
      } else {
        this.previewShow = 'full'
        this.aceDivClass = "xk-col-24"
        this.$nextTick(function() {
          var preEle = document.getElementById('previewHtml')
          if (Math.round(preEle.offsetWidth / preEle.parentElement.offsetWidth * 100) <= 80) {
            document.getElementById('toc-button').style.display = 'none'
            this.showToc = true
          }
        })
      }
    },
    renderNextTick() {
      this.$nextTick(function() {
        //制作TOC
        var tocHtml = getTocHtml();
        document.getElementById('toc').innerHTML = tocHtml
        //制作文章内TOC
        for (let i = 0; i < document.getElementsByClassName('toc').length; i++) {
          document.getElementsByClassName('toc')[i].innerHTML = tocHtml
        }
        //更新TOC icon
        this.initTocTree()
        //转换Tex公式
        renderMathInElement(document.getElementById('previewHtml'), {
          delimiters: [
            {left: "$$", right: "$$"},
            {left: "```math", right: "```"},
            {left: "```tex", right: "```"}
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "code"]
        })
        //转换Mermaid图
        try {
          mermaid.init({noteMargin: 10}, ".xkeditor-mermaid")
        } catch (error) {
          console.log("May have errors")
        }
        //更新滚动绑定
        if(window.scrollBind) {
          window.scrollBind()
        }
      })
    },
    switchToc() {
      this.showToc = (!this.showToc)
    },
    initTocTree() {
      var items = document.querySelectorAll('#toc .toc-img ~ ul,.toc .toc-img ~ ul')
      for (let i = 0; i < items.length; i++) {
        items[i].parentNode.children[0].setAttribute('src', '/static/svg/minus-square.svg')
        items[i].parentNode.children[0].setAttribute('onclick', 'toggleToc(this)')
      }
    },
    toggleToc(ele) {
      var display = ele.nextElementSibling.nextElementSibling.style.display
      if(display === '' || display === 'block') {
        ele.nextElementSibling.nextElementSibling.style.display = 'none'
        ele.setAttribute('src', '/static/svg/plus-square.svg')
      } else {
        ele.nextElementSibling.nextElementSibling.style.display = 'block'
        ele.setAttribute('src', '/static/svg/minus-square.svg')
      }
    },
    setInterface() {
      var _this = this
      var downloadFun = function(filename, data, type) {
        var aLink = document.createElement('a')
        var evt = document.createEvent("MouseEvents")
        evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        aLink.download = filename + '.'+type
        aLink.href = URL.createObjectURL(new Blob([data], {type: 'text/'+type}))
        aLink.dispatchEvent(evt)
      }
      window.XKEditorAPI = {
        //response: {"error":false,"path":"img url"}
        imgUpload: function(file, success, failure) {
          if(_this.xkSetting.imgUpload) {
            let param = new FormData()
            param.append('file', file)
            let config = {
              headers:{'Content-Type':'multipart/form-data'}
            }
            axios.post(_this.xkSetting.imgUpload, param, config)
              .then(function(response){
                success(response)
              })
              .catch(function(error) {
                failure(error)
              })
          } else {
            //TODO: 上传关闭提示
          }
        }
      }
      window.XKEditor = {
        getMarkdown: function() {
          return _this.markdownContent
        },
        getHTML: function() {
          return _this.htmlViewContent
        },
        setMarkdown: function(val, valueType = 'markdown') { //默认设置时在ACE编辑界面
          if(_this.editorMode !== 'ace') {
            //TODO: 提示不可设置，因为不在ACE状态
            return
          }
          if(valueType !== 'markdown') {
            val = toMarkdown(val)
          }
          _this.markdownContent = val
          _this.$refs.ace.setValue(val)
        },
        setHTML: function(val, valueType = 'html') { //默认设置时在TinyMCE编辑界面
          if(_this.editorMode !== 'tinymce') {
            //TODO: 提示不可设置，因为不在TinyMCE状态
            return
          }
          if(valueType !== 'html') {
            val = toHtml(val, false)
          }
          _this.htmlContent = val
          _this.$refs.tinymce.setValue(val)
        },
        switchEditor: function() {
          _this.switchEditor()
        },
        switchPreview: function() {
          _this.$refs.ace.execCommand('switchPreview')
        },
        switchFullPreview: function() {
          _this.$refs.ace.execCommand('fullPreview')
        },
        switchFullScreen: function() {
          _this.$refs.ace.execCommand('fullScreen')
        },
        toLine: function() {
          _this.$refs.ace.execCommand('toLine')
        },
        toc: function() {
          _this.$refs.ace.execCommand('toc')
        },
        toolbar: function() {
          _this.$refs.ace.execCommand('toolbar')
        },
        resize: function() {
          _this.$refs.ace.execCommand('resize')
        },
        addKeys: function(keys) { // keys = [{name,win,mac,exec},{name,win,mac,exec}]
          _this.$refs.ace.execCommand('addKeys', keys)
        },
        removeKeys: function(keys) { // keys = [name, name]
          _this.$refs.ace.execCommand('removeKeys', keys)
        },
        getEditor: function(name) {
          if(name === 'ace') {
            return window.$ace
          } else if(name === 'tinymce') {
            return window.tinymce
          }
        },
        switchTypewriter: function(data) {
          _this.$refs.ace.execCommand('typewriter', true)
        },
        setLocalStorage: function(filename) {
          window.localStorage.setItem('xkeditor_' + filename, window.XKEditor.getMarkdown())
        },
        getLocalStorage: function(filename) {
          return window.localStorage.getItem('xkeditor_' + filename)
        },
        listLocalStorage: function() {
          var list = {}
          for (const key in window.localStorage) {
            if(key.indexOf('xkeditor_') != -1) {
              list[key.substring(9)] = window.localStorage.getItem(key)
            }
          }
          return list
        },
        removeLocalStorage: function(filename) {
          window.localStorage.removeItem('xkeditor_' + filename)
        },
        download: async function(filename, type = 'markdown') {
          var data = ''
          if(type === 'markdown') {
            data = _this.markdownContent
            type = 'md'
          } else if(type === 'html') {
            data = _this.htmlViewContent
          } else if(type === 'fullhtml') {
            var d_t1 = '<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>'
            var d_t2 = '</title>'
            var d_t3 = '</head><body>'
            var d_t4 = '</body></html>'
            var style = await axiosPro.get(_this.setting.xkSetting.previewCss)
            style += await axiosPro.get('/static/prism-okaidia.css')
            style += await axiosPro.get('/static/prism-line-numbers.css')
            style += await axiosPro.get('/static/prism-toolbar.css')
            data = d_t1+filename+d_t2+'<style>'+style+'</style>'+d_t3+'<div class="markdown-body editormd-html-preview">'+_this.htmlViewContent+'</div>'+d_t4
            type = 'html'
            downloadFun(filename, data, type)
            return
          }
          downloadFun(filename, data, type)
        },
      }
    }
  },
  watch: {
    markdownContent (val) {
      var _this = this
      //最少延迟250ms转换为html以保证性能，否则会造成输入卡顿
      var delay = _this.setting.xkSetting.delayToHtml >= 250 ? _this.setting.xkSetting.delayToHtml : 250
      if(_this.delayToHtml) {
        clearTimeout(_this.delayToHtml)
      }
      _this.delayToHtml = setTimeout(function() {
        _this.htmlViewContent = toHtml(val, true)
        _this.renderNextTick()
      }, delay)
    },
    htmlContent(val) {
      this.htmlViewContent = val
      this.renderNextTick()
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    }
  }
}
</script>

<style>
.xkeditor {
  height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
}
.xkeditor .row {
  height: 100%;
  transform:translate(0,0);
}
.xkeditor .row .xk-col-12 {
  height: 100%;
}
#previewHtml {
  overflow: auto;
  max-height: 100%;
  padding: 15px 15px;
  word-break: break-word;
  white-space: normal;
  box-sizing: border-box;
}
.xk-col-24 #previewHtml {
  float: left;
  width: 80%;
}
.toc,
#toc {
  word-break: break-word;
  white-space: normal;
  overflow-y: auto;
  height: 100%;
}
.toc ul,
#toc ul {
  margin: 0px;
  padding-left: 20px;
}
.toc li,
#toc li {
  list-style: none;
  padding-left: 5px;
}
.toc li img,
#toc li img {
  display: inline-block;
  width: 14px;
  vertical-align: middle;
  padding-right: 5px;
}
.toc a,
#toc a {
  color: #0366d6;
  text-decoration: none;
  font-size: 1.05em;
}
.row {
  margin: 0px;
}
.row .xk-col-12 {
  float: left;
  border-left: 1px solid #ddd;
  box-sizing: border-box;
}
.xk-col-24 {
  padding: 0px;
  width: 100%;
  height: 100%;
}
.xk-col-12 {
  padding: 0px;
  width: 50%;
  height: 100%;
}
.close-preview-full {
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 1000;
}
#toc {
  position: fixed;
  top: 0px;
  right: 0px;
  width: 20%;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  z-index: 999;
  padding: 20px;
  box-sizing: border-box;
}
#toc-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 20px;
  height: 20px;
  padding: 6px;
  z-index: 1000;
}
.xk-button {
  display: inline-block;
  padding: 6px 16px;
  outline: 0;
  font-size: 0.85em;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #C5D9E8;
  border-radius: 4px;
  background-color: #FFF;
  -webkit-transition: background 0.2s;
  transition: background 0.2s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
}

@media (max-width: 991px) {
  .xk-col-24 #previewHtml {
    float: left;
    width: 100%;
  }
  #toc {
    width: 80%;
  }
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
