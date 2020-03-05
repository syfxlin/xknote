import store from "../../store";

export default {
  note({ storage, path, type, currEle }) {
    let modal = {};
    modal.operate = "CreateNote";
    modal.data = { select: path, storage: "cloud" };
    store.dispatch("tools/showMiModal", modal);
  },
  folder({ storage, path, type, currEle }) {
    let modal = {};
    modal.operate = "CreateFolder";
    modal.data = { select: path, storage: "cloud" };
    store.dispatch("tools/showMiModal", modal);
  }
};
