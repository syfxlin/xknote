import git from "../common/git";

export default {
  push: {
    name: "Push",
    operate: "gitPush",
    handler: git.push
  },
  pull: {
    name: "Pull",
    operate: "gitPull",
    handler: git.pull
  },
  initClone: {
    name: "Init Clone",
    operate: "gitInitClone",
    handler: git.initClone
  },
  pushForce: {
    name: "Push Force",
    operate: "gitPushForce",
    handler: git.pushForce
  },
  config: {
    name: "Git Config",
    operate: "gitConfig",
    handler: git.config
  },
  status: {
    name: "Status",
    operate: "gitStatus",
    handler: git.status
  },
  diff: {
    name: "Diff",
    operate: "gitDiff",
    handler: git.diff
  }
};
