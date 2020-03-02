const state = {};

const getters = {};

const actions = {
  getAllUser({ dispatch }) {
    return new Promise((resolve, reject) => {
      window.axios
        .get("/api/admin/users")
        .then(res => {
          resolve(res.data.users);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  },
  deleteUser({ dispatch }, id = null) {
    let url = "";
    if (id) {
      url = "/api/admin/users/" + id;
    } else {
      url = "/api/user";
    }
    return new Promise((resolve, reject) => {
      window.axios
        .delete(url)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  },
  getUser({ dispatch }, id = null) {
    let url = "";
    if (id) {
      url = "/api/admin/users/" + id;
    } else {
      url = "/api/user";
    }
    return new Promise((resolve, reject) => {
      window.axios
        .get(url)
        .then(res => {
          resolve(res.data.user);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  },
  setUser({ dispatch }, { user, id = null }) {
    let url = "";
    if (id) {
      url = "/api/admin/users/" + id;
    } else {
      url = "/api/user";
    }
    return new Promise((resolve, reject) => {
      window.axios
        .put(url, {
          old_password: user.old_password,
          nickname: user.nickname,
          email: user.email,
          password: user.password,
          password_confirmation: user.password_confirmation
        })
        .then(res => {
          resolve(res.data.user);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
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
