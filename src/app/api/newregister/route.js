export async function GET(req, res) {
  // log entry to confirm this api route is running
  console.log("in the api page")

  // extract query parameters from the request url
  const { searchParams } = new URL(req.url) // get access to url params
  const email = searchParams.get('email')   // read email value
  const pass = searchParams.get('pass')     // read password value
  const address = searchParams.get('address') // read address value
  const phone = searchParams.get('phone');    // read phone value
  const confirmEmail = searchParams.get('confirm-email') // read confirm email
  const confirmPass = searchParams.get('confirm-pass');   // read confirm password

  console.log(email); // log extracted values for debugging
  console.log(pass);
  console.log(address);
  console.log(phone);
  console.log(confirmEmail);
  console.log(confirmPass);

  // database setup section
  const { MongoClient } = require('mongodb'); // import mongodb client

  const url = 'mongodb+srv://denisdb:pass@cluster0.7onvups.mongodb.net/?appName=Cluster0'; // connection string

  const client = new MongoClient(url); // create new mongodb client instance

  const dbName = 'app'; // database name used in this project

  await client.connect(); // open connection to cluster

  console.log('Connected successfully to server'); // confirm connection

  const db = client.db(dbName); // reference to db

  const collection = db.collection('users'); // users collection reference

  const findResult = await collection.insertOne({"username": email, "pass": pass}) 
  // insert new user with provided credentials

  // send final response back to frontend
  return Response.json({ "data":"registered" })
}
