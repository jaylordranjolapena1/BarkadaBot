const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mybot-d79df-default-rtdb.asia-southeast1.firebasedatabase.app/"
  });
}

const db = admin.database();

// ===== BASIC FUNCTIONS =====

async function getData(path) {
  const snap = await db.ref(path).once("value");
  return snap.val();
}

async function setData(path, value) {
  await db.ref(path).set(value);
}

async function deleteData(path) {
  await db.ref(path).remove();
}

// ===== REALTIME LISTENER (🔥 MISSING PART) =====

function onChildAdded(path, callback) {
  db.ref(path).limitToLast(1).on("child_added", snap => {
    callback(snap.key, snap.val());
  });
}

module.exports = {
  getData,
  setData,
  deleteData,
  onChildAdded
};
