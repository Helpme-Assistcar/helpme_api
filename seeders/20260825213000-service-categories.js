"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("ServiceCategory", [
      {
        id: "1b5fe45f-9b79-47a5-b5d5-6b919f6b47f3",
        name: "Eletricista",
        icon: null,
        sort_order: null,
        created_at: new Date("2026-08-25T09:30:00Z"),
        updated_at: new Date("2026-08-25T09:30:00Z"),
      },
      {
        id: "4e5c9bc1-f84c-46a3-985a-ab76ff2f0af7",
        name: "Borracheiro",
        icon: null,
        sort_order: null,
        created_at: new Date("2026-08-25T09:30:00Z"),
        updated_at: new Date("2026-08-25T09:30:00Z"),
      },
      {
        id: "7117dc8f-53c0-4cd5-b079-3b3183a08b31",
        name: "Guincheiro",
        icon: null,
        sort_order: null,
        created_at: new Date("2026-08-25T09:30:00Z"),
        updated_at: new Date("2026-08-25T09:30:00Z"),
      },
      {
        id: "de5f9ea3-d300-4fa5-bf09-cf2c5580d811",
        name: "Mecânico",
        icon: null,
        sort_order: null,
        created_at: new Date("2026-08-25T09:30:00Z"),
        updated_at: new Date("2026-08-25T09:30:00Z"),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ServiceCategory", {
      id: [
        "1b5fe45f-9b79-47a5-b5d5-6b919f6b47f3",
        "4e5c9bc1-f84c-46a3-985a-ab76ff2f0af7",
        "7117dc8f-53c0-4cd5-b079-3b3183a08b31",
        "de5f9ea3-d300-4fa5-bf09-cf2c5580d811",
      ],
    });
  },
};
