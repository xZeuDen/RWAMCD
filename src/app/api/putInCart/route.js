export async function GET(req) {
  console.log("in the putInCart api page"); // log route access for debugging

  const { searchParams } = new URL(req.url); // extract search params from request url
  const pname = searchParams.get("pname");   // read product name from url
  const priceParam = searchParams.get("price"); // raw price value as string
  const price = parseFloat(priceParam || "0");  // convert price to number with fallback

  console.log("pname:", pname, "price:", price); // log incoming item details

  const { MongoClient } = require("mongodb"); // import mongodb client
  const url =
    "mongodb+srv://denisdb:pass@cluster0.7onvups.mongodb.net/?appName=Cluster0"; // connection string
  const client = new MongoClient(url); // create mongodb client instance
  const dbName = "app"; // name of database

  await client.connect(); // open connection to database
  console.log("Connected successfully to server"); // confirm successful connection

  const db = client.db(dbName); // reference to db
  const collection = db.collection("shopping_cart"); // shopping cart collection reference

  const myobj = {
    pname: pname,        // product name stored in db
    price: price,        // product price stored in db
    quantity: 1,         // default quantity added to cart
    username: "sample@test.com", // placeholder username
  };

  await collection.insertOne(myobj); // insert new cart item document

  return Response.json({ data: "inserted" }); // send confirmation response
}
