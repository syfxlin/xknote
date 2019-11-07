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
          dispatchSync(
            "note/listOperate",
            {
              operate: "add",
              storage: storage,
              path: newPath,
              noteInfo: {
                note: info,
                source: {
                  path: newPath,
                  storage: rootState.note.currListSource[info.path].storage
                }
              }
            }
            // { root: true }
          );
          dispatchSync(
            "note/listOperate",
            {
              operate: "delete",
              storage: storage,
              path: info.path
            }
            // { root: true }
          );
          // TODO: 修复
          info.path = newPath;
          info.name = value;
          input.setAttribute("disabled", "disabled");
          if (type === "note") {
            let s = storage;
            if (storage === "curr") {
              s = rootState.note.currListSource[newPath].storage;
            }
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
        let note = dispatchSync(
          "note/listOperate",
          {
            operate: "get",
            storage: storage,
            path: path
          }
          // { root: true }
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
                dispatchSync(
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
                  JSON.parse(JSON.stringify(rootState.note.noteBaseInfo))
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
    if (operate.indexOf("show") === 0) {
      let modal = {};
      modal.content = operate.substring(4);
      if (modal.content === "CreateNote") {
        modal.title = "新建MD笔记";
        let wTimeout = null;
        let watch = () => {
          if (wTimeout) {
            clearTimeout(wTimeout);
          }
          wTimeout = setTimeout(() => {
            dispatch(
              "tools/setLgModalData",
              {
                ...rootState.tools.lgModal.data,
                status: "loading"
              },
              { root: true }
            );
            // TODO: 设置格式
            if (!/\.(md|txt)/gi.test(rootState.tools.lgModal.data.filename)) {
              dispatch(
                "tools/setLgModalData",
                {
                  ...rootState.tools.lgModal.data,
                  status: "error"
                },
                { root: true }
              );
              return;
            }
            dispatch(
              "note/noteOperate",
              {
                operate: "exist",
                storage: rootState.tools.lgModal.data.storage,
                noteInfo: {
                  path:
                    rootState.tools.lgModal.data.select +
                    "/" +
                    rootState.tools.lgModal.data.filename
                }
              },
              { root: true }
            ).then(data => {
              if (data.exist) {
                dispatch(
                  "tools/setLgModalData",
                  {
                    ...rootState.tools.lgModal.data,
                    status: "error"
                  },
                  { root: true }
                );
              } else {
                dispatch(
                  "tools/setLgModalData",
                  {
                    ...rootState.tools.lgModal.data,
                    status: ""
                  },
                  { root: true }
                );
              }
            });
          }, 500);
        };
        let uwFileName = this.watch(state => {
          return state.tools.lgModal.data.filename;
        }, watch);
        let uwTitle = this.watch(state => {
          return state.tools.lgModal.data.select;
        }, watch);
        let uwStorage = this.watch(state => {
          return state.tools.lgModal.data.storage;
        }, watch);
        modal.confirm = () => {
          if (
            !rootState.tools.lgModal.data.filename ||
            !rootState.tools.lgModal.data.title ||
            !rootState.tools.lgModal.data.storage ||
            rootState.tools.lgModal.data.status !== ""
          ) {
            return;
          }
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.add("loading");
          let d = new Date();
          let date =
            d.getFullYear() +
            "/" +
            (d.getMonth() + 1) +
            "/" +
            d.getDate() +
            " " +
            d.getHours() +
            ":" +
            d.getMinutes() +
            ":" +
            d.getSeconds();
          let path =
            rootState.tools.lgModal.data.select +
            "/" +
            rootState.tools.lgModal.data.filename;
          let noteInfo = {
            type: "note",
            path: path,
            name: rootState.tools.lgModal.data.filename,
            status: "N",
            note: {
              title: rootState.tools.lgModal.data.title,
              created_at: date,
              updated_at: date,
              author: "",
              content: ""
            }
          };
          dispatch(
            "note/openNote",
            {
              note: noteInfo,
              source: {
                path: path,
                storage: rootState.tools.lgModal.data.storage
              },
              mode: "normal",
              isNew: true
            },
            { root: true }
          );
          dispatchSync("note/listOperate", {
            operate: "add",
            storage: rootState.tools.lgModal.data.storage,
            path: path,
            noteInfo: noteInfo
          });
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.remove("loading");
          rootState.tools.lgModal.cancel();
        };
        modal.cancel = () => {
          uwFileName();
          uwTitle();
          uwStorage();
          dispatch("tools/hideLgModal", null, { root: true });
        };
        dispatch(
          "note/folderOperate",
          { operate: "readOnly", folderInfo: null },
          { root: true }
        ).then(data => {
          dispatch(
            "tools/setLgModalData",
            {
              ...rootState.tools.lgModal.data,
              folders: data.folders
            },
            { root: true }
          );
        });
        dispatch("tools/showLgModal", modal, { root: true });
      }
      if (modal.content === "CreateFolder") {
        modal.title = "新建文件夹";
        let wTimeout = null;
        let watch = () => {
          if (wTimeout) {
            clearTimeout(wTimeout);
          }
          wTimeout = setTimeout(() => {
            dispatch(
              "tools/setLgModalData",
              {
                ...rootState.tools.lgModal.data,
                status: "loading"
              },
              { root: true }
            );
            dispatch(
              "note/folderOperate",
              {
                operate: "exist",
                folderInfo: {
                  path:
                    rootState.tools.lgModal.data.select +
                    "/" +
                    rootState.tools.lgModal.data.foldername
                }
              },
              { root: true }
            ).then(data => {
              if (data.exist) {
                dispatch(
                  "tools/setLgModalData",
                  {
                    ...rootState.tools.lgModal.data,
                    status: "error"
                  },
                  { root: true }
                );
              } else {
                dispatch(
                  "tools/setLgModalData",
                  {
                    ...rootState.tools.lgModal.data,
                    status: ""
                  },
                  { root: true }
                );
              }
            });
          }, 500);
        };
        let uwFolderName = this.watch(state => {
          return state.tools.lgModal.data.foldername;
        }, watch);
        let uwTitle = this.watch(state => {
          return state.tools.lgModal.data.select;
        }, watch);
        modal.confirm = () => {
          if (
            !rootState.tools.lgModal.data.foldername ||
            rootState.tools.lgModal.data.status !== ""
          ) {
            return;
          }
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.add("loading");
          let path =
            rootState.tools.lgModal.data.select +
            "/" +
            rootState.tools.lgModal.data.foldername;
          dispatch(
            "note/folderOperate",
            {
              operate: "create",
              folderInfo: {
                path: path
              }
            },
            { root: true }
          )
            .then(() => {
              dispatchSync("note/listOperate", {
                operate: "add",
                storage: rootState.tools.lgModal.data.storage,
                path: path
              });
              document
                .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
                .classList.remove("loading");
              rootState.tools.lgModal.cancel();
              dispatch("note/loadCloudFolders", null, { root: true });
              dispatch(
                "toast/timeToast",
                {
                  message: "创建文件夹成功！",
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
                  message: "创建文件夹失败！请重试。",
                  status: "error",
                  delay: 1000
                },
                { root: true }
              );
            });
        };
        modal.cancel = () => {
          uwFolderName();
          uwTitle();
          dispatch("tools/hideLgModal", null, { root: true });
        };
        dispatch(
          "note/folderOperate",
          { operate: "readOnly", folderInfo: null },
          { root: true }
        ).then(data => {
          dispatch(
            "tools/setLgModalData",
            {
              ...rootState.tools.lgModal.data,
              folders: data.folders
            },
            { root: true }
          );
        });
        dispatch("tools/showLgModal", modal, { root: true });
      }
      if (modal.content === "GitConfig") {
        modal.title = "Git设置";
        dispatch(
          "tools/setLgModalData",
          {
            ...rootState.tools.lgModal.data,
            status: "loading"
          },
          { root: true }
        );
        dispatch(
          "conf/configOperate",
          {
            operate: "getGitConfig",
            config: null
          },
          { root: true }
        )
          .then(info => {
            dispatch(
              "tools/setLgModalData",
              {
                ...rootState.tools.lgModal.data,
                status: "",
                git_name: info.git_name,
                git_email: info.git_email
              },
              { root: true }
            );
          })
          .catch(error => {
            dispatch(
              "toast/timeToast",
              {
                message: "获取信息失败！",
                status: "error",
                delay: 1000
              },
              { root: true }
            );
            dispatch(
              "tools/setLgModalData",
              {
                ...rootState.tools.lgModal.data,
                status: ""
              },
              { root: true }
            );
          });
        modal.confirm = () => {
          if (
            !rootState.tools.lgModal.data.git_name ||
            !rootState.tools.lgModal.data.git_email ||
            !rootState.tools.lgModal.data.git_password ||
            rootState.tools.lgModal.data.status !== ""
          ) {
            return;
          }
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.add("loading");
          dispatch(
            "conf/configOperate",
            {
              operate: "setGitConfig",
              config: {
                git_name: rootState.tools.lgModal.data.git_name,
                git_email: rootState.tools.lgModal.data.git_email,
                git_password: rootState.tools.lgModal.data.git_password
              }
            },
            { root: true }
          )
            .then(() => {
              document
                .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
                .classList.remove("loading");
              rootState.tools.lgModal.cancel();
              dispatch(
                "toast/timeToast",
                {
                  message: "设置成功！",
                  status: "success",
                  delay: 1000
                },
                { root: true }
              );
            })
            .catch(error => {
              dispatch(
                "toast/timeToast",
                {
                  message: "设置失败，请重试！",
                  status: "error",
                  delay: 1000
                },
                { root: true }
              );
            });
        };
        modal.cancel = () => {
          dispatch("tools/hideLgModal", null, { root: true });
        };
        dispatch("tools/showLgModal", modal, { root: true });
      }
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
    // TODO: 导出阅读模式的HTML
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
