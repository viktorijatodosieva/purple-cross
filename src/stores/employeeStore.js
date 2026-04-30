import { defineStore } from 'pinia'
import employeesData from '../data/purple_cross_employees.json'

export const useEmployeeStore = defineStore('employeeStore', {
    state: () => ({
        employees: employeesData
    }),
    getters: {
        employeesWithStatus: (state) => {
            return state.employees.map(emp => ({
                ...emp,
                employmentStatus: emp.dateOfEmployment > new Date().toISOString().split('T')[0]
                    ? 'Employed soon' : 'Currently employed',
                terminationStatus: !emp.terminationDate ? ''
                    : emp.terminationDate > new Date().toISOString().split('T')[0]
                        ? 'To be terminated' : 'Terminated'
            }))
        }
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