import { MongoClient, Db } from "mongodb";

type callbackType = (err?: Error) => void;

let dbConnection: Db;


  const connectToDB = (cb: callbackType) => {
    MongoClient.connect("mongodb://localhost:27017/bookstore")
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err: Error) => {
        console.log(err.message);
        return cb(err);
      });
  }
  const getDB = () => dbConnection

  export { connectToDB, getDB };