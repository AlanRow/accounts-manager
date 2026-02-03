import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '@/types'

export const useAccountsStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([])

    function addAccount(account: Account) {
      accounts.value.push(account)
    }

    // это может стать проблемой на очень большом числе аккаунтов,
    // но это редкая ситуация, т. к. при большом количестве записей будет
    // использоваться пагинация и хранение в БД
    function removeAccount(id: string) {
      accounts.value = accounts.value.filter(account => account.id !== id)
    }

    function updateAccount(updated: Account) {
      accounts.value = accounts.value.map(account => {
        if (account.id === updated.id) {
          return updated
        }
        return account
      })
    }

    return { accounts, addAccount, removeAccount, updateAccount }
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['accounts']
    }
  }
)
