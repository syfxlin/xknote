import store from "../../store";

export default {
  name: "删除",
  operate: "delete",
  handler({ storage, path, type, currEle }) {
    store.dispatch("tools/showSmModal", {
      title: "删除",
      operate: "是否删除该文件(文件夹)？(此操作不可逆)",
      confirm: {
        content: "删除",
        handler: () => {
          let info = store.dispatchSync("note/listOperate", {
            operate: "get",
            storage: storage,
            path: path
          });
          if (type === "note") {
            store
              .dispatch("note/noteOperate", {
                operate: "delete",
                storage: storage,
                noteInfo: info
              })
              .then(res => {
                store.dispatchSync("note/listOperate", {
                  operate: "delete",
                  storage: storage,
                  path: path
                });
                store.dispatch("toast/timeToast", {
                  message: "删除成功！",
                  status: "success",
                  delay: 1000
                });
              })
              .catch(err => {
                store.dispatch("toast/timeToast", {
                  message:
                    "删除失败！请重试。(" + err.response.data.error + ")",
                  status: "error",
                  delay: 1000
                });
              });
          } else {
            store
              .dispatch("note/folderOperate", {
                operate: "delete",
                folderInfo: info
              })
              .then(res => {
                store.dispatchSync("note/listOperate", {
                  operate: "delete",
                  storage: storage,
                  path: path
                });
              })
              .then(() => {
                store.dispatch("toast/timeToast", {
                  message: "删除成功！",
                  status: "success",
                  delay: 1000
                });
              })
              .catch(err => {
                store.dispatch("toast/timeToast", {
                  message:
                    "删除失败！请重试。(" + err.response.data.error + ")",
                  status: "error",
                  delay: 1000
                });
              });
          }
          store.dispatch("tools/hideSmModal", null);
        }
      },
      cancel: {
        content: "取消",
        handler: () => {
          store.dispatch("tools/hideSmModal", null);
        }
      }
    });
  }
};
