import store from "../../store";

export default {
  name: "图片",
  operate: "imageItem",
  handler() {
    store.dispatch("tools/showMiModal", {
      operate: "ImageItem"
    });
  }
};
