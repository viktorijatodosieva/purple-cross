<script setup>
import { reactive } from "vue";
import { useRouter, useRoute } from 'vue-router'
import {computed} from 'vue'
import Button from 'primevue/button'
import InputText from "primevue/inputtext";
import DatePicker from "primevue/datepicker";
import { useEmployeeStore } from "@/stores/employeeStore.js";

const router = useRouter();
const route = useRoute();
const store = useEmployeeStore();
const isEdit = computed(() => route.params.id !== undefined);

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

if(isEdit.value){
  const employee = store.employees.find(emp => emp.code === route.params.id);
  form.code = employee.code;
  form.fullName = employee.fullName;
  form.occupation = employee.occupation;
  form.department = employee.department;
  form.dateOfEmployment = employee?.dateOfEmployment;
  form.terminationDate = employee?.terminationDate;
}

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
}

function saveEmployee() {
  if (!validate()) return;

  if (!isEdit.value) {
    const exists = store.employees.some(emp => emp.code === form.code.trim())
    if (exists) {
      errors.code = 'This code is already in use'
      return
    }
  }

  const employeeData = {
    code: form.code.trim(),
    fullName: form.fullName.trim(),
    occupation: form.occupation.trim(),
    department: form.department.trim(),
    dateOfEmployment: formatDate(form.dateOfEmployment),
    terminationDate: formatDate(form.terminationDate),
  }

  if (isEdit.value) {
    store.updateEmployee(employeeData)
  } else {
    store.addEmployee(employeeData)
  }

  router.push('/employees');
}

</script>

<template>
  <div class="page-wrapper">
    <div class="form-card">
      <h2 class="form-title">{{ isEdit ? 'Edit Employee' : 'Create Employee' }}</h2>

      <div class="form-grid">
        <div class="form-field">
          <label>Code <span class="required">*</span></label>
          <InputText v-model="form.code" :disabled="isEdit" class="w-full" />
          <small v-if="errors.code" class="error">{{ errors.code }}</small>
        </div>

        <div class="form-field">
          <label>Full Name <span class="required">*</span></label>
          <InputText v-model="form.fullName" class="w-full" />
          <small v-if="errors.fullName" class="error">{{ errors.fullName }}</small>
        </div>

        <div class="form-field">
          <label>Occupation <span class="required">*</span></label>
          <InputText v-model="form.occupation" class="w-full" />
          <small v-if="errors.occupation" class="error">{{ errors.occupation }}</small>
        </div>

        <div class="form-field">
          <label>Department <span class="required">*</span></label>
          <InputText v-model="form.department" class="w-full" />
          <small v-if="errors.department" class="error">{{ errors.department }}</small>
        </div>

        <div class="form-field">
          <label>Date of Employment</label>
          <DatePicker v-model="form.dateOfEmployment" dateFormat="yy-mm-dd" class="w-full" />
        </div>

        <div class="form-field">
          <label>Termination Date</label>
          <DatePicker v-model="form.terminationDate" dateFormat="yy-mm-dd" class="w-full" />
        </div>
      </div>

      <div class="form-actions">
        <Button label="Cancel" severity="secondary" @click="router.push('/employees')" />
        <Button label="Save" @click="saveEmployee" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.form-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  width: 100%;
  max-width: 700px;
}

.form-title {
  color: #7c3aed;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-field label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #333;
}

.required {
  color: #7c3aed;
}

.error {
  color: red;
  font-size: 0.8rem;
}

.w-full {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 640px) {
  .page-wrapper {
    padding: 1rem;
  }

  .form-card {
    padding: 1.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }
}
</style>