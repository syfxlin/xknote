import store from "../store";

export default {
  push: {
    name: "Push",
    operate: "gitPush",
    handler({ storage, path, type, currEle }) {
      store.dispatch("other/gitOperate", { operate: "gitPush", path: path });
    }
  },
  pull: {
    name: "Pull",
    operate: "gitPull",
    handler({ storage, path, type, currEle }) {
      store.dispatch("other/gitOperate", { operate: "gitPull", path: path });
    }
  },
  initClone: {
    name: "Init Clone",
    operate: "gitInitClone",
    handler({ storage, path, type, currEle }) {
      store.dispatch("other/gitOperate", {
        operate: "gitInitClone",
        path: path
      });
    }
  },
  pushForce: {
    name: "Push Force",
    operate: "gitPushForce",
    handler({ storage, path, type, currEle }) {
      store.dispatch("other/gitOperate", {
        operate: "gitPushForce",
        path: path
      });
    }
  },
  config: {
    name: "Git Config",
    operate: "gitConfig",
    handler({ storage, path, type, currEle }) {
      store.dispatch("other/gitOperate", { operate: "gitConfig", path: path });
    }
  },
  status: {
    name: "Status",
    operate: "gitStatus",
    handler({ storage, path, type, currEle }) {
      store.dispatch("other/gitOperate", { operate: "gitStatus", path: path });
    }
  },
  diff: {
    name: "Diff",
    operate: "gitDiff",
    handler({ storage, path, type, currEle }) {
      store.dispatch("other/gitOperate", { operate: "gitDiff", path: path });
    }
  }
};
