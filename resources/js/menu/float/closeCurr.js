import store from "../../store";

export default {
  name: "关闭",
  operate: "closeCurr",
  handler({ storage, path, type, currEle }) {
    // 如果笔记在未保存状态关闭则先弹出modal提示是否下关闭
    var closeCurr = function closeCurr() {
      if (path == store.state.note.xknoteOpenedIndex.curr) {
        store.dispatch(
          "note/setXknoteOpened",
          JSON.parse(JSON.stringify(store.state.note.noteBaseInfo))
        );
      }

      store.dispatchSync("note/listOperate", {
        operate: "delete",
        storage: "curr",
        path: path
      });
    };

    if (
      store.dispatchSync("note/listOperate", {
        operate: "get",
        storage: storage,
        path: path
      }).status === "N"
    ) {
      store.dispatch("tools/showSmModal", {
        title: "关闭",
        operate: "该文件未保存，是否关闭该文件？(此操作不可逆)",
        confirm: function confirm() {
          closeCurr();
          store.dispatch("tools/hideSmModal", null);
        },
        cancel: function cancel() {
          store.dispatch("tools/hideSmModal", null);
        }
      });
    } else {
      closeCurr();
    }
  }
};
