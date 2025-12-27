import Nano from 'nano';

const COUCHDB_URL = process.env.COUCHDB_URL || 'http://admin:12345678@127.0.0.1:5984';
const nano = Nano(COUCHDB_URL);


const dbName = 'arkade';
const db = nano.db.get(dbName)
  .then(() => nano.db.use(dbName))
  .catch(async () => {
    await nano.db.create(dbName);
    return nano.db.use(dbName);
  });

export default db;
