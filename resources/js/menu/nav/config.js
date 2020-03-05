import store from "../../store";

export default {
  personalCenter: {
    name: "个人中心",
    operate: "personalCenter",
    handler() {
      store.dispatch("tools/showMiModal", {
        operate: "PersonalCenter"
      });
    }
  },
  userConfig: {
    name: "用户设置",
    operate: "userConfig",
    handler() {
      store.dispatch("tools/showMiModal", {
        operate: "UserConfig"
      });
    }
  },
  gitConfig: {
    name: "Git设置",
    operate: "gitConfig",
    handler() {
      store.dispatch("tools/showMiModal", {
        operate: "GitConfig"
      });
    }
  },
  blogConfig: {
    name: "博客设置",
    operate: "blogConfig",
    handler() {
      store.dispatch("tools/showMiModal", {
        operate: "BlogConfig"
      });
    }
  },
  systemConfig: {
    name: "系统管理",
    operate: "systemConfig",
    handler() {
      store.dispatch("tools/showMiModal", {
        operate: "SystemConfig"
      });
    }
  }
};
