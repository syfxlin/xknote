# XK-Note

> 一个集各种神奇功能的云笔记

![Version](https://img.shields.io/github/release/syfxlin/xknote.svg?label=Version&style=flat) ![Author](https://img.shields.io/badge/Author-Otstar%20Lin-blue.svg?style=flat) ![PHP](https://img.shields.io/badge/php-5.6%2B-green.svg?style=flat) ![Lincense](https://img.shields.io/github/license/syfxlin/xknote.svg?style=flat)

## 目录 Contents
- [XK-Note](#xk-note)
  - [目录 Contents](#%E7%9B%AE%E5%BD%95-contents)
  - [简介 Introduction](#%E7%AE%80%E4%BB%8B-introduction)
  - [特性 Feature](#%E7%89%B9%E6%80%A7-feature)
  - [演示 Demo](#%E6%BC%94%E7%A4%BA-demo)
  - [安装 Install](#%E5%AE%89%E8%A3%85-install)
  - [文档 Doc](#%E6%96%87%E6%A1%A3-doc)
  - [维护者 Maintainer](#%E7%BB%B4%E6%8A%A4%E8%80%85-maintainer)
  - [许可证 License](#%E8%AE%B8%E5%8F%AF%E8%AF%81-license)
  - [渲染 Render](#%E6%B8%B2%E6%9F%93-render)

## 简介 Introduction

`XK-Note` = `Laravel` . `ZUI` . `Editor.md`;
一个由上方代码组成，集各种神奇功能的云笔记。

## 特性 Feature

- [云存储] 云端撰写笔记，随时保存，多端同步。
- [跨平台] 多平台支持，撰写查阅只需一个浏览器，无惧任何不兼容情况。
- [响应式] 所有页面均采用响应式设计，即使尺寸极小的设备也能保持良好的体验。
- [在线浏览] 拥有独立的浏览模式，查看笔记不再困扰。
- [Git同步支持] 独有的Git支持，支持版本控制，无惧误操作，随时从旧版本恢复笔记。
- [浏览器临时保存] 独有的浏览器端保存功能，即使断网了也能安心写作，无惧任何网络波动。
- [多用户] 笔记主要面向个人使用，但是也支持多人同时使用，每个用户的笔记互相隔离保存，无需担心笔记泄露。
- [导出笔记] 支持多种导出格式，保存为MD文件，html文件，由本地即时生成，无需繁琐的操作。
- [多种模式] 拥有多种模式，写作，预览，阅读，满足各种人的需求。
- 还有多种神奇的功能等待你的发掘。

## 演示 Demo

[XK-Note](https://note.ixk.me)

## 安装 Install

1. 前往 [Release](https://github.com/syfxlin/xknote/releases) 下载，然后上传至服务器，并解压到网站根目录
2. 安装依赖
```bash
# Ubuntu/Debian 其他系统请自行查阅
sudo apt-get install curl git
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```
3. 进入网站根目录，并执行以下命令
```bash
composer install
php artisan storage:link
```
4. 将根目录下的`xknote.sql`文件导入到数据库中，并确认是否导入成功
5. 修改`.env`文件，将数据库信息填入`.env`文件中，并关闭调试模式
```
APP_DEBUG=false
```
6. 修改网站的运行目录到`public`
7. 打开网站，注册一个账户，并确认账户`id`是否为`1`(账户id为1代表管理员)
8. enjoy

## 文档 Doc

暂无

## 维护者 Maintainer

XK-Note 由 [Otstar Lin](https://ixk.me/)和下列[贡献者](https://github.com/syfxlin/xknote/graphs/contributors)的帮助下撰写和维护。

> Otstar Lin - [Personal Website](https://ixk.me/) · [Blog](https://blog.ixk.me/) · [Github](https://github.com/syfxlin)

## 许可证 License

![lincense](https://img.shields.io/github/license/syfxlin/xknote.svg?style=flat)

根据 Apache License 2.0 许可证开源。

## 渲染 Render

![ScreenShot-1](https://raw.githubusercontent.com/syfxlin/xknote/master/screenshot-1.png)
![ScreenShot-2](https://raw.githubusercontent.com/syfxlin/xknote/master/screenshot-2.png)
![ScreenShot-3](https://raw.githubusercontent.com/syfxlin/xknote/master/screenshot-3.png)
![ScreenShot-4](https://raw.githubusercontent.com/syfxlin/xknote/master/screenshot-4.png)
