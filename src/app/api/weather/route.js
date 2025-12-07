export async function GET(req) {
  const { searchParams } = new URL(req.url); // extract query params from incoming request
  const city = searchParams.get("city") || "Dublin,IE"; // default city if none provided

  const apiKey = process.env.OPENWEATHER_API_KEY; // read API key from environment variables

  if (!apiKey) {
    // return error response if API key is missing
    return new Response(JSON.stringify({ error: "Missing API key" }), {
      status: 500,
    });
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`; // build final API request URL

  try {
    const result = await fetch(url); // send request to OpenWeather API
    const data = await result.json(); // parse JSON body from the response

    // create clean payload containing only fields required by frontend
    const payload = {
      city: data.name, // city name returned by api
      temp: data.main?.temp ?? null, // temperature in celsius
      feelsLike: data.main?.feels_like ?? null, // feels-like temperature
      description: data.weather?.[0]?.description ?? "N/A", // textual weather description
    };

    return Response.json(payload); // send final data back to frontend
  } catch (err) {
    // return error if request or parsing fails
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
