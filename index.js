export default {
  async fetch(request) {
    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    try {
      const backendUrl = "https://script.google.com/a/macros/mayous.org/s/AKfycbyGsMvizzRXKaExglDi8a9W3jJvEAJOFlPy9XGxFkwL3Q5Hyhg2jPlJ9j3wLTXSZJs6fg/exec";

      const body = await request.text(); // explicitly parse body
      const backendRequest = new Request(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: body
      });

      const backendResponse = await fetch(backendRequest);
      const responseText = await backendResponse.text();

      return new Response(responseText, {
        status: backendResponse.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ result: "error", message: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }
  }
}
