<script setup lang="ts">
import { ref } from 'vue';
import AccountRecord from './components/AccountRecord.vue';
import type { Account } from './types';

const templateAccount = ref<Account>({
  type: "local",
  password: "1234",
  login: "Test"
})

function alertAccount(value: Account) {
  alert(JSON.stringify(value, null, 2));
}
</script>

<template>
  <AccountRecord v-model="templateAccount" @update:modelValue="alertAccount" />
</template>

<style scoped></style>
