import save from "./save";
import download from "./download";
import operate from "./operate";
import create from "./create";
import config from "./config";
import image from "./image";

const conter = {
  save: {
    ...save.cloud,
    isRight: true,
    items: [save.local, save.allCloud, save.allLocal]
  },
  download: {
    name: "导出",
    isRight: true,
    items: [
      download.downloadMarkdown,
      download.downloadHTML,
      download.downloadFullHTML
    ]
  },
  operate: {
    name: "操作",
    isRight: true,
    items: [
      operate.noteHistory,
      operate.gitPush,
      operate.gitPull,
      operate.gitInitClone,
      operate.gitPushForce,
      operate.gitConfig
    ]
  }
};

const right = {
  create: {
    ...create.note,
    style: "btn-primary",
    isRight: true,
    items: [create.folder]
  },
  config: {
    name: window.xknote.nickname,
    style: "btn-link",
    isRight: true,
    items: [
      config.personalCenter,
      config.userConfig,
      config.gitConfig,
      config.blogConfig,
      config.systemConfig,
      { name: "divider", content: null },
      { name: "登出", operate: "logout" }
    ]
  },
  image: image
};

export function getNavItem(pos) {
  switch (pos) {
    case "center":
      return conter;
    case "right":
      if (window.xknote.user_id != "1") {
        right.config.items.splice(4, 1);
      }
      return right;
  }
}
