import store from "../../store";

export default {
  push({ storage, path, type, currEle }) {
    store.dispatch("other/gitOperate", { operate: "gitPush", path: path });
  },
  pull({ storage, path, type, currEle }) {
    store.dispatch("other/gitOperate", { operate: "gitPull", path: path });
  },
  initClone({ storage, path, type, currEle }) {
    store.dispatch("other/gitOperate", {
      operate: "gitInitClone",
      path: path
    });
  },
  pushForce({ storage, path, type, currEle }) {
    store.dispatch("other/gitOperate", {
      operate: "gitPushForce",
      path: path
    });
  },
  config({ storage, path, type, currEle }) {
    store.dispatch("other/gitOperate", { operate: "gitConfig", path: path });
  },
  status({ storage, path, type, currEle }) {
    store.dispatch("other/gitOperate", { operate: "gitStatus", path: path });
  },
  diff({ storage, path, type, currEle }) {
    store.dispatch("other/gitOperate", { operate: "gitDiff", path: path });
  }
};
