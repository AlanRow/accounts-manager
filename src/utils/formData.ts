import type { Account, AccountFormData } from "@/types"
import { convertMarksToLine, parseLineToMarks } from "./marks"

export function convertAccountToFormData(account: Account): AccountFormData {
  return {
    marks: convertMarksToLine(account.marks ?? []),
    type: account.type,
    login: account.login,
    password: account.password ?? "",
  }
}

export function convertFormDataToAccount(id: string, formData: AccountFormData): Account {
  const commonData = {
    id,
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