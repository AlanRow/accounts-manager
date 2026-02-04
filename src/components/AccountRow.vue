<script setup lang="ts">
import { ElCol, ElRow } from 'element-plus';

defineProps<{
  hasPassword: boolean;
}>()
</script>

<template>
  <ElRow :gutter="10">
    <ElCol :span="8">
      <slot name="marks"></slot>
    </ElCol>
    <ElCol :span="4">
      <slot name="type"></slot>
    </ElCol>
    <ElCol :span="hasPassword ? 4 : 8">
      <slot name="login"></slot>
    </ElCol>
    <ElCol v-if="hasPassword" :span="4">
      <slot name="password"></slot>
    </ElCol>
    <ElCol :span="4">
      <slot name="actions"></slot>
    </ElCol>
  </ElRow>
</template>