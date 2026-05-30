import { db } from "../db/db.js";
export const userRepo = {
  findByUsername: (name) => {
    return db.prepare("SELECT * FROM users WHERE name =?").get(name);
  },
  getAll: () => {
    return db
      .prepare(
        "SELECT id, name, role, is_active, change_password, joined_on FROM users ORDER BY id",
      )
      .all();
  },
  createNewUser: async ({ name }) => {
    const existing = db
      .prepare("SELECT id FROM users WHERE name = ?")
      .get(name);

    if (existing) {
      throw new Error("User already exists");
    }

    const result = db
      .prepare(
        `
      INSERT INTO users (
        name,
        password,
        role,
        is_active,
        change_password,
        joined_on
      )
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `,
      )
      .run(name, "Test@1234", "USER", 1, 1);

    return {
      id: result.lastInsertRowid,
      name,
      role: "USER",
    };
  },
  resetUserPassword: async ({ username }) => {
    const user = db.prepare("SELECT * FROM users WHERE name = ?").get(username);
    if (!user) {
      console.log("username " + username);
      throw new Error("Unable to find user");
    }
    const res = db
      .prepare(`UPDATE users SET password=?,change_password=1 WHERE name =?`)
      .run("Test@1234", username);
    if (res.changes === 0) {
      throw new Error("Unable to reset password.");
    }
    return { success: true };
  },
  updateCurrentPassword: async ({ username, password, newPassword }) => {
    const user = db.prepare("SELECT * FROM users WHERE name = ?").get(username);
    if (!user) {
      throw new Error("Unable to find user");
    }
    if (password != user.password) {
      throw new Error("Your current password is wrong !!");
    }
    if (user.password == newPassword) {
      throw new Error("New password can't be same as Old password !!");
    }
    const res = db
      .prepare(`UPDATE users SET password=?,change_password=0 WHERE name =?`)
      .run(newPassword, username);
    if (res.changes === 0) {
      throw new Error("Unable to update password.");
    }
    return { success: true };
  },
};
