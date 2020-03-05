import handler from "../common/save";

export default {
  cloud: {
    name: "保存到云端",
    operate: "saveCloud",
    handler: handler.cloud
  },
  local: {
    name: "保存到本地",
    operate: "saveLocal",
    handler: handler.local
  }
};
