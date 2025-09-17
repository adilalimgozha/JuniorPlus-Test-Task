import { createRouter, createWebHashHistory } from "vue-router";

import Notes from "../pages/Notes.vue";
import Detail from "../pages/Detail.vue";

const routes = [
    {path: '/', name: "Notes", component: Notes},
    {path: '/:id', name: "DetailNote", component: Detail}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router