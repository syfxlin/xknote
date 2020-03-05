import store from "../../store";
import save from "./save";
import rename from "./rename";
import move from "./move";
import deleteF from "./delete";
import closeCurr from "./closeCurr";
import pushBlog from "./pushBlog";

import exportF from "./export";
import create from "./create";
import git from "./git";

const items = {
  note: {
    curr: [
      save.cloud,
      save.local,
      rename,
      closeCurr,
      pushBlog,
      { name: "saveAndClose", content: "保存后关闭" }
    ],
    cloud: [save.local, rename, move, deleteF, pushBlog],
    local: [
      save.cloud,
      rename,
      deleteF,
      { name: "saveAndClose", content: "保存后删除" },
      pushBlog
    ]
  },
  folder: {
    parent: [
      rename,
      deleteF,
      exportF,
      { name: "divider", content: "新建" },
      create.note,
      create.folder,
      { name: "divider", content: "Git" },
      git.push,
      git.pull,
      git.initClone,
      git.pushForce,
      git.config,
      git.status,
      git.diff
    ],
    children: [
      rename,
      move,
      deleteF,
      exportF,
      { name: "divider", content: "新建" },
      create.note,
      create.folder
    ]
  }
};

export function getFloatItems(type, sub, data) {
  return items[type][sub].map(item => {
    if (!item.handler) {
      return item;
    }
    return {
      ...item,
      handler() {
        store.dispatch("tools/hideFloatMenu", null, { root: true });
        item.handler(data);
      }
    };
  });
}
