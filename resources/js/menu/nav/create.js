import create from "../common/create";

export default {
  note: {
    name: "新建MD笔记",
    operate: "createNote",
    handler() {
      create.note({
        path: ""
      });
    }
  },
  folder: {
    name: "新建文件夹",
    operate: "createFolder",
    handler() {
      create.folder({
        path: ""
      });
    }
  }
};
