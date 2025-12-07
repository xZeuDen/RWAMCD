export async function GET(req, res) {
  // log that this api route was reached
  console.log("in the api page")

  // extract query parameters from the request url
  const { searchParams } = new URL(req.url)  // grab the search params object
  const email = searchParams.get('email')    // read email value from url
  const pass = searchParams.get('pass')      // read password value from url

  console.log(email); // output email to console for checking
  console.log(pass);  // output password to console for checking

  // send basic response back to frontend
  return Response.json({ "data":"valid" })
}
