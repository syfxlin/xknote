// "use strict";
import marked from "marked"
import turndown from "turndown"
var turndownGfm = require("turndown-plugin-gfm")

// import Prism from 'prismjs'
// import 'prismjs/themes/prism-okaidia.css'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
// import 'prismjs/plugins/toolbar/prism-toolbar.css'
// import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min'
// import EmojiConvertor from "emoji-js"

var emoji = new EmojiConvertor()
emoji.replace_mode = 'unified'

var tocContent = []
export function getTocHtml() {
  var html = getTocHtmlTree(0, '')
  window.$toc = html
  return html
}
function getTocHtmlTree(index, str) {
  if(index >= tocContent.length) return str
  if(index == 0) {
    str += ''
  } else if(tocContent[index].level > tocContent[index-1].level) {
    for(let i = tocContent[index-1].level; i < tocContent[index].level; i++) {
      str += '<ul>'
    }
  } else if(tocContent[index].level < tocContent[index-1].level) {
    for(let i = tocContent[index].level; i < tocContent[index-1].level; i++) {
      str += '</ul></li>'
    }
  } else {
    str += '</li>'
  }
  var tocUrl = tocContent[index].title.toLowerCase().replace(/ /g, "-").replace(/[^\u4e00-\u9fa5a-zA-Z0-9-]/g, "")
  if (window.scrollMode === 'anchor') {
    tocUrl = '#' + tocUrl
  } else {
    tocUrl = 'javascript:sta(\'' + tocUrl + '\');'
  }
  str += '<li><img class="toc-img" src="/static/svg/disc.svg"><a href="' + tocUrl + '">' + tocContent[index].title + '</a>'
  return getTocHtmlTree(index+1, str)
}

var Languages = {
  "html":"HTML",
  "xml":"XML",
  "svg":"SVG",
  "mathml":"MathML",
  "css":"CSS",
  "clike":"C-like",
  "js":"JavaScript",
  "abap":"ABAP",
  "abnf":"Augmented Backus–Naur form",
  "apacheconf":"Apache Configuration",
  "apl":"APL",
  "arff":"ARFF",
  "asciidoc":"AsciiDoc",
  "adoc":"AsciiDoc",
  "asm6502":"6502 Assembly",
  "aspnet":"ASP.NET (C#)",
  "autohotkey":"AutoHotkey",
  "autoit":"AutoIt",
  "bash": "Bash",
  "shell":"Bash",
  "basic":"BASIC",
  "bnf":"Backus–Naur form",
  "rbnf":"Routing Backus–Naur form",
  "csharp":"C#",
  "dotnet":"C#",
  "cpp":"C++",
  "cil":"CIL",
  "coffee":"CoffeeScript",
  "cmake":"CMake",
  "csp":"Content-Security-Policy",
  "css-extras":"CSS Extras",
  "django":"Django/Jinja2",
  "jinja2":"Django/Jinja2",
  "dockerfile":"Docker",
  "ebnf":"Extended Backus–Naur form",
  "ejs":"EJS",
  "erb":"ERB",
  "fsharp":"F#",
  "gcode":"G-code",
  "gedcom":"GEDCOM",
  "glsl":"GLSL",
  "gml":"GameMaker Language",
  "gamemakerlanguage":"GameMaker Language",
  "graphql":"GraphQL",
  "hs":"Haskell",
  "hcl":"HCL",
  "http":"HTTP",
  "hpkp":"HTTP Public-Key-Pins",
  "hsts":"HTTP Strict-Transport-Security",
  "ichigojam":"IchigoJam",
  "inform7":"Inform 7",
  "javadoc":"JavaDoc",
  "javadoclike":"JavaDoc-like",
  "javastacktrace":"Java stack trace",
  "jsdoc":"JSDoc",
  "js-extras":"JS Extras",
  "json":"JSON",
  "jsonp":"JSONP",
  "json5":"JSON5",
  "latex":"LaTeX",
  "emacs":"Lisp",
  "elisp":"Lisp",
  "emacs-lisp":"Lisp",
  "lolcode":"LOLCODE",
  "md":"Markdown",
  "markup-templating":"Markup templating",
  "matlab":"MATLAB",
  "mel":"MEL",
  "n1ql":"N1QL",
  "n4js":"N4JS",
  "n4jsd":"N4JS",
  "nand2tetris-hdl":"Nand To Tetris HDL",
  "nasm":"NASM",
  "nginx":"nginx",
  "nsis":"NSIS",
  "objectivec":"Objective-C",
  "ocaml":"OCaml",
  "opencl":"OpenCL",
  "parigp":"PARI/GP",
  "objectpascal":"Object Pascal",
  "php":"PHP",
  "phpdoc":"PHPDoc",
  "php-extras":"PHP Extras",
  "plsql":"PL/SQL",
  "powershell":"PowerShell",
  "properties":".properties",
  "protobuf":"Protocol Buffers",
  "py":"Python",
  "q":"Q (kdb+ database)",
  "jsx":"React JSX",
  "tsx":"React TSX",
  "renpy":"Ren'py",
  "rest":"reST (reStructuredText)",
  "rb":"Ruby",
  "sas":"SAS",
  "sass":"Sass (Sass)",
  "scss":"Sass (Scss)",
  "sql":"SQL",
  "soy":"Soy (Closure Template)",
  "tap":"TAP",
  "toml":"TOML",
  "tt2":"Template Toolkit 2",
  "ts":"TypeScript",
  "t4-cs":"T4 Text Templates (C#)",
  "t4":"T4 Text Templates (C#)",
  "t4-vb":"T4 Text Templates (VB)",
  "t4-templating":"T4 templating",
  "vbnet":"VB.Net",
  "vhdl":"VHDL",
  "vim":"vim",
  "visual-basic":"Visual Basic",
  "vb":"Visual Basic",
  "wasm":"WebAssembly",
  "wiki":"Wiki markup",
  "xeoracube":"XeoraCube",
  "xojo":"Xojo (REALbasic)",
  "xquery":"XQuery",
  "yaml":"YAML",
  "yml":"YAML"
}

