export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Handle preflight CORS
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

    const backendBase = "https://script.google.com/macros/s/AKfycbyGsMvizzRXKaExglDi8a9W3jJvEAJOFlPy9XGxFkwL3Q5Hyhg2jPlJ9j3wLTXSZJs6fg/exec";

    try {
      if (request.method === "GET" && url.pathname === "/confirm" && url.searchParams.has("token")) {
        const token = url.searchParams.get("token");
        const redirectUrl = `${backendBase}?confirm=${encodeURIComponent(token)}`;
        return fetch(redirectUrl); // proxy GET request to Apps Script
      }

      if (request.method === "POST") {
        const body = await request.text();

        const backendRequest = new Request(backendBase, {
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
      }

      // Catch all fallback
      return new Response("Not Found", { status: 404 });

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
