import Vue from "vue";
import Vuex, { Store } from "vuex";
import Axios from "axios";
import router from "../router/index";
import AuthService from "../AuthService";

Vue.use(Vuex);

//Allows axios to work locally or live
let base = window.location.host.includes("localhost:8080")
  ? "//localhost:3000/"
  : "/";

let api = Axios.create({
  baseURL: base + "api/",
  timeout: 3000,
  withCredentials: true
});

export default new Vuex.Store({
  state: {
    user: {},
    boards: [],
    lists: [],
    tasks: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setBoards(state, boards) {
      state.boards = boards;
    },
    addList(state, lists) {
      state.lists = lists;
    },
    addTask(state, tasks) {
      state.tasks = tasks;
    }
  },
  actions: {
    //#region -- AUTH STUFF --
    async register({ commit, dispatch }, creds) {
      try {
        let user = await AuthService.Register(creds);
        commit("setUser", user);
        router.push({ name: "boards" });
      } catch (e) {
        console.warn(e.message);
      }
    },
    async login({ commit, dispatch }, creds) {
      try {
        let user = await AuthService.Login(creds);
        commit("setUser", user);
        router.push({ name: "boards" });
      } catch (e) {
        console.warn(e.message);
      }
    },
    async logout({ commit, dispatch }) {
      try {
        let success = await AuthService.Logout();
        if (!success) {
        }
        commit("resetState");
        router.push({ name: "login" });
      } catch (e) {
        console.warn(e.message);
      }
    },
    //#endregion

    //#region -- BOARDS --
    getBoards({ commit, dispatch }) {
      api.get("boards").then(res => {
        commit("setBoards", res.data);
      });
    },
    addBoard({ commit, dispatch }, boardData) {
      api.post("boards", boardData).then(serverBoard => {
        dispatch("getBoards");
      });
    },
    //#endregion

    //#region -- LISTS --
    async addList({ commit, dispatch }, listData) {
      let res = await api.post("lists", listData);
      //commit("addList", res.data); NOTE This is what broke stuff
      dispatch("getLists", listData);
    },
    async getLists({ commit, dispatch }, payload) {
      let res = await api.get(
        "boards/" + payload.boardId + "/lists",
        payload.authorId
      );
      console.log("from get lists", res.data);

      commit("addList", res.data);
    },

    //#endregion

    //#region -- TASKS --

    async addTask({ commit, dispatch }, taskData) {
      console.log("arriving to add task", taskData);
      let res = await api.post("tasks", taskData);
      console.log("this is the push to task api", res.data);
      // commit("addTask", res.data); NOTE This is what broke stuff
      dispatch("getTasks", taskData);
    },
    async getTasks({ commit, dispatch }, payload) {
      console.log("list id", payload);
      let res = await api.get(
        "lists/" + payload.listId + "/tasks",
        payload.authorId
      );
      console.log("Task gotten", res.data);

      commit("addTask", res.data);
    }
  }
});
//#endregion
