<script setup lang="ts">
import { ref } from 'vue';
import AccountRecord from './components/AccountRecord.vue';
import type { Account } from './types';

const templateAccount = ref<Account>({
  type: "local",
  password: "1234",
  login: "Test"
})
</script>

<template>
  <AccountRecord v-model="templateAccount" />
</template>

<style scoped></style>