export function toHtml(val, isFull) {
  tocContent = []
  var markedRenderer = new marked.Renderer()
  markedRenderer.paragraph = function(text) {
    var args = arguments
    if(/\[(.*)]{(.*)}/g.test(text)) {
      args[0] = text.replace(/(\[([^\[\]]*)]{([^{}|]*)(\|span|\|p|\|font|\||)})/g, function($1, $2, $3, $4, $5) {
        if($5 == '|' || $5 == '' || $5 == null) {
          $5 = 'p'
        } else {
          $5 = $5.substring(1)
        }
        return '<' + $5 + ' style="' + $4 + '">' + $3 + '</' + $5 + '>'
      })
    }
    if(/\[TOC\]/g.test(text)) {
      args[0] = '<div class="toc"></div>'
    }
    if(/:(.*):/g.test(text)) {
      args[0] = text.replace(/(:.*:)/g, function($1, $2) {
        return emoji.replace_colons($2)
      })
    }
    return marked.Renderer.prototype.paragraph.apply(this, args)
  }
  markedRenderer.heading = function(title, level) {
    var args = arguments
    tocContent.push({title: title, level: level})
    if(/:(.*):/g.test(title)) {
      args[0] = title.replace(/(:.*:)/g, function($1, $2) {
        return emoji.replace_colons($2)
      })
    }
    return marked.Renderer.prototype.heading.apply(this, args)
  }
  markedRenderer.blockquote = function(quote) {
    var args = arguments
    if(/:(.*):/g.test(quote)) {
      args[0] = quote.replace(/(:.*:)/g, function($1, $2) {
        return emoji.replace_colons($2)
      })
    }
    return marked.Renderer.prototype.blockquote.apply(this, args)
  }
  markedRenderer.code = function(code, language) {
    if(language === 'math' || language === "tex") {
      return '<pre class="xkeditor-tex">```' + language +'\n' + code + '\n```</pre>\n'
    }
    if(/flow(TB|BT|RL|LR|TD)$/.test(language)) {
      return '<pre class="xkeditor-mermaid">graph ' + language.substring(language.length-2) + '\n' + code + '</pre>'
    }
    if(language === 'seq') {
      return '<pre class="xkeditor-mermaid">sequenceDiagram\n' + code + '</pre>'
    }
    if(language === 'gantt') {
      return '<pre class="xkeditor-mermaid">gantt\n' + code + '</pre>'
    }
    if(language === 'mermaid') {
      return '<pre class="xkeditor-mermaid">' + code + '</pre>'
    }
    if(isFull) {
      var langTitle = Languages[language] || (language.substring(0, 1).toUpperCase() + language.substring(1)).replace(/s(?=cript)/, 'S')
      var lineNums = '<span></span>'.repeat(code.split('\n').length)
      if(Prism.languages[language] != null && Prism.languages[language] != undefined) {
        return '<div class="code-toolbar"><pre class="line-numbers language-' + language + '"><code class="language-' + language + '">' + Prism.highlight(code, Prism.languages[language], Prism.languages[language]) + '<span aria-hidden="true" class="line-numbers-rows">' + lineNums + '</code></pre><div class="toolbar"><div class="toolbar-item"><a>Copy</a></div><div class="toolbar-item"><span>' + langTitle + '</span></div></div></div>'
      } else {
        return '<pre class="line-numbers language- language-undefined"><code class="language- language-undefined">' + code + '<span aria-hidden="true" class="line-numbers-rows">' + lineNums + '</code></pre>'
      }
    }
    return marked.Renderer.prototype.code.apply(this, arguments)
  }

  marked.setOptions({
    langPrefix: "line-numbers language-",
    renderer: markedRenderer
  })
  return marked(val)
}

