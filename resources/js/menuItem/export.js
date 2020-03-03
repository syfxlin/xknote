import store from "../store";

export default {
  name: "打包导出",
  operate: "export",
  handler({ storage, path, type, currEle }) {
    store.dispatch("note/folderOperate", {
      operate: "export",
      folderInfo: {
        path: path
      }
    });
  }
};
