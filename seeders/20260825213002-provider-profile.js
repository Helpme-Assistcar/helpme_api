"use strict";

const PROVIDER_PROFILE_ID = "264db5e5-0fbe-4f54-a47c-7ce1aa4939fc";

module.exports = {
  async up(queryInterface) {
    // "location" é GEOGRAPHY(POINT, 4326) — o valor vindo do dump é o WKB em
    // hex (EWKB), que o PostGIS aceita via cast direto para geography.
    // queryInterface.bulkInsert não faz esse cast sozinho, então usamos uma
    // query crua com bind parameters (valores controlados, não input de usuário).
    await queryInterface.sequelize.query(
      `
      INSERT INTO "ProviderProfile"
        (avg_rating, bio, created_at, id, last_payment, latitude, location, longitude,
         plan_active, rating_count, registered, service_provided, service_radius_km,
         status, updated_at, user_id)
      VALUES
        (:avg_rating, :bio, :created_at, :id, :last_payment, :latitude, :location::geography, :longitude,
         :plan_active, :rating_count, :registered, :service_provided, :service_radius_km,
         :status, :updated_at, :user_id)
      `,
      {
        replacements: {
          avg_rating: 0.0,
          bio: null,
          created_at: new Date("2026-08-26T00:11:57.09Z"),
          id: PROVIDER_PROFILE_ID,
          last_payment: new Date("2026-08-26T00:11:57.09Z"),
          latitude: -23.6928505,
          location: "0101000020E61000003B71395E814B47C06A847EA65EB137C0",
          longitude: -46.5898855,
          plan_active: true,
          rating_count: 0,
          registered: true,
          service_provided: "Mecânico",
          service_radius_km: null,
          status: "OFFLINE",
          updated_at: new Date("2026-08-26T00:12:23.574Z"),
          user_id: "fd3051f6-4799-4816-a729-0a3600ba194e",
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ProviderProfile", {
      id: [PROVIDER_PROFILE_ID],
    });
  },
};
