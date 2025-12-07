export async function GET(req) {
  console.log("in the login api page"); // simple log to show this api route ran

  const { searchParams } = new URL(req.url); // extract query params from request url
  const email = searchParams.get("email");   // read email from url
  const pass = searchParams.get("pass");     // read password from url
  console.log("login attempt:", email, pass); // log incoming credentials

  const { MongoClient } = require("mongodb"); // import client for mongodb

  const url = "mongodb+srv://denisdb:pass@cluster0.7onvups.mongodb.net/?appName=Cluster0"; // mongo connection string
  const client = new MongoClient(url); // create client instance

  const dbName = "app"; // name of the database being used

  try {
    await client.connect(); // connect to mongo cluster
    console.log("Connected successfully to server");

    const db = client.db(dbName); // reference to database
    const collection = db.collection("users"); // users collection reference

    const user = await collection.findOne({ username: email }); // attempt to find user by email

    if (!user) { // check if user does not exist
      console.log("no user found");
      return Response.json({ data: "invalid" }); // invalid login response
    }

    // basic password comparison (same as register logic)
    if (user.pass !== pass) { // check password mismatch
      console.log("password mismatch");
      return Response.json({ data: "invalid" }); // invalid login due to wrong password
    }

    console.log("login success"); // login confirmed
    return Response.json({ data: "valid" }); // send success response
  } catch (err) {
    console.error("login error:", err); // log error for debugging
    return new Response(
      JSON.stringify({ data: "error", message: String(err) }), // send error details
      { status: 500 } // mark status as server error
    );
  } finally {
    await client.close(); // ensure db connection closes
  }
}
