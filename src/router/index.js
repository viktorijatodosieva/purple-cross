import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({history: createWebHistory(), routes: [
    {path: '/', redirect: '/employees'},
    {path: '/employees', component: () => import('../views/EmployeeList.vue')},
    {path: '/employees/create', component: () => import('../views/EmployeeForm.vue')},
    {path: '/employees/:id', component: () => import('../views/EmployeeProfile.vue')},
    {path: '/employees/edit/:id', component: () => import('../views/EmployeeForm.vue')}
    ]})

export default router