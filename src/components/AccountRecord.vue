<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElButton, ElInput, ElSelect, ElOption, ElFormItem, ElForm, type FormRules } from 'element-plus'
import { Delete as DeleteIcon } from "@element-plus/icons-vue"

import type { Account, AccountType, Mark } from '@/types'

import AccountRow from './AccountRow.vue'

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
  (e: "remove"): void;
}>()

const formData = reactive<FormData>(
  convertAccountToFormData(props.modelValue)
)

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

const formEl = ref<InstanceType<typeof ElForm> | null>(null)

function submitForm() {
  formEl.value?.validate((valid) => {
    if (valid) {
      const updatedAccount = convertFormDataToAccount(formData)
      emit("update:modelValue", updatedAccount)
    }
  })
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
    id: props.modelValue.id, // id не будет меняться в форме
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
  return marks.map(({ text }) => text).join(MARKS_DELIMITER)
}
// TODO: finish formatting
// function formatMarksLine(line: string): string {
// // добавляем в метки пробелы для красоты
//   return line.replace(/;([a-zA-Z0-9_])/, )
// }
</script>

<template>
  <ElForm ref="formEl" :model="formData" :rules="rules">
    <AccountRow :has-password="hasPassword">
      <template #marks>
        <!-- Можно было бы сделать через ElTag, что удобнее для юзера, но по тз это должна быть строка  -->
        <ElFormItem prop="marks">
          <ElInput v-model="formData.marks" placeholder="Метки (через ;)" @change="submitForm" />
        </ElFormItem>
      </template>
      <template #type>
        <ElFormItem prop="type">
          <ElSelect v-model="formData.type" placeholder="Тип учетной записи"  @change="submitForm">
            <ElOption v-for="(label, type) in ACCOUT_TYPE_LABELS" :key="type" :value="type" :label="label" />
          </ElSelect>
        </ElFormItem>
      </template>
      <template #login>
        <ElFormItem prop="login">
          <ElInput v-model="formData.login" placeholder="Логин" @change="submitForm" />
        </ElFormItem>
      </template>
      <template #password>
        <ElFormItem prop="password">
          <ElInput v-model="formData.password" placeholder="Пароль" type="password" show-password @change="submitForm" />
        </ElFormItem>
      </template>
      <template #actions>
        <ElButton type="danger" :icon="DeleteIcon" @click="emit('remove')" />
      </template>
    </AccountRow>
  </ElForm>
</template>

<style scoped lang="scss"></style>