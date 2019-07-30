import Home from "./components/Home.vue";
import Read from "./components/Read.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: { writeMode: false },
    alias: "/normal"
  },
  {
    path: "/read",
    name: "Read",
    component: Read,
    props: true
  },
  {
    path: "/write",
    name: "Write",
    component: Home,
    props: { writeMode: true }
  }
];

export default routes;
