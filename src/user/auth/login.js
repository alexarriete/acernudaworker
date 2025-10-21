import {b2cValues} from "../../utils/constant";

// Helper para base64url
function base64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Genera code_challenge desde code_verifier
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return base64url(hashBuffer);
}

// Genera code_verifier aleatorio
function generateRandomString(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < array.length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}

// --- Middleware principal ---
export async function authMiddleware(request, url) {
  const redirectUri = new URL("/auth/callback", url.origin).toString();

  // --- LOGIN ---
  if (url.pathname === "/auth/login") {
    const codeVerifier = generateRandomString();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const loginUrl = `https://${b2cValues.tenantName}.b2clogin.com/${b2cValues.tenantName}.onmicrosoft.com/${b2cValues.policy}/oauth2/v2.0/authorize?` +
      `client_id=${b2cValues.clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=openid profile offline_access` +
      `&code_challenge=${encodeURIComponent(codeChallenge)}` +
      `&code_challenge_method=S256` +
      `&prompt=login`;

    // Crear Response con headers desde el inicio
    return new Response(null, {
      status: 302,
      headers: {
        "Location": loginUrl,
        "Set-Cookie": `code_verifier=${codeVerifier}; HttpOnly; Path=/;`
      }
    });
  }

  // --- CALLBACK ---
  if (url.pathname === "/auth/callback") {
    const code = url.searchParams.get("code");
    if (!code) return new Response("No code provided", { status: 400 });

    const cookie = request.headers.get("Cookie") || "";
    const match = cookie.match(/code_verifier=([^;]+)/);
    if (!match) return new Response("Missing code_verifier", { status: 400 });
    const codeVerifier = match[1];

    const tokenResponse = await fetch(`https://${b2cValues.tenantName}.b2clogin.com/${b2cValues.tenantName}.onmicrosoft.com/${b2cValues.policy}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: b2cValues.clientId,
        code: code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        scope: "openid profile offline_access",
        code_verifier: codeVerifier
      })
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return new Response(`Token error: ${tokenData.error_description}`, { status: 400 });
    }

    return new Response(null, {
  status: 302,
  headers: {
    "Location": "/",
    "Set-Cookie": `id_token=${tokenData.id_token}; HttpOnly; Path=/; Secure; SameSite=Lax`
    }
    });

  }

  return null;
}

export function logout(request){
   const response = new Response(null, {
        status: 302,
        headers: {
          "Location": "/", // redirige al inicio
          "Set-Cookie": `id_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      });

      return response;
}