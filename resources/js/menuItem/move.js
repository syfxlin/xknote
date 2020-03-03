import store from "../store";

export default {
  name: "移动",
  operate: "move",
  handler({ storage, path, type, currEle }) {
    store.dispatch("tools/showMiModal", {
      operate: "MoveItem",
      data: {
        type: type,
        path: path,
        storage: storage
      }
    });
  }
};
