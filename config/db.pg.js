const { Client } = require('pg');

// Buat koneksi ke server PostgreSQL
const databaseKoneksi = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'folder_management',
    password: '426425',
    port: 5432, // Port default PostgreSQL
});

databaseKoneksi.connect(err => {
  if (err) {
    console.error('connection error db sm', err.stack)
  } else {
    console.log('connected to db sm')
  }
})

module.exports = {
    databaseKoneksi
}