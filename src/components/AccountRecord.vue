<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { ElRow, ElCol, ElButton, ElInput, ElSelect, ElOption, ElFormItem, ElForm, type FormRules } from 'element-plus';
import { Delete as DeleteIcon } from "@element-plus/icons-vue"

import type { Account, AccountType, Mark } from '@/types';

type FormData = {
  marks: string;
  type: AccountType;
  login: string;
  password: string;
}

const ACCOUT_TYPE_LABELS: Record<AccountType, string> = {
  "local": "Локальная",
  "ldap": "LDAP",
}

const props = defineProps<{
  modelValue: Account;
}>()

// TODO: rewrite with validations later
const emit = defineEmits<{
  (e: "update:modelValue", value: Account): void; 
}>()

const formData = reactive<FormData>(
  convertAccountToFormData(props.modelValue)
);

const hasPassword = computed(() => formData.type == "local")

const rules = reactive<FormRules<FormData>>({
  marks: [
    { required: true, message: "Обязательно для заполнения", trigger: "blur" },
    { max: 50, message: "Максимальная длина 50 символов", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (!/^[a-zA-Z0-9_]+(;[a-zA-Z0-9_]+)*$/.test(value)) {
          callback(new Error("Метки должны содержать символы A-Z, a-z, 0-9 и _, разделенные ;"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  login: [
    { required: true, message: "Обязательно для заполнения", trigger: "blur" },
    { max: 100, message: "Максимальная длина 100 символов", trigger: "blur" },
  ],
  password: hasPassword.value ? [
    { required: true, message: "Обязательно для заполнения", trigger: "blur" },
    { max: 100, message: "Максимальная длина 100 символов", trigger: "blur" },
  ] : [],
})

watch(formData, () => {
  const isValid = validate();

  if (isValid) {
    const updatedAccount = convertFormDataToAccount(formData);
    emit("update:modelValue", updatedAccount);
  }
})

function validate() {

  return true;
}

function convertAccountToFormData(account: Account): FormData {
  return {
    marks: convertMarksToLine(account.marks ?? []),
    type: account.type,
    login: account.login,
    password: account.password ?? "",
  }
}

function convertFormDataToAccount(formData: FormData): Account {
  const commonData = {
    marks: parseLineToMarks(formData.marks),
    login: formData.login,
  }
  if (formData.type == "ldap") {
    return {
      ...commonData,
      type: formData.type,
      password: null,
    }
  } else {
    return {
      ...commonData,
      type: formData.type,
      password: formData.password,
    }
  }
}

const MARKS_DELIMITER = ";"

function parseLineToMarks(line: string): Mark[] {
  return line.split(MARKS_DELIMITER).map(text => ({ text }))
}
function convertMarksToLine(marks: Mark[]): string {
  return marks.join(MARKS_DELIMITER)
}
// TODO: finish formatting
// function formatMarksLine(line: string): string {
// // добавляем в метки пробелы для красоты
//   return line.replace(/;([a-zA-Z0-9_])/, )
// }
</script>

<template>
  <ElForm :model="formData" :rules="rules">
    <ElRow :gutter="10">
      <!-- Метки -->
      <!-- Можно было бы сделать через ElTag, что удобнее для юзера, но по тз это должна быть строка  -->
      <ElCol :span="8">
        <ElFormItem prop="marks">
          <ElInput v-model="formData.marks" />
        </ElFormItem>
      </ElCol>
      <!-- Тип -->
      <ElCol :span="4">
        <ElFormItem prop="type">
          <ElSelect v-model="formData.type" placeholder="Тип учетной записи">
            <ElOption v-for="(label, type) in ACCOUT_TYPE_LABELS" :key="type" :value="type" :label="label" />
          </ElSelect>
        </ElFormItem>
      </ElCol>
      <!-- Логин -->
      <ElCol :span="hasPassword ? 4 : 8">
        <ElFormItem prop="login">
          <ElInput v-model="formData.login" />
        </ElFormItem>
      </ElCol>
      <!-- Пароль -->
      <ElCol v-if="hasPassword" :span="4">
        <ElFormItem prop="password">
          <ElInput v-model="formData.password" type="password" show-password />
        </ElFormItem>
      </ElCol>
      <!-- Действия -->
      <ElCol :span="4">
        <ElButton type="danger" :icon="DeleteIcon" />
      </ElCol>
    </ElRow>
  </ElForm>
</template>

<style scoped lang="scss"></style>