export function toMarkdown(htmlVal) {
  var turndownService = new turndown({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*"
  })
  turndownService.keep([
    "iframe",
    "style",
    "script",
    "title",
  ])
  turndownService.use(turndownGfm.gfm)
  turndownService.addRule('mermaid', {
    filter:  function (node) {
      return (node.nodeName === 'PRE')&&(node.classList.contains('xkeditor-mermaid'))
    },
    replacement: function (content, node) {
      return '\n\n```mermaid\n' + node.innerHTML.replace(/(<br \/>|<br>)/g, '\n') + '\n```\n'
    }
  })
  turndownService.addRule('math', {
    filter:  function (node) {
      return (node.nodeName === 'PRE')&&(node.classList.contains('xkeditor-tex'))
    },
    replacement: function (content, node) {
      return node.innerHTML.replace(/(<br \/>|<br>)/g, '\n')
    }
  })
  turndownService.addRule('prismjs', {
    filter:  function (node) {
      return (node.nodeName === 'PRE')&&(node.children.length > 0)&&(node.children[0].nodeName === 'CODE')&&(node.children[0].classList.length > 0)
    },
    replacement: function (content, node) {
      var lang = node.children[0].classList[1].substring(9)
      return '\n```' + lang + '\n' + content.replace(/(<br \/>|<br>)/g, '\n') + '\n```\n\n'
    }
  })
  turndownService.addRule('sup', {
    filter:  function (node) {
      return (node.nodeName === 'SUP')
    },
    replacement: function (content, node) {
      return '<sup>' + content + '</sup>'
    }
  })
  turndownService.addRule('sub', {
    filter:  function (node) {
      return (node.nodeName === 'SUB')
    },
    replacement: function (content, node) {
      return '<sub>' + content + '</sub>'
    }
  })
  turndownService.addRule('havaStyle', {
    filter:  function (node) {
      return (node.nodeName === 'FONT' || node.nodeName === 'P' || node.nodeName === 'SPAN')&&(node.getAttribute('style') !== null)
    },
    replacement: function (content, node) {
      var parseStyle = [
        'color',
        'font-size',
        'padding-left',
        'background-color',
        'text-align',
        'font-family'
      ]
      var out = node.outerHTML
      if(node.style.textDecoration === 'underline') {
        out = '<u>' + content + '</u>'
      } else if(node.style.textDecoration === 'line-through') {
        out = '~' + content + '~'
      } else {
        out = '[' + content + ']{'
        for(let i = 0; i < parseStyle.length; i++) {
          if(node.style[parseStyle[i]] !== '') {
            out += parseStyle[i] + ':' + node.style[parseStyle[i]] + ';'
          }
        }
        if(node.localName === 'p') {
          out += '}'
        } else {
          out += '|' + node.localName + '}'
        }
      }
      return out
    }
  })
  return turndownService.turndown(htmlVal)
}
