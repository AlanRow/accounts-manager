import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '@/types'

export const useAccountsStore = defineStore('accounts', () => {
  const accountsState = ref<Account[]>([])

  // создаем новый массив, чтобы избежать мутаций
  // это затратнее по времени, но безопаснее для изменений
  const accounts = computed(() => [...accountsState.value])

  function addAccount(account: Account) {
    accountsState.value.push(account)
  }

  // это может стать проблемой на очень большом числе аккаунтов,
  // но это редкая ситуация, т. к. при большом количестве записей будет
  // использоваться пагинация и хранение в БД
  function removeAccount(id: string) {
    accountsState.value = accounts.value.filter(account => account.id !== id)
  }

  function updateAccount(updated: Account) {
    accountsState.value = accounts.value.map(account => {
      if (account.id === updated.id) {
        return updated
      }
      return account
    })
  }

  return { accounts, addAccount, removeAccount, updateAccount }
})
