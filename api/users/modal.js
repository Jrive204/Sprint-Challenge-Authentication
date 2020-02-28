const db = require('../../database/dbConfig');

module.exports = {
  add,
  find,
  findby
};

async function add(user) {
  await db('users').insert(user);

  return findby(user);
}

function find(id) {
  let user = db('users');
  if (id) {
    console.log('HELLOOO');
    return user.where({ id }).first();
  } else {
    return user;
  }
}

function findby(filter) {
  return db('users')
    .where(filter)
    .first();
}
