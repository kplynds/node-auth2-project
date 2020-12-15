
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'kyle', password: 'password', department: 'science' },
        { username: 'jeff', password: 'password', department: 'math' },
      ]);
    });
};
