import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || "swiftwheels";

if (!uri) {
  throw new Error("Missing MongoDB configuration: MONGODB_URI. Copy .env.example to .env and configure it.");
}

const client = new MongoClient(uri);
let database;

export async function connectToDatabase() {
  await client.connect();
  database = client.db(databaseName);
  await Promise.all([
    database.collection("users").createIndex({ Username: 1 }, { unique: true }),
    database.collection("vehicles").createIndex({ plate_Number: 1 }, { unique: true }),
    database.collection("customers").createIndex({ Email: 1 }),
    database.collection("promotions").createIndex({ id: 1 }, { unique: true }),
    database.collection("promotionVehicles").createIndex(
      { promotion_id: 1, plate_Number: 1 },
      { unique: true }
    ),
  ]);
  console.log(`Connected to MongoDB database "${databaseName}".`);
}

export function getCollection(name) {
  if (!database) {
    throw new Error("MongoDB is not connected. Start the API after configuring MONGODB_URI.");
  }
  return database.collection(name);
}

export async function closeDatabase() {
  await client.close();
  database = undefined;
}
