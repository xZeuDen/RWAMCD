export async function POST(req) {
  console.log("in the checkout api POST"); // log to confirm POST is hit

  const { MongoClient } = require("mongodb"); // import mongodb client
  const url =
    "mongodb+srv://denisdb:pass@cluster0.7onvups.mongodb.net/?appName=Cluster0"; // connection string for cluster
  const client = new MongoClient(url); // create new client instance
  const dbName = "app"; // name of the database

  try {
    const body = await req.json(); // read json body sent from frontend
    const items = body.items || []; // fallback if no items are sent

    if (!items.length) { // check empty cart
      console.log("no items sent from frontend");
      return Response.json({ data: "empty_cart" }); // respond early if no items
    }

    await client.connect(); // connect to mongodb
    console.log("Connected to DB (checkout)");

    const db = client.db(dbName); // get db reference
    const ordersCol = db.collection("orders"); // orders collection
    const cartCol = db.collection("shopping_cart"); // shopping cart collection

    const username = "sample@test.com"; // temporary hardcoded username

    const normalizedItems = items.map((item) => ({
      pname: item.pname, // product name
      price: item.price || 0, // ensure price exists
      quantity: item.quantity || 1, // ensure quantity exists
      username, // attach username to item
    }));

    const total = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity, // calculate total price
      0 // start sum at 0
    );

    const order = {
      username, // who placed the order
      items: normalizedItems, // list of ordered items
      total, // final calculated total
      createdAt: new Date(), // timestamp
    };

    await ordersCol.insertOne(order); // insert order into db
    console.log("order inserted");

    // 3) Optional: clear cart in DB for this user
    await cartCol.deleteMany({ username }); // clear all cart items for user
    console.log("cart cleared");

    return Response.json({ data: "order_placed" }); // success response
  } catch (err) {
    console.error("CHECKOUT ERROR:", err); // log error
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, // send server error back
    });
  } finally {
    await client.close(); // always close connection
  }
}
