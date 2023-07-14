'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "genres",
      [
        {
          genre:"Fairytale",         
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          genre:"Adventure",         
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          genre:"Mystery",         
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          genre:"Science Fiction",         
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          genre:"Horror",         
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("genres", null, {})
  }
};
