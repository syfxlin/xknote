import store from "../../store";
import git from "../common/git";

export default {
  noteHistory: {
    name: "查看笔记历史",
    operate: "noteHistory",
    handler() {
      let modal = {};
      modal.operate = "NoteHistory";
      store.dispatch("tools/showLgModal", modal);
    }
  },
  gitPush: {
    name: "Push",
    operate: "gitPush",
    handler() {
      let path = store.state.note.xknoteOpened.path;
      git.push({
        path: path.substring(0, path.indexOf("/", 1))
      });
    }
  },
  gitPull: {
    name: "Pull",
    operate: "gitPull",
    handler() {
      let path = store.state.note.xknoteOpened.path;
      git.pull({
        path: path.substring(0, path.indexOf("/", 1))
      });
    }
  },
  gitInitClone: {
    name: "Init Clone",
    operate: "gitInitClone",
    handler() {
      let path = store.state.note.xknoteOpened.path;
      git.initClone({
        path: path.substring(0, path.indexOf("/", 1))
      });
    }
  },
  gitPushForce: {
    name: "Push Force",
    operate: "gitPushForce",
    handler() {
      let path = store.state.note.xknoteOpened.path;
      git.pushForce({
        path: path.substring(0, path.indexOf("/", 1))
      });
    }
  },
  gitConfig: {
    name: "Git Config",
    operate: "gitConfig",
    handler() {
      let path = store.state.note.xknoteOpened.path;
      git.config({
        path: path.substring(0, path.indexOf("/", 1))
      });
    }
  }
};
