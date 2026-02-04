export type AccountType = "ldap" | "local"

interface BaseAccount {
  id: string;
  marks?: Mark[];
  type: AccountType;
  login: string;
  password: string | null;
}

export interface LdapAccount extends BaseAccount {
  type: "ldap";
  password: null;
}

export interface LocalAccount extends BaseAccount {
  type: "local";
  password: string;
}

export type Account = LdapAccount | LocalAccount;

export type AccountFormData = {
  marks: string;
  type: AccountType;
  login: string;
  password: string;
}

export interface Mark {
  text: string;
}