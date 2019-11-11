[graff]{6b3117}

# XK-Editor

> 一个支持富文本和Markdown的编辑器

![Version](https://img.shields.io/github/release/syfxlin/xkeditor.svg?label=Version&style=flat-square) ![Author](https://img.shields.io/badge/Author-Otstar%20Lin-blue.svg?style=flat-square) ![Lincense](https://img.shields.io/github/license/syfxlin/xkeditor.svg?style=flat-square) ![](https://img.shields.io/github/issues/syfxlin/xkeditor.svg?style=flat-square)

## 简介 Introduction

`XK-Editor` = `Vue2.0` + `Ace` + `TinyMCE`;

XK-Editor支持富文本编辑和Markdown，同时可以在Markdown和HTML互转，满足各种人的需求。

## 特性 Feature

-   \[两种编辑器\] 支持富文本编辑和Markdown编辑
-   \[两种格式互转\] 支持Markdown和HTML互转
-   \[打字机模式\] 支持打字机模式，编辑时无需使用鼠标滚轮，并可调节定位位置，满足各种屏幕和使用者的需求
-   \[下载\] 支持导出下载Markdown和HTML格式的文件
-   \[即时保存\] 支持即时保存到浏览器，无惧网络波动
-   \[移动端优化\] 优化移动端的编辑体验，支持惯性滚动，并默认关闭实时预览
-   \[滚动绑定\] 支持双向/单向滚动绑定，使预览能够跟随输入
-   \[树形TOC\] 目录可折叠，不用再翻阅很久来定位
-   \[自定义主题\] 支持自定义主题，可以通过替换CSS来更换显示样式
-   \[Emoji表情\] 支持Github语法的表情`:smile:`
-   \[Task lists\] 支持创建Task列表
-   \[TeX公式\] 支持插入KaTex公式
-   \[流程图/时序图/甘特图\] 支持mermaid语法编写各种图
-   \[解析HTML\] 支持解析各种HTML标签，并支持过滤标签
-   \[独有的扩展语法\] 支持通过`[text]{style|label}`的方式解析文字
-   \[自动补全\] 支持语法自动补全
-   \[图片上传\] 支持图片上传
-   还有多种神奇的功能等待你的发掘。

---

[TOC]

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

### 字符效果和横线等

---

~删除线~ *斜体字* **粗体** **粗体** ***粗斜体***

上标：X<sub>2</sub>，下标：O<sup>2</sup>

### 特有语法

[这是带有CSS的文字]{color:blue}

[这是带有CSS的文字]{background:#ddd|span}

[这是带有CSS的文字]{text-align:center}

### 引用 Blockquotes

> 引用文本 Blockquotes

中间可以书写其他普通文本

> 引用：如果想要插入空白换行`即<br />标签`，在插入处先键入两个以上的空格然后回车即可，[普通链接](http://localhost/)。

### 锚点与链接 Links

[普通链接](http://localhost/)

[普通链接带标题](http://localhost/ "普通链接带标题")

[锚点链接](#锚点与链接-links)

### 行内代码 Inline code

执行命令：`npm install marked`

### 缩进风格

即缩进四个空格，也做为实现类似 `<pre>` 预格式化文本 ( Preformatted Text ) 的功能。



预格式化文本：

```
| First Header | Second Header |
|--------------|---------------|
| Content Cell | Content Cell  |
| Content Cell | Content Cell  |
```

#### JS代码　

```javascript
importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@3.6.3/workbox/workbox-sw.js');
workbox.setConfig({
    modulePathPrefix:'https://cdn.jsdelivr.net/npm/workbox-cdn@3.6.3/workbox/'
});

if (workbox) {
  console.log(`Yay! Workbox is loaded ?`);
} else {
  console.log(`Boo! Workbox didn't load ?`);
}
```

#### HTML 代码 HTML codes

```html
<!DOCTYPE html>
<html>
    <head>
        <mate charest="utf-8" />
        <title>Hello world!</title>
    </head>
    <body>
        <h1>Hello world!</h1>
    </body>
</html>
```

### 图片 Images

![](https://www.ixk.me/bg.jpg)
![](https://cn.bing.com/th?id=OHR.CoastalFog_EN-CN6289780759_800x480.jpg)

---

### 列表 Lists

#### 无序列表 Unordered Lists1

-   列表一
-   列表二
-   列表三

#### 无序列表 Unordered Lists2

-   列表一
-   列表二
    -   列表二-1
    -   列表二-2
    -   列表二-3
-   列表三
    -   列表一
    -   列表二
    -   列表三

#### 有序列表 Ordered Lists

1.  第一行
2.  第二行
3.  第三行

#### GFM task list

-   [x]  GFM task list 1
-   [x]  GFM task list 2
-   [ ]  GFM task list 3
    -   [ ]  GFM task list 3-1
    -   [ ]  GFM task list 3-2
    -   [ ]  GFM task list 3-3
-   [ ]  GFM task list 4
    -   [ ]  GFM task list 4-1
    -   [ ]  GFM task list 4-2

---

### 绘制表格 Tables

| First Header | Second Header |
|--------------|---------------|
| Content Cell | Content Cell  |
| Content Cell | Content Cell  |

| Function name | Description                |
|---------------|----------------------------|
| `help()`      | Display the help window.   |
| `destroy()`   | **Destroy your computer!** |

| Left-Aligned  | Center Aligned  | Right Aligned |
|---------------|-----------------|---------------|
| col 3 is      | some wordy text | $1600         |
| col 2 is      | centered        | $12           |
| zebra stripes | are neat        | $1            |

---

### Emoji表情 :smiley:

:smiley:

### 科学公式 TeX(KaTeX)

$$E=mc^2$$

$$x > y$$

$$(\\sqrt{3x-1}+(1+x)^2)$$

$$\\sin(\\alpha)^{\\theta}=\\sum\_{i=0}^{n}(x^i + \\cos(f))$$

```math
\\sin(\\alpha)^{\\theta}=\\sum\_{i=0}^{n}(x^i + \\cos(f))
```

### 流程图

```flowTD
A-->B;
A-->C;
B-->D;
C-->D;
```

### 时序图

```seq
participant Alice
participant Bob
Alice->John: Hello John, how are you?
loop Healthcheck
    John->John: Fight against hypochondria
end
Note right of John: Rational thoughts <br/>prevail...
John-->Alice: Great!
John->Bob: How about you?
Bob-->John: Jolly good!
```

### 甘特图

```gantt
dateFormat  YYYY-MM-DD
title Adding GANTT diagram functionality to mermaid
section A section
Completed task            :done,    des1, 2014-01-06,2014-01-08
Active task               :active,  des2, 2014-01-09, 3d
Future task               :         des3, after des2, 5d
Future task2               :         des4, after des3, 5d
section Critical tasks
Completed task in the critical line :crit, done, 2014-01-06,24h
Implement parser and jison          :crit, done, after des1, 2d
Create tests for parser             :crit, active, 3d
Future task in critical line        :crit, 5d
Create tests for renderer           :2d
Add to mermaid                      :1d
```
