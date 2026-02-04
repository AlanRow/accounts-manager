<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import { ElButton, ElInput, ElSelect, ElOption, ElFormItem, ElForm, type FormRules } from "element-plus"
import { Delete as DeleteIcon } from "@element-plus/icons-vue"

import type { Account, AccountFormData, AccountType } from "@/types"
import { convertAccountToFormData, convertFormDataToAccount } from "@/utils"

import AccountRow from "./AccountRow.vue"

const ACCOUT_TYPE_LABELS: Record<AccountType, string> = {
  "local": "Локальная",
  "ldap": "LDAP",
}

const props = defineProps<{
  modelValue: Account;
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: Account): void;
  (e: "remove"): void;
}>()

const formData = reactive<AccountFormData>(
  convertAccountToFormData(props.modelValue)
)

const hasPassword = computed(() => formData.type == "local")

/** по мере разрастания кода можно вынести эти правила в отдельный файл, но пока это не рационально */
const rules = reactive<FormRules<AccountFormData>>({
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
      const updatedAccount = convertFormDataToAccount(props.modelValue.id, formData)
      emit("update:modelValue", updatedAccount)
    }
  })
}
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