"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Users", [
      {
        id: "c7f9692d-3f43-4b58-8489-333432721dac",
        name: "M7uricio de Sousa",
        email: "maumausn@gmail.com",
        phone: "11964664514",
        photo:
          "https://lh3.googleusercontent.com/a/ACg8ocLq-bguF4PR__LH--YLwY0CAeaJSJajIU8yq0EgF8hCYc7T58B4sQ=s96-c",
        password_hash: "$2b$08$/Vsil6pt/amKn6rl8LzhKOYld4K8DCUKVjEq5K3/3GLHNLcSpG8ZC",
        email_verified: false,
        phone_verified: false,
        deleted_at: null,
        created_at: new Date("2026-08-26T00:13:07.313Z"),
        updated_at: new Date("2026-08-26T00:13:07.313Z"),
      },
      {
        id: "fd3051f6-4799-4816-a729-0a3600ba194e",
        name: "Mauricio de Sousa",
        email: "m7uricio.dev@gmail.com",
        phone: "11964664513",
        photo:
          "https://lh3.googleusercontent.com/a/ACg8ocK9JY8b7MCBPInZ0qxpLXKRlVJxIDrdBbt1V3YVJg7HROOpFIt_=s96-c",
        password_hash: "$2b$08$Fa6xetCudM.jyI2vH9HEd.bwm8C9STtzwG9.Up4K5feoCRrftG4gu",
        email_verified: false,
        phone_verified: false,
        deleted_at: null,
        created_at: new Date("2026-08-26T00:11:56.929Z"),
        updated_at: new Date("2026-08-26T00:11:56.929Z"),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", {
      id: [
        "c7f9692d-3f43-4b58-8489-333432721dac",
        "fd3051f6-4799-4816-a729-0a3600ba194e",
      ],
    });
  },
};
