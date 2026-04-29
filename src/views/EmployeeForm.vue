<script setup>
import { reactive } from "vue";
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from "primevue/inputtext";
import DatePicker from "primevue/datepicker";
import { useEmployeeStore } from "@/stores/employeeStore.js";

const router = useRouter();
const store = useEmployeeStore();

const form = reactive({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: null,
  terminationDate: null,
});

const errors = reactive({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
});

function validate() {
  let valid = true;

  errors.code = form.code.trim() ? '' : 'Code is required';
  errors.fullName = form.fullName.trim() ? '' : 'Full Name is required';
  errors.occupation = form.occupation.trim() ? '' : 'Occupation is required';
  errors.department = form.department.trim() ? '' : 'Department is required';

  if (errors.code || errors.fullName || errors.occupation || errors.department) {
    valid = false;
  }

  return valid;
}

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
}

function saveEmployee() {
  if (!validate()) return;

  store.addEmployee({
    code: form.code.trim(),
    fullName: form.fullName.trim(),
    occupation: form.occupation.trim(),
    department: form.department.trim(),
    dateOfEmployment: formatDate(form.dateOfEmployment),
    terminationDate: formatDate(form.terminationDate),
  });

  router.push('/employees');
}

</script>

<template>
  <div>
    <h1>Create Employee</h1>

    <div>
      <label>Code</label>
      <InputText v-model="form.code" />
      <small v-if="errors.code" style="color: red;">{{ errors.code }}</small>
    </div>

    <div>
      <label>Full Name</label>
      <InputText v-model="form.fullName" />
      <small v-if="errors.fullName" style="color: red;">{{ errors.fullName }}</small>
    </div>

    <div>
      <label>Occupation</label>
      <InputText v-model="form.occupation" />
      <small v-if="errors.occupation" style="color: red;">{{ errors.occupation }}</small>
    </div>

    <div>
      <label>Department</label>
      <InputText v-model="form.department" />
      <small v-if="errors.department" style="color: red;">{{ errors.department }}</small>
    </div>
    <div>
      <label>Date of Employment</label>
      <DatePicker v-model="form.dateOfEmployment" dateFormat="yy-mm-dd" />
    </div>

    <div>
      <label>Termination Date</label>
      <DatePicker v-model="form.terminationDate" dateFormat="yy-mm-dd" />
    </div>

    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
      <Button label="Save" @click="saveEmployee" />
      <Button label="Cancel" @click="router.push('/employees')" />
    </div>

  </div>

</template>

<style scoped>

</style>