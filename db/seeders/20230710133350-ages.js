'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "ages",
      [
        {
          age:"1-3",         
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          age:"3-6",              
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          age:"6-9",         
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          age:"9-12",         
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          age:"12-15",         
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ages", null, {})
  }
};
