import Home from "./components/Home.vue";
import Read from "./components/Read.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true
  },
  {
    path: "/read",
    name: "Read",
    component: Read,
    props: true
  }
];

export default routes;
