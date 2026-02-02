interface BaseAccount {
  marks?: Mark[];
  type: "ldap" | "local";
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

export interface Mark {
  text: string;
}