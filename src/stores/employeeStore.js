import { defineStore } from 'pinia'
import employeesData from '../data/purple_cross_employees.json'

export const useEmployeeStore = defineStore('employeeStore', {
    state: () => ({
        employees: employeesData
    }),
    getters: {
        //TODO: add getters for filtering employees
    },
    actions: {

        deleteEmployee(code){
           this.employees = this.employees.filter(employee => employee.code !== code)
        }
        //TODO: addEmployee, updateEmployee
    }
})