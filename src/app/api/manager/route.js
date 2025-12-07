export async function GET() {
  console.log("in manager api route"); // log to confirm this endpoint is reached

  const { MongoClient } = require("mongodb"); // import mongodb client
  const url =
    "mongodb+srv://denisdb:pass@cluster0.7onvups.mongodb.net/?appName=Cluster0"; // connection string for cluster
  const client = new MongoClient(url); // create client instance
  const dbName = "app"; // database name used throughout the project

  try {
    await client.connect(); // open db connection
    const db = client.db(dbName); // get db reference
    const ordersCol = db.collection("orders"); // reference to orders collection

    // 1) Total sales calculation using aggregation
    const totalSalesAgg = await ordersCol
      .aggregate([
        {
          $group: {
            _id: null, // no grouping key needed here
            totalSales: { $sum: "$total" }, // sum all order totals
          },
        },
      ])
      .toArray(); // convert aggregation result to array

    const totalSales = totalSalesAgg[0]?.totalSales || 0; // fallback to 0 if no orders exist

    // 2) Count distinct customers (unique usernames)
    const distinctUsernames = await ordersCol.distinct("username"); // fetch all unique usernames
    const totalCustomers = distinctUsernames.length; // number of unique customers

    // 3) Aggregate sales grouped by day
    const salesByDayAgg = await ordersCol
      .aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // format date for grouping
            },
            dayTotal: { $sum: "$total" }, // sum daily totals
          },
        },
        { $sort: { _id: 1 } }, // sort results by date
      ])
      .toArray(); // convert result to array

    const salesByDay = salesByDayAgg.map((doc) => ({
      date: doc._id, // formatted date field
      total: doc.dayTotal, // total sales for this date
    }));

    return Response.json({
      totalSales, // overall sales
      totalCustomers, // total distinct customers
      salesByDay, // list of sales broken down by date
    });
  } catch (err) {
    console.error("MANAGER API ERROR:", err); // log error for debugging
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, // server error response
    });
  } finally {
    await client.close(); // ensure mongo connection is closed
  }
}
