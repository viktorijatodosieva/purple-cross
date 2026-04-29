<script setup>
import { useRoute, useRouter } from 'vue-router'
import {useEmployeeStore} from "@/stores/employeeStore.js";
import { getEmploymentStatus, getTerminationStatus } from '@/utils/dateUtils.js';
import Button from 'primevue/button'
import Card from 'primevue/card'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const route = useRoute();
const router = useRouter();
const store = useEmployeeStore();
const confirm = useConfirm();

const employee = store.employees.find(emp => emp.code === route.params.id);

function deleteEmployee() {
  confirm.require({
    message: 'Are you sure you want to delete this employee?',
    header: 'Confirm Deletion',
    accept: () => {
      store.deleteEmployee(employee.code)
      router.push('/employees')
    }
  })
}

</script>

<template>
  <div style="padding: 1rem; max-width: 700px;">
    <Card>
      <template #title>{{ employee.fullName }}</template>
      <template #content>
        <div style="display: grid; grid-template-columns: 200px 1fr; gap: 0.75rem;">
          <strong>Code:</strong>             <span>{{ employee.code }}</span>
          <strong>Occupation:</strong>       <span>{{ employee.occupation }}</span>
          <strong>Department:</strong>       <span>{{ employee.department }}</span>
          <strong>Employment Status:</strong><span>{{ getEmploymentStatus(employee.dateOfEmployment) }}</span>
          <strong>Termination Status:</strong><span>{{ getTerminationStatus(employee.terminationDate) }}</span>
        </div>
      </template>
      <template #footer>
        <div style="display: flex; gap: 1rem;">
          <Button label="Back" @click="router.push('/employees')" />
          <Button label="Edit" @click="router.push(`/employees/${employee.code}/edit`)" />
          <Button label="Delete" severity="danger" @click="deleteEmployee" />
        </div>
      </template>
    </Card>
    <ConfirmDialog />
  </div>
</template>

<style scoped>

</style>