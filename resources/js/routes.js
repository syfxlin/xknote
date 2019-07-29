import Home from "./components/Home.vue";
import Read from "./components/Read.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/read",
    name: "Read",
    component: Read
  }
];

export default routes;
