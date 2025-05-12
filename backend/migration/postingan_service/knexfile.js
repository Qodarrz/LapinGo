// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'dbpplg.smkn4bogor.sch.id',
      user: 'pplg',
      password: 'adminpplg2025!',
      database: 'lapingo_postingan',
      port: 6093,
      connectTimeout: 200000,
    },
    migrations: {
      directory: './migrations',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: 'dbpplg.smkn4bogor.sch.id',
      user: 'pplg',
      password: 'adminpplg2025!',
      database: 'lapingo_postingan',
      port: 6093,
      connectTimeout: 200000,
    },
    migrations: {
      directory: './migrations',
    },
  },
};
