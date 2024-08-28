// import { v4 as uuidv4 } from 'uuid'
import { readFileSync } from "fs";

interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    password: string;
    name: string;
    role: string;
}

interface CleanUser extends Omit<User, "createdAt" | "updatedAt"> {}

export default defineTask({
    meta: {
      name: 'db:seed',
      description: 'Run database seed task'
    },
    async run() {
      console.log('Running DB seed task...')

      const users = JSON.parse(
        readFileSync("./dev/data/secret/users.json", "utf-8")
      ) as User[];
  
      const cleanUsers: CleanUser[] = users.map(({ createdAt, updatedAt, ...cleanUser }) => cleanUser);

      await useDrizzle().insert(tables.users).values(cleanUsers)

      return { result: 'success', users: users.length }
    }
  })
  