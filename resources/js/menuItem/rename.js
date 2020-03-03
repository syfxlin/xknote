import store from "../store";

export default {
  name: "重命名",
  operate: "rename",
  handler({ storage, path, type, currEle }) {
    // 先获取到旧的Note信息，为了防止对象的变动所以需要克隆对象，利用json转换即可方便克隆对象
    let info = store.dispatchSync("note/listOperate", {
      operate: "get",
      storage: storage,
      path: path
    });
    let oldInfo = JSON.parse(JSON.stringify(info));
    // 更改item为输入框
    let input = null;
    if (type === "note") {
      currEle.querySelector(".tile-content").setAttribute("children", "input");
      input = currEle.querySelector(".tile-content > input");
    } else {
      currEle
        .querySelector(".accordion-header")
        .setAttribute("children", "input");
      input = currEle.querySelector(".accordion-header > input");
    }
    let keyEv = e => {
      if (e.key === "Enter") {
        let value = e.target.value;
        // let newPath = info.path.replace(new RegExp(info.name + "$"), value);
        let newPath =
          info.path.substring(0, info.path.length - info.name.length) + value;
        let oldPath = info.path;
        let s = storage;
        if (type === "note" && storage === "curr") {
          s = store.state.note.currListSource[oldPath].storage;
        }
        let opList = () => {
          store.dispatchSync("note/listOperate", {
            operate: "add",
            storage: storage,
            path: newPath,
            noteInfo:
              storage === "curr"
                ? {
                    note: info,
                    source: {
                      path: newPath,
                      storage: s
                    }
                  }
                : info
          });
          store.dispatchSync("note/listOperate", {
            operate: "delete",
            storage: storage,
            path: oldPath
          });
        };
        info.path = newPath;
        info.name = value;
        input.setAttribute("disabled", "disabled");
        if (type === "note") {
          store
            .dispatch("note/noteOperate", {
              operate: "rename",
              storage: s,
              noteInfo: {
                oldNote: oldInfo,
                note: info
              }
            })
            .then(res => {
              currEle
                .querySelector(".tile-content")
                .removeAttribute("children");
              input.removeEventListener("keydown", keyEv);
              input.removeAttribute("disabled");
              opList();
              store.dispatch("toast/timeToast", {
                message: "重命名成功！",
                status: "success",
                delay: 1000
              });
            })
            .catch(err => {
              info.path = oldInfo.path;
              info.name = oldInfo.name;
              input.removeAttribute("disabled");
              store.dispatch("toast/timeToast", {
                message:
                  "重命名失败！请重试。(" + err.response.data.error + ")",
                status: "error",
                delay: 1000
              });
            });
        } else {
          store
            .dispatch("note/folderOperate", {
              operate: "rename",
              folderInfo: {
                oldFolder: oldInfo,
                folder: info
              }
            })
            .then(res => {
              currEle
                .querySelector(".accordion-header")
                .removeAttribute("children");
              input.removeEventListener("keydown", keyEv);
              input.removeAttribute("disabled");
              store.dispatch("note/loadCloudFolders", null);
              store.dispatch("toast/timeToast", {
                message: "重命名成功！",
                status: "success",
                delay: 1000
              });
            })
            .catch(err => {
              info.path = oldInfo.path;
              info.name = oldInfo.name;
              input.removeAttribute("disabled");
              store.dispatch("toast/timeToast", {
                message:
                  "重命名失败！请重试。(" + err.response.data.error + ")",
                status: "error",
                delay: 1000
              });
            });
        }
      }
    };
    input.addEventListener("keydown", keyEv);
  }
};
