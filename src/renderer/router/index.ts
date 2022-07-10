import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../pages/home.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home
    }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;