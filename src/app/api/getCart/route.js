export async function GET(req) {
  console.log("in the getCart api page"); // log that this route was reached

  const { MongoClient } = require("mongodb"); // mongodb client import
  const url =
    "mongodb+srv://denisdb:pass@cluster0.7onvups.mongodb.net/?appName=Cluster0"; // connection string for cluster
  const client = new MongoClient(url); // create client object

  const dbName = "app"; // database name used in this project

  try {
    await client.connect(); // open connection to database
    console.log("Connected to DB (getCart)");

    const db = client.db(dbName); // reference to the database
    const collection = db.collection("shopping_cart"); // cart collection reference

    // fetch all cart items for the placeholder user (will be dynamic later)
    const items = await collection
      .find({ username: "sample@test.com" }) // filter cart by username
      .toArray(); // convert cursor to array format

    console.log("cart items returned:", items.length); // log how many items came back

    return Response.json({ data: items }); // send items back to frontend
  } catch (err) {
    console.error("getCart ERROR:", err); // error logging
    return new Response(
      JSON.stringify({ error: String(err) }), // return the error message
      { status: 500 } // mark response as server error
    );
  } finally {
    await client.close(); // always close db connection
  }
}
