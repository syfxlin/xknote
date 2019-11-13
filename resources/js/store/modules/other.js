const state = {
  isMinScreen: window.innerWidth < 991
};

const getters = {};

const actions = {
  logout() {
    window.axios.post("/logout").then(function() {
      window.location.href = "/";
    });
  },
  gitOperate({ dispatch, rootState }, { operate, path }) {
    if (operate === "gitPull") {
      dispatch(
        "toast/showLoadToast",
        {
          message: "操作中..."
        },
        { root: true }
      );
      dispatch(
        "note/folderOperate",
        {
          operate: operate,
          folderInfo: { path: path }
        },
        { root: true }
      )
        .then(() => {
          dispatch(
            "toast/timeToast",
            {
              message: "Git Pull成功！",
              status: "success",
              delay: 1000
            },
            { root: true }
          );
          dispatch("toast/hideLoadToast", null, { root: true });
        })
        .catch(error => {
          dispatch(
            "toast/timeToast",
            {
              message: "Git Pull失败，请重试！",
              status: "error",
              delay: 1000
            },
            { root: true }
          );
          dispatch("toast/hideLoadToast", null, { root: true });
        });
    }
    if (operate === "gitPush") {
      dispatch(
        "toast/showLoadToast",
        {
          message: "操作中..."
        },
        { root: true }
      );
      dispatch(
        "note/folderOperate",
        { operate: operate, folderInfo: { path: path } },
        { root: true }
      )
        .then(() => {
          dispatch(
            "toast/timeToast",
            {
              message: "Git Push成功！",
              status: "success",
              delay: 1000
            },
            { root: true }
          );
          dispatch("toast/hideLoadToast", null, { root: true });
        })
        .catch(error => {
          dispatch(
            "toast/timeToast",
            {
              message: "Git Push失败，请重试！",
              status: "error",
              delay: 1000
            },
            { root: true }
          );
          dispatch("toast/hideLoadToast", null, { root: true });
        });
    }
    if (operate === "gitPushForce") {
      dispatch(
        "toast/showLoadToast",
        {
          message: "操作中..."
        },
        { root: true }
      );
      dispatch(
        "note/folderOperate",
        { operate: operate, folderInfo: { path: path } },
        { root: true }
      )
        .then(() => {
          dispatch(
            "toast/timeToast",
            {
              message: "Git Push成功！",
              status: "success",
              delay: 1000
            },
            { root: true }
          );
          dispatch("toast/hideLoadToast", null, { root: true });
        })
        .catch(error => {
          dispatch(
            "toast/timeToast",
            {
              message: "Git Push失败，请重试！",
              status: "error",
              delay: 1000
            },
            { root: true }
          );
          dispatch("toast/hideLoadToast", null, { root: true });
        });
    }
    if (operate === "gitInitClone") {
      let modal = {};
      modal.content = "GitInitClone";
      modal.title = "Git InitClone";
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
                path: rootState.tools.lgModal.data.foldername + "/.git"
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
      modal.confirm = () => {
        if (
          !rootState.tools.lgModal.data.foldername ||
          !rootState.tools.lgModal.data.repo ||
          !rootState.tools.lgModal.data.init_or_clone ||
          rootState.tools.lgModal.data.status !== ""
        ) {
          return;
        }
        document
          .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
          .classList.add("loading");
        let git_user = {};
        if (
          rootState.tools.lgModal.data.git_name &&
          rootState.tools.lgModal.data.git_email &&
          rootState.tools.lgModal.data.git_password
        ) {
          git_user = {
            git_name: rootState.tools.lgModal.data.git_name,
            git_email: rootState.tools.lgModal.data.git_email,
            git_password: rootState.tools.lgModal.data.git_password
          };
        }
        dispatch(
          "note/folderOperate",
          {
            operate:
              rootState.tools.lgModal.data.init_or_clone === "init"
                ? "gitInit"
                : "gitClone",
            folderInfo: {
              path: rootState.tools.lgModal.data.foldername,
              repo: rootState.tools.lgModal.data.repo,
              git_user: git_user
            }
          },
          { root: true }
        ).then(() => {
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.remove("loading");
          rootState.tools.lgModal.cancel();
          dispatch(
            "toast/timeToast",
            {
              message: "Git Init或Clone成功！",
              status: "success",
              delay: 1000
            },
            { root: true }
          );
        });
      };
      modal.cancel = () => {
        uwFolderName();
        dispatch("tools/hideLgModal", null, { root: true });
      };
      dispatch("tools/showLgModal", modal, { root: true });
    }
    if (operate === "gitConfig") {
      let modal = {};
      modal.title = "Git设置";
      modal.content = "GitItemConfig";
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
          operate: "getGitConfig",
          folderInfo: { path: path }
        },
        { root: true }
      )
        .then(info => {
          dispatch(
            "tools/setLgModalData",
            {
              ...rootState.tools.lgModal.data,
              status: "",
              repo: info.repo,
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
          "note/folderOperate",
          {
            operate: "setGitConfig",
            folderInfo: {
              repo: rootState.tools.lgModal.data.repo,
              git_name: rootState.tools.lgModal.data.git_name,
              git_email: rootState.tools.lgModal.data.git_email,
              git_password: rootState.tools.lgModal.data.git_password,
              path: path
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
    if (operate === "gitStatus") {
      let modal = {};
      modal.title = "Git状态";
      modal.content = "GitStatus";
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
          operate: "gitStatus",
          folderInfo: { path: path }
        },
        { root: true }
      ).then(status => {
        dispatch(
          "tools/setLgModalData",
          {
            ...rootState.tools.lgModal.data,
            status: "",
            statusData: status
          },
          { root: true }
        );
      });
      modal.confirm = () => {
        dispatch("tools/hideLgModal", null, { root: true });
      };
      modal.cancel = () => {
        dispatch("tools/hideLgModal", null, { root: true });
      };
      dispatch("tools/showLgModal", modal, { root: true });
    }
    if (operate === "gitDiff") {
      let modal = {};
      modal.content = "AllNoteHistory";
      modal.data = {
        path: path
      };
      dispatch("tools/showLlgModal", modal, { root: true });
    }
  },
  checkLocalOperate({ dispatch, rootState }, { operate, index }) {
    let path = rootState.tools.lgModal.data[index].path;
    if (operate === "keepLocal") {
      dispatch(
        "note/noteOperate",
        {
          operate: "read",
          storage: "local",
          noteInfo: { path: path }
        },
        { root: true }
      ).then(data => {
        dispatch(
          "note/noteOperate",
          {
            operate: "save",
            storage: "cloud",
            noteInfo: data
          },
          { root: true }
        ).then(() => {
          rootState.note.localList[path].status = "C";
          dispatch("tools/delLgModalData", index, { root: true });
          // 将更新后的状态保存到本地
          dispatch(
            "note/noteOperate",
            {
              operate: "save",
              storage: "local",
              noteInfo: rootState.note.localList[path]
            },
            { root: true }
          );
        });
      });
    }
    if (operate === "keepCloud") {
      dispatch(
        "note/noteOperate",
        {
          operate: "read",
          storage: "cloud",
          noteInfo: { path: path }
        },
        { root: true }
      ).then(data => {
        dispatch(
          "note/noteOperate",
          {
            operate: "save",
            storage: "local",
            noteInfo: data
          },
          { root: true }
        ).then(() => {
          rootState.note.localList[path].status = "C";
          // this.$delete(this.lgModal.data, index);
          dispatch("tools/delLgModalData", index, { root: true });
        });
      });
    }
    if (operate === "notOpe") {
      dispatch("tools/delLgModalData", index, { root: true });
    }
  },
  checkLocalStatus({ dispatch, rootState }) {
    document.querySelector(".xknote-check-local").classList.add("loading");
    window.axios
      .post("/api/notes/check", {
        check_list: Object.keys(rootState.note.localList)
      })
      .then(res => {
        let data = {};
        for (let key in rootState.note.localList) {
          data[rootState.note.localList[key].path] = {
            name: rootState.note.localList[key].name,
            path: rootState.note.localList[key].path,
            created_at_l: rootState.note.localList[key].note.created_at,
            updated_at_l: rootState.note.localList[key].note.updated_at,
            created_at_c: res.data.check_list[key].created_at,
            updated_at_c: res.data.check_list[key].updated_at
          };
        }
        dispatch("tools/setLgModalData", data, { root: true });
        dispatch(
          "tools/showLgModal",
          {
            title: "检查状态",
            content: "CheckLocalStatus",
            confirm: () => {
              dispatch("tools/hideLgModal", null, { root: true });
            },
            cancel: () => {
              dispatch("tools/hideLgModal", null, { root: true });
            }
          },
          { root: true }
        );
        document
          .querySelector(".xknote-check-local")
          .classList.remove("loading");
      });
  },
  imageOperate({ dispatch, rootState }, { operate, name = null }) {
    return new Promise((resolve, reject) => {
      if (operate === "getAll") {
        window.axios
          .get("/api/images/all")
          .then(res => {
            resolve(res.data.images);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "delete") {
        window.axios
          .delete("/api/images", { params: { name: name } })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
    });
  },
  diffOperate(
    { dispatch, rootState },
    { operate, path, file = null, commit = null }
  ) {
    return new Promise((resolve, reject) => {
      if (operate === "getLog") {
        window.axios
          .get("/api/repo/log", { params: { path: path, file: file } })
          .then(res => {
            resolve(res.data.logs);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "getDiff") {
        window.axios
          .get("/api/repo/diff", {
            params: { path: path, file: file, commit: commit }
          })
          .then(res => {
            resolve(res.data.diffs);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "rollback") {
        window.axios
          .post("/api/repo/rollback", {
            path: path,
            file: file,
            commit: commit
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === "getAllDiff") {
        window.axios
          .get("/api/repo/diff/all", {
            params: { path: path }
          })
          .then(res => {
            resolve(res.data.diffs);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
    });
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
