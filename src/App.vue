<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { ElMessage, ElMessageBox, ElButton, ElRow, ElCol, ElAlert } from 'element-plus'
import { Plus as PlusIcon } from '@element-plus/icons-vue'

import AccountRecord from './components/AccountRecord.vue'

import { useAccountsStore } from './stores/accounts'
import type { Account } from './types'

const store = useAccountsStore()

/** TODO: save it to session storage */

function getNewAccount(): Account {
  return {
    id: uuidv4(),
    marks: [],
    type: 'local',
    login: '',
    password: '',
  }
}

function updateAccount(updatedAccount: Account) {
  store.updateAccount(updatedAccount)
}
function addNewAccount() {
  const newAccount = getNewAccount()
  store.addAccount(newAccount)
}
function removeAccount(accountId: string) {
  ElMessageBox.confirm(
    'Вы уверены, что хотите удалить этот аккаунт?',
    'Подтверждение удаления',
    {
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      type: 'warning',
    }
  ).then(() => {
    store.removeAccount(accountId)
    ElMessage({
      type: 'success',
      message: 'Аккаунт успешно удален',
    })
  })
}
</script>

<template>
  <div class="accounts-wrapper">
    <!-- TODO: move to component? -->
    <div class="accounts-header">
      <h2 class="accounts-title">
        Учетные записи
      </h2>
      <ElButton type="primary" :icon="PlusIcon" @click="addNewAccount" />
    </div>
    <div>
      <ElAlert
        type="warning"
        title="Для указания меток для одной пары логин/пароль используйте разделитель ;"
        :closable="false"
      />
    </div>
    <div class="accounts-list">
      <div v-if="store.accounts.length === 0" class="empty-accounts-list">
        Нет учетных записей
      </div>
      <div v-else>
        <!-- TODO: move to simple component -->
        <ElRow :gutter="10">
          <ElCol :span="8">
            <h3>Метки</h3>
          </ElCol>
          <ElCol :span="4">
            <h3>Тип записи</h3>
          </ElCol>
          <ElCol :span="4">
            <h3>Логин</h3>
          </ElCol>
          <ElCol :span="4">
            <h3>Пароль</h3>
          </ElCol>
          <ElCol :span="4" />
        </ElRow>
      </div>

      <div class="accounts-rows">
        <AccountRecord
          v-for="acc in store.accounts"
          :key="acc.id"
          :model-value="acc"
          @update:model-value="updateAccount"
          @remove="removeAccount(acc.id)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
  height: 100vh;
  padding: 32px;
  box-sizing: border-box;
}

#app {
  height: 100%;
}
</style>

<style scoped lang="scss">
.accounts-wrapper {
  box-sizing: border-box;
  height: 100%;
  padding: 24px;
  border: 2px solid var(--el-border-color-light);
  border-radius: 8px;
}

.accounts-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}
h2.accounts-title {
  font-size: 32px;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/** make it scrollable */
.accounts-rows {
  // overflow-y: auto;
}

.empty-accounts-list {
  color: var(--el-text-color-secondary);
  font-size: 18px;
  text-align: center;
  font-style: italic;
}
</style>
