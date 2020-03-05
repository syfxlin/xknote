import store from "../../store";
import handler from "../common/save";

export default {
  cloud: {
    name: "云端保存",
    operate: "saveCloud",
    handler() {
      store.dispatch("tools/setSaveAndClose", false);
      handler.cloud({
        type: "note",
        storage: "curr",
        path: store.state.note.xknoteOpenedIndex.curr
      });
    }
  },
  local: {
    name: "本地保存",
    operate: "saveLocal",
    handler() {
      store.dispatch("tools/setSaveAndClose", false);
      handler.local({
        type: "note",
        storage: "curr",
        path: store.state.note.xknoteOpenedIndex.curr
      });
    }
  },
  allCloud: {
    name: "全部保存到云端",
    operate: "saveAllCloud",
    handler() {
      store.dispatch("tools/setSaveAndClose", false);
      for (let key in store.state.note.currList) {
        handler.cloud({
          type: "note",
          storage: "curr",
          path: key
        });
      }
    }
  },
  allLocal: {
    name: "全部保存到本地",
    operate: "saveAllLocal",
    handler() {
      store.dispatch("tools/setSaveAndClose", false);
      for (let key in store.state.note.currList) {
        handler.local({
          type: "note",
          storage: "curr",
          path: key
        });
      }
    }
  }
};
