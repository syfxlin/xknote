import store from "../store";

export default {
  note: {
    name: "新建笔记",
    operate: "createNote",
    handler({ storage, path, type, currEle }) {
      let modal = {};
      modal.operate = "CreateNote";
      modal.data = { select: path, storage: "cloud" };
      store.dispatch("tools/showMiModal", modal);
    }
  },
  folder: {
    name: "新建文件夹",
    operate: "createFolder",
    handler({ storage, path, type, currEle }) {
      let modal = {};
      modal.operate = "CreateFolder";
      modal.data = { select: path, storage: "cloud" };
      store.dispatch("tools/showMiModal", modal);
    }
  }
};
