const state = {};

const getters = {};

const actions = {
  xknoteDB({ commit }, { table, operate, data = null }) {
    return new Promise((resolve, reject) => {
      var requset = window.indexedDB.open("xknote");
      var db = null;
      var os = null;
      requset.onerror = e => {
        console.error("indexedDB开启失败: " + e);
        reject(e);
      };
      requset.onupgradeneeded = e => {
        db = e.target.result;
        if (!db.objectStoreNames.contains("localList")) {
          console.log("indexedDB中不存在localList表");
          os = db.createObjectStore("localList", {
            keyPath: "path"
          });
        }
        if (!db.objectStoreNames.contains("options")) {
          console.log("indexedDB中不存在options表");
          os = db.createObjectStore("options", {
            keyPath: "name"
          });
        }
      };
      requset.onsuccess = () => {
        db = requset.result;
        os = db.transaction([table], "readwrite").objectStore(table);
        if (operate === "add") {
          let req = os.add(data);
          req.onsuccess = e => {
            resolve();
          };
          req.onerror = e => {
            console.log("数据写入失败: " + e);
            reject(e);
          };
        }
        if (operate === "addAll") {
          for (let i = 0; i < data.length; i++) {
            let req = os.add(data[i]);
            req.onsuccess = e => {
              resolve();
            };
            req.onerror = e => {
              console.log("数据写入失败: " + e);
              reject(e);
            };
          }
        }
        if (operate === "read") {
          let reData = null;
          let req = os.get(data);
          req.onsuccess = e => {
            reData = req.result;
            resolve(reData);
          };
          req.onerror = e => {
            console.log("数据读取失败: " + e);
            reject(e);
          };
        }
        if (operate === "readAll") {
          let reData = null;
          let req = os.getAll();
          req.onsuccess = e => {
            reData = req.result;
            resolve(reData);
          };
          req.onerror = e => {
            console.log("数据读取失败: " + e);
            reject(e);
          };
        }
        if (operate === "delete") {
          let req = os.delete(data);
          req.onsuccess = e => {
            resolve();
          };
          req.onerror = e => {
            console.error("删除数据失败:" + e);
            reject(e);
          };
        }
        if (operate === "deleteAll") {
          let req = os.clear();
          req.onsuccess = e => {
            resolve();
          };
          req.onerror = e => {
            console.error("删除数据失败:" + e);
            reject(e);
          };
        }
        if (operate === "put") {
          let req = os.put(data);
          req.onsuccess = e => {
            resolve();
          };
          req.onerror = e => {
            console.log("数据更新失败: " + e);
            reject(e);
          };
        }
        db.close();
      };
    });
  },
  noteLocalDB({ dispatch }, { operate, data = null }) {
    return dispatch("xknoteDB", {
      table: "localList",
      operate: operate,
      data: data
    });
  },
  optionsDB({ dispatch }, { operate, data = null }) {
    return dispatch("xknoteDB", {
      table: "options",
      operate: operate,
      data: data
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
