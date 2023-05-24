import express, { Request, Response } from "express";
import { connectToDB, getDB } from "./db";
import { ObjectId } from "mongodb";

const port = 3000;
const app = express();
app.use(express.json());

let db;

connectToDB((err) => {
  if (!err) {
    app.listen(port, () => console.log(`Listening to port ${port}`));
    db = getDB();

    //Exit process on SIGINT(Ctrl+C)
    process.on("SIGINT", function () {
      console.log("Process Killed");
      process.exit(0);
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome to Veroni",
  });
});

app.get("/books", async (req: Request, res: Response) => {
  try {
    let books = await db
      .collection("books")
      .find()
      .sort({ author: 1 })
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      let book: Object = await db
        .collection("books")
        .findOne({ _id: new ObjectId(req.params.id) });
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ msg: "Book not found" });
      }
    } else {
      res.status(400).json({ msg: "Invalid id" });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

app.post("/books", async (req, res) => {
  try {
    const bookdetails = req.body;
    let book = await db.collection("books").insertOne(bookdetails);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});
