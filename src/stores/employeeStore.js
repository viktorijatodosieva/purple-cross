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
        },
        addEmployee(employee) {
            this.employees.push(employee)
        },
        updateEmployee(updatedEmployee) {
            const index = this.employees.findIndex(emp => emp.code === updatedEmployee.code)
            if(index !== -1){
                this.employees[index] = updatedEmployee
            }
        }
    }
})