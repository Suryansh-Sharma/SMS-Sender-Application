import { db } from "./db.js";
export const intAdmin = async () => {
  const userCount = db
    .prepare("SELECT COUNT(*) as count FROM users")
    .get().count;
  if (userCount === 0) {
    db.prepare(
      `
          INSERT INTO users (name,password,role,change_password)
          VALUES(?,?,?,?)
          `,
    ).run("Suryansh@dev.com", "Admin@1234", "ADMIN", 0);

    console.log("Creating default admin...");
  }
};
