import store from "../../store";
import Vue from "vue";

export default {
  name: "发布到博客",
  operate: "pushBlog",
  handler({ storage, path, type, currEle }) {
    let note = store.dispatchSync("note/listOperate", {
      operate: "get",
      storage: storage,
      path: path
    });
    if (storage === "cloud") {
      store.dispatch("toast/showLoadToast", {
        message: "读取中..."
      });
      store
        .dispatch("note/noteOperate", {
          operate: "read",
          storage: "cloud",
          noteInfo: note
        })
        .then(data => {
          Vue.set(note, "note", data.note);
          store.dispatch("tools/showMiModal", {
            operate: "PushBlog",
            data: {
              title: note.note.title,
              content: note.note.content
            }
          });
          store.dispatch("toast/hideLoadToast", null);
        })
        .catch(err => {
          store.dispatch("toast/hideLoadToast", null);
        });
    } else {
      store.dispatch("tools/showMiModal", {
        operate: "PushBlog",
        data: {
          title: note.note.title,
          content: note.note.content
        }
      });
    }
  }
};
