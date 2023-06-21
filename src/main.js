import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function addContact(req, res) {
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);

  const db = client.db("contact");
  const coll = db.collection("details");

  let input = {
    name: req.query.name || "no name",
    email: req.query.email || "no email",
    message: req.query.message || "no message",
    ts: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  };

  await coll.insertOne(input);
  await client.close();
  res.json({ Operation: "Success Contact" });
}

async function loginByPost(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("register");
    const coll = db.collection("details");

    let query = { email: req.body.email, password: req.body.password };
    let userRef = await coll.findOne(query);

    await client.close();

    if (!userRef) {
      let errorMessage = `Account not registered or Incorrect Password: ${req.body.email}`;
      throw new Error(errorMessage);
    }

    res.json(userRef);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function addRegister(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("register");
    const coll = db.collection("details");

    let input = {
      firstname: req.query.firstname || "no firstname",
      lastname: req.query.lastname || "no lastname",
      email: req.query.email || "no email",
      password: req.query.password || "no password",
      dob: req.query.dob || "no date",
      gender: req.query.gender || "no gender",
      ts: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    };

    await coll.insertOne(input);
    await client.close();
    res.json({ Operation: "Success Register" });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function readAll(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("register");
    const coll = db.collection("details");

    let list = await coll.find().toArray();

    await client.close();
    res.json(list);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function deleteUser(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("register");
    const messageColl = db.collection("details");

    if (!req.query.email) {
      throw new Error("Required field is missing");
    }

    await messageColl.deleteOne({ email: req.query.email });


    await client.close();

    res.json({ opr: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function updateUser(req, res) {
  try { 
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("register");
    const coll = db.collection("details");

    const { email, firstname, lastname, dob, gender } = req.body;

    if (!email) {
      throw new Error("Required field is missing");
    }

    await coll.updateOne(
      { email },
      { $set: { firstname, lastname, dob, gender } }
    );

    await client.close();

    res.json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

app.get("/addContact", addContact);
app.get("/addRegister", addRegister);
app.get("/readAll", readAll);
app.post("/loginPost", loginByPost);
app.get("/deleteUser", deleteUser);
app.post("/updateUser", updateUser);

app.listen(4000);
