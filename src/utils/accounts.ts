import { v4 as uuidv4 } from "uuid"

import type { Account } from "@/types";

export function getNewAccount(): Account {
  return {
    id: uuidv4(),
    marks: [],
    type: 'local',
    login: '',
    password: '',
  }
}