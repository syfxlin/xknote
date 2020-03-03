import Vue from "vue";
import store from "../store";

export default {
  cloud: {
    name: "保存到云端",
    operate: "saveCloud",
    handler({ storage, path, type, currEle }) {
      let note = store.dispatchSync("note/listOperate", {
        operate: "get",
        storage: storage,
        path: path
      });
      store.dispatch("toast/showLoadToast", {
        message: "保存中..."
      });
      store
        .dispatch("note/noteOperate", {
          operate: "save",
          storage: "cloud",
          noteInfo: note
        })
        .then(() => {
          store.dispatch("toast/hideLoadToast", null);
          note.status = "C";
          if (storage === "curr") {
            if (store.state.note.currListSource[path].storage === "local") {
              store.dispatch("note/noteOperate", {
                operate: "save",
                storage: "local",
                noteInfo: note
              });
            }
            if (store.state.tools.floatMenu.saveAndClose) {
              store.dispatchSync("note/listOperate", {
                operate: "delete",
                storage: "curr",
                path: path
              });
              store.dispatch(
                "note/setXknoteOpened",
                JSON.parse(JSON.stringify(store.state.note.noteBaseInfo))
              );
            }
          }
          if (storage === "local") {
            if (store.state.tools.floatMenu.saveAndClose) {
              store.dispatch("note/noteOperate", {
                operate: "delete",
                storage: "local",
                noteInfo: note
              });
              store.dispatchSync("note/listOperate", {
                operate: "delete",
                storage: storage,
                path: path
              });
            } else {
              store.dispatch("note/noteOperate", {
                operate: "save",
                storage: "local",
                noteInfo: note
              });
            }
          }
          store.dispatchSync("note/listOperate", {
            operate: "add",
            storage: "cloud",
            path: path,
            noteInfo: note
          });
          store.dispatch("toast/timeToast", {
            message: "保存到云端成功！",
            status: "success",
            delay: 1000
          });
        })
        .catch(err => {
          store.dispatch("toast/hideLoadToast", null);
          store.dispatch("toast/timeToast", {
            message:
              "保存到云端失败！请重试。(" + err.response.data.error + ")",
            status: "error",
            delay: 1000
          });
        });
    }
  },
  local: {
    name: "保存到本地",
    operate: "saveLocal",
    handler({ storage, path, type, currEle }) {
      let note = store.dispatchSync("note/listOperate", {
        operate: "get",
        storage: storage,
        path: path
      });
      // Path相同的时候视为同一文档，但保存时并未删除，所以需要调整判断
      store.dispatchSync("note/listOperate", {
        operate: "delete",
        storage: "local",
        path: path
      });
      if (storage === "curr") {
        if (note.status != "C") {
          note.status = "L";
        }
        // 保存到本地（实际操作）
        store
          .dispatch("note/noteOperate", {
            operate: "save",
            storage: "local",
            noteInfo: note
          })
          .then(() => {
            if (store.state.tools.floatMenu.saveAndClose) {
              note = store.dispatchSync("note/listOperate", {
                operate: "delete",
                storage: "curr",
                path: path
              });
              store.dispatch(
                "note/setXknoteOpened",
                JSON.parse(JSON.stringify(store.state.note.noteBaseInfo))
              );
            }
            let localIndex = store.dispatchSync("note/listOperate", {
              operate: "add",
              storage: "local",
              path: path,
              noteInfo: note
            });
            // 若不是从localList中打开的文件就不会有currListSource的信息，如果用户选择不关闭保存，则需要添加source信息，防止后续操作出现问题
            if (!store.state.tools.floatMenu.saveAndClose) {
              store.dispatch("note/setCurrListSourceA", {
                path: path,
                source: {
                  path: localIndex,
                  storage: "local"
                }
              });
            }
            store.dispatch("toast/timeToast", {
              message: "保存到本地成功！",
              status: "success",
              delay: 1000
            });
          })
          .catch(err => {
            store.dispatch("toast/timeToast", {
              message: "保存到本地失败！",
              status: "error",
              delay: 1000
            });
          });
      }
      if (storage === "cloud") {
        let noteEle = document.querySelector(
          '[data-path="' + path + '"][data-storage="cloud"]'
        );
        let icon = noteEle.querySelector(".tile-action");
        icon.style.display = "unset";
        let btn = icon.querySelector(".btn");
        store
          .dispatch("note/noteOperate", {
            operate: "read",
            storage: "cloud",
            noteInfo: note
          })
          .then(data => {
            Vue.set(note, "note", data.note);
            note.status = "C";
            btn.querySelector(".loading").style.display = "none";
            icon.style.display = "";
            store
              .dispatch("note/noteOperate", {
                operate: "save",
                storage: "local",
                noteInfo: note
              })
              .then(() => {
                store.dispatchSync("note/listOperate", {
                  operate: "add",
                  storage: "local",
                  path: path,
                  noteInfo: note
                });
                store.dispatch("toast/timeToast", {
                  message: "保存到本地成功！",
                  status: "success",
                  delay: 1000
                });
              })
              .catch(err => {
                store.dispatch("toast/timeToast", {
                  message: "保存到本地失败！请重试。",
                  status: "error",
                  delay: 1000
                });
              });
          })
          .catch(err => {
            store.dispatch("toast/timeToast", {
              message: "加载失败！请重试。(" + err.response.data.error + ")",
              status: "error",
              delay: 1000
            });
          });
      }
    }
  }
};
