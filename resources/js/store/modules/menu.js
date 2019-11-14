import Vue from "vue";
import { dispatchSync } from "../syncActions";

const state = {};

const getters = {};

const actions = {
  menuOperate(
    { dispatch, rootState },
    { operate, type, storage, path, curr = null }
  ) {
    dispatch("tools/hideFloatMenu", null, { root: true });
    if (operate === "delete") {
      dispatch(
        "tools/showSmModal",
        {
          title: "删除",
          content: "是否删除该文件(文件夹)？(此操作不可逆)",
          confirm: () => {
            let info = dispatchSync(
              "note/listOperate",
              {
                operate: "get",
                storage: storage,
                path: path
              }
              // { root: true }
            );
            if (type === "note") {
              dispatch(
                "note/noteOperate",
                {
                  operate: operate,
                  storage: storage,
                  noteInfo: info
                },
                { root: true }
              )
                .then(res => {
                  dispatchSync(
                    "note/listOperate",
                    {
                      operate: "delete",
                      storage: storage,
                      path: path
                    }
                    // { root: true }
                  );
                  dispatch(
                    "toast/timeToast",
                    {
                      message: "删除成功！",
                      status: "success",
                      delay: 1000
                    },
                    { root: true }
                  );
                })
                .catch(err => {
                  dispatch(
                    "toast/timeToast",
                    {
                      message: "删除失败！请重试。",
                      status: "error",
                      delay: 1000
                    },
                    { root: true }
                  );
                });
            } else {
              dispatch(
                "note/folderOperate",
                { operate: operate, noteInfo: info },
                { root: true }
              )
                .then(res => {
                  dispatchSync(
                    "note/listOperate",
                    {
                      operate: "delete",
                      storage: storage,
                      path: path
                    }
                    // { root: true }
                  );
                })
                .then(() => {
                  dispatch(
                    "toast/timeToast",
                    {
                      message: "删除成功！",
                      status: "success",
                      delay: 1000
                    },
                    { root: true }
                  );
                })
                .catch(err => {
                  dispatch(
                    "toast/timeToast",
                    {
                      message: "删除失败！请重试。",
                      status: "error",
                      delay: 1000
                    },
                    { root: true }
                  );
                });
            }
            dispatch("tools/hideSmModal", null, { root: true });
          },
          cancel: () => {
            dispatch("tools/hideSmModal", null, { root: true });
          }
        },
        { root: true }
      );
    }
    if (operate === "rename") {
      // 先获取到旧的Note信息，为了防止对象的变动所以需要克隆对象，利用json转换即可方便克隆对象
      let info = dispatchSync(
        "note/listOperate",
        {
          operate: "get",
          storage: storage,
          path: path
        }
        // { root: true }
      );
      let oldInfo = JSON.parse(JSON.stringify(info));
      // 更改item为输入框
      let input = null;
      if (type === "note") {
        curr.querySelector(".tile-content").setAttribute("children", "input");
        input = curr.querySelector(".tile-content > input");
      } else {
        curr
          .querySelector(".accordion-header")
          .setAttribute("children", "input");
        input = curr.querySelector(".accordion-header > input");
      }
      let keyEv = e => {
        if (e.key === "Enter") {
          let value = e.target.value;
          let newPath = info.path.replace(new RegExp(info.name + "$"), value);
          let oldPath = info.path;
          let s = storage;
          if (type === "note" && storage === "curr") {
            s = rootState.note.currListSource[oldPath].storage;
          }
          let opList = () => {
            dispatchSync("note/listOperate", {
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
            dispatchSync("note/listOperate", {
              operate: "delete",
              storage: storage,
              path: oldPath
            });
          };
          info.path = newPath;
          info.name = value;
          input.setAttribute("disabled", "disabled");
          if (type === "note") {
            dispatch(
              "note/noteOperate",
              {
                operate: operate,
                storage: s,
                noteInfo: {
                  oldNote: oldInfo,
                  note: info
                }
              },
              { root: true }
            )
              .then(res => {
                curr.querySelector(".tile-content").removeAttribute("children");
                input.removeEventListener("keydown", keyEv);
                input.removeAttribute("disabled");
                opList();
                dispatch(
                  "toast/timeToast",
                  {
                    message: "重命名成功！",
                    status: "success",
                    delay: 1000
                  },
                  { root: true }
                );
              })
              .catch(err => {
                info.path = oldInfo.path;
                info.name = oldInfo.name;
                input.removeAttribute("disabled");
                dispatch(
                  "toast/timeToast",
                  {
                    message: "重命名失败！请重试。",
                    status: "error",
                    delay: 1000
                  },
                  { root: true }
                );
              });
          } else {
            dispatch(
              "note/folderOperate",
              {
                operate: operate,
                folderInfo: {
                  oldFolder: oldInfo,
                  folder: info
                }
              },
              { root: true }
            )
              .then(res => {
                curr
                  .querySelector(".accordion-header")
                  .removeAttribute("children");
                input.removeEventListener("keydown", keyEv);
                input.removeAttribute("disabled");
                dispatch("note/loadCloudFolders", null, { root: true });
                dispatch(
                  "toast/timeToast",
                  {
                    message: "重命名成功！",
                    status: "success",
                    delay: 1000
                  },
                  { root: true }
                );
              })
              .catch(err => {
                info.path = oldInfo.path;
                info.name = oldInfo.name;
                input.removeAttribute("disabled");
                dispatch(
                  "toast/timeToast",
                  {
                    message: "重命名失败！请重试。",
                    status: "error",
                    delay: 1000
                  },
                  { root: true }
                );
              });
          }
        }
      };
      input.addEventListener("keydown", keyEv);
    }
    if (operate === "move") {
      dispatch(
        "tools/showLgModal",
        {
          content: "MoveItem",
          data: {
            type: type,
            path: path,
            storage: storage
          }
        },
        { root: true }
      );
    }
    // noteItem专有操作
    if (type === "note") {
      if (operate === "saveLocal") {
        let note = dispatchSync(
          "note/listOperate",
          {
            operate: "get",
            storage: storage,
            path: path
          }
          // { root: true }
        );
        // Path相同的时候视为同一文档，但保存时并未删除，所以需要调整判断
        dispatchSync(
          "note/listOperate",
          {
            operate: "delete",
            storage: "local",
            path: path
          }
          // { root: true }
        );
        if (storage === "curr") {
          if (note.status != "C") {
            note.status = "L";
          }
          // 保存到本地（实际操作）
          dispatch(
            "note/noteOperate",
            {
              operate: "save",
              storage: "local",
              noteInfo: note
            },
            { root: true }
          )
            .then(() => {
              if (rootState.tools.floatMenu.saveAndClose) {
                note = dispatchSync(
                  "note/listOperate",
                  {
                    operate: "delete",
                    storage: "curr",
                    path: path
                  }
                  // { root: true }
                );
                dispatch(
                  "note/setXknoteOpened",
                  JSON.parse(JSON.stringify(rootState.note.noteBaseInfo)),
                  { root: true }
                );
              }
              let localIndex = dispatchSync(
                "note/listOperate",
                {
                  operate: "add",
                  storage: "local",
                  path: path,
                  noteInfo: note
                }
                // { root: true }
              );
              // 若不是从localList中打开的文件就不会有currListSource的信息，如果用户选择不关闭保存，则需要添加source信息，防止后续操作出现问题
              if (!rootState.tools.floatMenu.saveAndClose) {
                dispatch(
                  "note/setCurrListSourceA",
                  {
                    path: path,
                    source: {
                      path: localIndex,
                      storage: "local"
                    }
                  },
                  { root: true }
                );
              }
              dispatch(
                "toast/timeToast",
                {
                  message: "保存到本地成功！",
                  status: "success",
                  delay: 1000
                },
                { root: true }
              );
            })
            .catch(
              err => {
                dispatch("toast/timeToast", {
                  message: "保存到本地失败！",
                  status: "error",
                  delay: 1000
                });
              },
              { root: true }
            );
        }
        if (storage === "cloud") {
          let noteEle = document.querySelector(
            '[data-path="' + path + '"][data-storage="cloud"]'
          );
          let icon = noteEle.querySelector(".tile-action");
          icon.style.display = "unset";
          let btn = icon.querySelector(".btn");
          dispatch(
            "note/noteOperate",
            {
              operate: "read",
              storage: "cloud",
              noteInfo: note
            },
            { root: true }
          )
            .then(data => {
              Vue.set(note, "note", data.note);
              note.status = "C";
              btn.querySelector(".loading").style.display = "none";
              icon.style.display = "";
              dispatch(
                "note/noteOperate",
                {
                  operate: "save",
                  storage: "local",
                  noteInfo: note
                },
                { root: true }
              )
                .then(() => {
                  dispatchSync(
                    "note/listOperate",
                    {
                      operate: "add",
                      storage: "local",
                      path: path,
                      noteInfo: note
                    }
                    // { root: true }
                  );
                  dispatch(
                    "toast/timeToast",
                    {
                      message: "保存到本地成功！",
                      status: "success",
                      delay: 1000
                    },
                    { root: true }
                  );
                })
                .catch(err => {
                  dispatch(
                    "toast/timeToast",
                    {
                      message: "保存到本地失败！请重试。",
                      status: "error",
                      delay: 1000
                    },
                    { root: true }
                  );
                });
            })
            .catch(err => {
              dispatch(
                "toast/timeToast",
                {
                  message: "加载失败！请重试。",
                  status: "error",
                  delay: 1000
                },
                { root: true }
              );
            });
        }
      }
      if (operate === "saveCloud") {
        let note = dispatchSync("note/listOperate", {
          operate: "get",
          storage: storage,
          path: path
        });
        dispatch(
          "toast/showLoadToast",
          {
            message: "保存中..."
          },
          { root: true }
        );
        dispatch(
          "note/noteOperate",
          {
            operate: "save",
            storage: "cloud",
            noteInfo: note
          },
          { root: true }
        )
          .then(() => {
            dispatch("toast/hideLoadToast", null, { root: true });
            note.status = "C";
            if (storage === "curr") {
              if (rootState.note.currListSource[path].storage === "local") {
                dispatch(
                  "note/noteOperate",
                  {
                    operate: "save",
                    storage: "local",
                    noteInfo: note
                  },
                  { root: true }
                );
              }
              if (rootState.tools.floatMenu.saveAndClose) {
                dispatchSync("note/listOperate", {
                  operate: "delete",
                  storage: "curr",
                  path: path
                });
                dispatch(
                  "note/setXknoteOpened",
                  JSON.parse(JSON.stringify(rootState.note.noteBaseInfo)),
                  { root: true }
                );
              }
            }
            if (storage === "local") {
              if (rootState.tools.floatMenu.saveAndClose) {
                dispatch(
                  "note/noteOperate",
                  {
                    operate: "delete",
                    storage: "local",
                    noteInfo: note
                  },
                  { root: true }
                );
                dispatchSync(
                  "note/listOperate",
                  {
                    operate: "delete",
                    storage: storage,
                    path: path
                  }
                  // { root: true }
                );
              } else {
                dispatch(
                  "note/noteOperate",
                  {
                    operate: "save",
                    storage: "local",
                    noteInfo: note
                  },
                  { root: true }
                );
              }
            }
            dispatchSync(
              "note/listOperate",
              {
                operate: "add",
                storage: "cloud",
                path: path,
                noteInfo: note
              }
              // { root: true }
            );
            dispatch(
              "toast/timeToast",
              {
                message: "保存到云端成功！",
                status: "success",
                delay: 1000
              },
              { root: true }
            );
          })
          .catch(err => {
            dispatch(
              "toast/timeToast",
              {
                message: "保存到云端失败！请重试。",
                status: "error",
                delay: 1000
              },
              { root: true }
            );
          });
      }
      if (operate === "closeCurr") {
        // 如果笔记在未保存状态关闭则先弹出modal提示是否下关闭
        let closeCurr = () => {
          if (path == rootState.note.xknoteOpenedIndex.curr) {
            dispatch(
              "note/setXknoteOpened",
              JSON.parse(JSON.stringify(rootState.note.noteBaseInfo)),
              { root: true }
            );
          }
          dispatchSync(
            "note/listOperate",
            {
              operate: "delete",
              storage: "curr",
              path: path
            }
            // { root: true }
          );
        };
        if (
          dispatchSync(
            "note/listOperate",
            { operate: "get", storage: storage, path: path }
            // { root: true }
          ).status === "N"
        ) {
          dispatch(
            "tools/showSmModal",
            {
              title: "关闭",
              content: "该文件未保存，是否关闭该文件？(此操作不可逆)",
              confirm: () => {
                closeCurr();
                dispatch("tools/hideSmModal", null, { root: true });
              },
              cancel: () => {
                dispatch("tools/hideSmModal", null, { root: true });
              }
            },
            { root: true }
          );
        } else {
          closeCurr();
        }
      }
      if (operate === "pushBlog") {
        let note = dispatchSync("note/listOperate", {
          operate: "get",
          storage: storage,
          path: path
        });
        if (storage === "cloud") {
          dispatch(
            "toast/showLoadToast",
            {
              message: "读取中..."
            },
            { root: true }
          );
          dispatch(
            "note/noteOperate",
            {
              operate: "get",
              storage: "cloud",
              noteInfo: note
            },
            { root: true }
          ).then(data => {
            Vue.set(note, "note", data.note);
            dispatch(
              "tools/showLgModal",
              {
                content: "PushBlog",
                data: {
                  title: note.note.title,
                  content: note.note.content
                }
              },
              { root: true }
            );
            dispatch("toast/hideLoadToast", null, { root: true });
          });
        } else {
          dispatch(
            "tools/showLgModal",
            {
              content: "PushBlog",
              data: {
                title: note.note.title,
                content: note.note.content
              }
            },
            { root: true }
          );
        }
      }
    }
    // folderItem专有操作
    if (type === "folder") {
      if (operate.indexOf("git") === 0) {
        dispatch(
          "other/gitOperate",
          { operate: operate, path: path },
          { root: true }
        );
      }
      if (operate === "export") {
        dispatch(
          "note/folderOperate",
          {
            operate: "export",
            folderInfo: {
              path: path
            }
          },
          { root: true }
        );
      }
    }
  },
  floatMenuOperate({ dispatch, rootState }, operate) {
    dispatch("menuOperate", {
      operate: operate,
      type: rootState.tools.floatMenu.data.type,
      storage: rootState.tools.floatMenu.data.storage,
      path: rootState.tools.floatMenu.data.path,
      curr: rootState.tools.floatMenu.data.currEle
    });
  },
  navBarOperate({ dispatch, rootState }, operate) {
    if (operate.indexOf("lshow") === 0) {
      let modal = {};
      modal.content = operate.substring(5);
      dispatch("tools/showLlgModal", modal, { root: true });
    }
    if (operate.indexOf("show") === 0) {
      let modal = {};
      modal.content = operate.substring(4);
      dispatch("tools/showLgModal", modal, { root: true });
    }
    if (operate.indexOf("git") === 0) {
      let path = rootState.note.xknoteOpened.path;
      dispatch(
        "other/gitOperate",
        {
          operate: operate,
          path: path.substring(0, path.indexOf("/", 1))
        },
        { root: true }
      );
    }
    if (operate === "saveLocal" || operate === "saveCloud") {
      dispatch("tools/setSaveAndClose", false, { root: true });
      dispatch("menuOperate", {
        operate: operate,
        type: "note",
        storage: "curr",
        path: rootState.note.xknoteOpenedIndex.curr
      });
    }
    if (operate === "saveAllLocal" || operate === "saveAllCloud") {
      dispatch("tools/setSaveAndClose", false, { root: true });
      for (let key in rootState.note.currList) {
        dispatch("menuOperate", {
          operate: operate.replace("All", ""),
          type: "note",
          storage: "curr",
          path: key
        });
      }
    }
    if (operate === "downloadMarkdown") {
      window.XKEditor.download(
        rootState.note.xknoteOpened.name.replace(".md", ""),
        "markdown"
      );
    }
    if (operate === "downloadHTML") {
      window.XKEditor.download(
        rootState.note.xknoteOpened.name.replace(".md", ""),
        "html"
      );
    }
    if (operate === "downloadFullHTML") {
      window.XKEditor.download(
        rootState.note.xknoteOpened.name.replace(".md", ""),
        "fullhtml"
      );
    }
    if (operate === "logout") {
      dispatch("other/logout", null, { root: true });
    }
  }
};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
