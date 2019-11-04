const state = {
  noteBaseInfo: {
    type: "note",
    path: "",
    name: "",
    status: "N",
    note: {
      title: "",
      author: "",
      content: "暂未打开任何文件，请选择文件。",
      created_at: "",
      updated_at: ""
    }
  },
  xknoteOpened: {
    type: "note",
    path: "",
    name: "",
    status: "N",
    note: {
      title: "",
      author: "",
      content: "暂未打开任何文件，请选择文件。",
      created_at: "",
      updated_at: ""
    }
  },
  // 存储当前开启的文档的位置，当前位置和源位置
  // curr存储的是位于currList的索引
  // source存储的分别是源的位置 本地or云端（data-storage） 在其列表中的index（data-index）
  xknoteOpenedIndex: {
    curr: "",
    source: {
      path: "",
      storage: ""
    }
  },
  // currList的扩展信息
  currListSource: {},
  currList: {},
  cloudList: {},
  localList: {},
  xknoteTab: "cloud",
  readOpened: {
    type: "note",
    path: "",
    name: "",
    status: "N",
    note: {
      title: "",
      author: "",
      content: "暂未打开任何文件，请选择文件。",
      created_at: "",
      updated_at: ""
    }
  }
};

// getters
const getters = {};

// actions
const actions = {
  switchTab({ commit }, tabName) {
    commit("switchTab", tabName);
  },
  folderOperate({ commit }, operate, folderInfo = null) {
    return new Promise((resolve, reject) => {
      if (operate === "readAll") {
        window.axios
          .get("/api/folders")
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "readFlat") {
        window.axios
          .get("/api/folders/flat")
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "readOnly") {
        window.axios
          .get("/api/folders/only")
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "rename") {
        window.axios
          .put("/api/folders", {
            old_path: folderInfo.oldFolder.path,
            new_path: folderInfo.folder.path
          })
          .then(res => {
            console.log(res);
            this.timeToast("重命名成功！", "success", 1000);
            if (res.data.error == false) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            console.error(err);
            this.timeToast("重命名失败！请重试。", "error", 1000);
            reject(err);
          });
      }
      if (operate === "create") {
        window.axios
          .post("/api/folders", {
            path: folderInfo.path
          })
          .then(res => {
            this.timeToast("创建文件夹成功！", "success", 1000);
            if (res.data.error == false) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            console.error(err);
            this.timeToast("创建文件夹失败！请重试。", "error", 1000);
            reject(err);
          });
      }
      if (operate === "delete") {
        window.axios
          .delete("/api/folders", {
            params: {
              path: folderInfo.path
            }
          })
          .then(res => {
            console.log(res);
            this.timeToast("删除成功！", "success", 1000);
            if (res.data.error == false) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            console.error(err);
            this.timeToast("删除失败！请重试。", "error", 1000);
            reject(err);
          });
      }
      if (operate === "exist") {
        window.axios
          .get("/api/folders/exist", {
            params: { path: folderInfo.path }
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      // TODO: 添加加载时提示
      if (operate === "gitPush" || operate === "gitPushForce") {
        window.axios
          .put("/api/repo", {
            path: folderInfo.path,
            force: operate === "gitPushForce"
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "gitPull") {
        window.axios
          .get("/api/repo", {
            params: { path: folderInfo.path }
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "gitInit" || operate === "gitClone") {
        window.axios
          .post("/api/repo", {
            path: folderInfo.path,
            repo: folderInfo.repo,
            init_or_clone: operate === "gitInit" ? "init" : "clone",
            ...folderInfo.git_user
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "getGitConfig") {
        window.axios
          .get("/api/repo/conf", { params: { path: folderInfo.path } })
          .then(res => {
            resolve(res.data.config);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
        if (operate === "setGitConfig") {
          window.axios
            .put("/api/repo/conf", { ...folderInfo })
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              console.log(err);
              reject(err);
            });
        }
      }
    });
  },
  noteOperate({ commit }, operate, storage, noteInfo = null) {
    return new Promise((resolve, reject) => {
      if (operate === "read") {
        if (storage === "local") {
          this.noteLocalDB("read", noteInfo.path, (e, data) => {
            resolve(data);
          });
        }
        if (storage === "cloud") {
          window.axios
            .get("/api/notes", {
              params: {
                path: noteInfo.path
              }
            })
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              console.error(err);
              this.timeToast("加载失败！请重试。", "error", 1000);
              reject(err);
            });
        }
      }
      if (operate === "create") {
        if (storage === "cloud") {
          window.axios
            .post("/api/notes", {
              path: noteInfo.path,
              title: noteInfo.note.title,
              author: noteInfo.note.author,
              created_at: noteInfo.note.created_at,
              updated_at: noteInfo.note.updated_at,
              content: noteInfo.note.content
            })
            .then(res => {
              this.timeToast("新建笔记成功！", "success", 1000);
              if (res.data.error == false) {
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch(err => {
              console.error(err);
              this.timeToast("新建笔记失败！请重试。", "error", 1000);
              resolve(err);
            });
        }
      }
      if (operate === "delete") {
        if (storage === "local") {
          this.noteLocalDB(
            "delete",
            noteInfo.path,
            (e, data) => {
              reject(data);
            },
            reject
          );
        }
        if (storage === "cloud") {
          window.axios
            .delete("/api/notes", {
              params: {
                path: noteInfo.path
              }
            })
            .then(res => {
              console.log(res);
              this.timeToast("删除成功！", "success", 1000);
              if (res.data.error == false) {
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch(err => {
              console.error(err);
              this.timeToast("删除失败！请重试。", "error", 1000);
              reject(err);
            });
        }
      }
      if (operate === "save") {
        if (storage === "local") {
          this.noteLocalDB(
            "delete",
            noteInfo.path,
            () => {
              this.timeToast("保存到本地成功！", "success", 1000);
              this.noteLocalDB("add", noteInfo, resolve, reject);
            },
            reject
          );
        }
        if (storage === "cloud") {
          window.axios
            .put("/api/notes", {
              path: noteInfo.path,
              title: noteInfo.note.title,
              author: noteInfo.note.author,
              created_at: noteInfo.note.created_at,
              updated_at: noteInfo.note.updated_at,
              content: noteInfo.note.content
            })
            .then(res => {
              this.timeToast("保存到云端成功！", "success", 1000);
              if (res.data.error == false) {
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch(err => {
              console.error(err);
              this.timeToast("保存到云端失败！请重试。", "error", 1000);
              reject(err);
            });
        }
      }
      if (operate === "rename") {
        if (storage === "local") {
          this.noteLocalDB("delete", noteInfo.oldNote.path);
          this.noteLocalDB("add", noteInfo.note);
          resolve();
        }
        if (storage === "cloud") {
          window.axios
            .put("/api/notes/rename", {
              old_path: noteInfo.oldNote.path,
              new_path: noteInfo.note.path
            })
            .then(res => {
              console.log(res);
              this.timeToast("重命名成功！", "success", 1000);
              if (res.data.error == false) {
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch(err => {
              console.error(err);
              this.timeToast("重命名失败！请重试。", "error", 1000);
              reject(err);
            });
        }
      }
      if (operate === "exist") {
        if (storage === "cloud") {
          window.axios
            .get("/api/notes/exist", {
              params: { path: noteInfo.path }
            })
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              console.error(err);
              reject(err);
            });
        }
        if (storage === "local") {
          let flag = false;
          for (let i = 0; i < this.localList.length; i++) {
            if (this.localList[i].path === noteInfo.path) {
              flag = true;
            }
          }
          resolve({ exist: flag });
        }
      }
    });
  },
  listOperate({ commit }, operate, storage, path, noteInfo = null) {
    commit("listOperate", operate, storage, path, noteInfo);
  }
};

// mutations
const mutations = {
  switchTab(state, tabName) {
    state.xknoteTab = tabName;
  },
  listOperate(state, operate, storage, path, noteInfo = null) {
    let arr = [path];
    let list = state[storage + "List"];
    if (storage === "cloud") {
      arr = path.substring(1).split("/");
      for (let i = 0; operate !== "add" && i < arr.length - 1; i++) {
        list = list[arr[i]].sub;
      }
    }
    if (operate === "get") {
      return list[arr[arr.length - 1]];
    }
    if (operate === "add") {
      if (storage === "curr") {
        let currIndex = this.$set(this.currList, path, noteInfo.note);
        this.$set(this.currListSource, path, noteInfo.source);
        return currIndex;
      }
      if (storage === "local") {
        return this.$set(this.localList, path, noteInfo);
      }
      if (storage === "cloud") {
        let p = "";
        let len = noteInfo === null ? arr.length : arr.length - 1;
        for (let i = 0; i < len; i++) {
          p += "/" + arr[i];
          if (!list[arr[i]]) {
            this.$set(list, arr[i], {
              type: "folder",
              path: p,
              name: arr[i],
              sub: {}
            });
          }
          list = list[arr[i]].sub;
        }
        if (noteInfo !== null) {
          this.$set(list, arr[arr.length - 1], noteInfo);
        }
      }
    }
    if (operate === "delete") {
      let noteList = list[arr[arr.length - 1]];
      this.$delete(list, arr[arr.length - 1]);
      if (storage === "curr") {
        this.$delete(this.currListSource, arr[arr.length - 1]);
      }
      return noteList;
    }
    if (operate === "set") {
      this.$set(list, arr[arr.length - 1], { ...noteInfo });
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
