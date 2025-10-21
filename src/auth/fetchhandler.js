import {authMiddleware, isValidIssuer} from "./login"
import {getLayout} from '../layout'

let isAuthenticated = false;
export async function fetchHandler(request) {
  const url = new URL(request.url);

  // Middleware de auth
  const authResponse = await authMiddleware(request, url);
  if (authResponse) return authResponse;
  let layout = await getLayout(request);
  // Middleware de rutas protegidas
  const protectedResponse = await protectedMiddleware(request, url);
  if (protectedResponse) return protectedResponse;
    
  // Ruta pública
  if(isAuthenticated){
    layout = layout.replace("auth/login", "perfil");
    layout = layout.replace('"login"', "nombre de usuario");
  } 
  
  if (url.pathname === "/" || url.pathname === "/index.html") {
    return new Response(layout, { headers: { "Content-Type": "text/html" } });
  }

  return new Response("Not Found", { status: 404 });
}

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

async function protectedMiddleware(request, url) {
  if (url.pathname.startsWith("/auth")) {
    const cookie = request.headers.get("Cookie") || "";
    const match = cookie.match(/id_token=([^;]+)/);
    if (!match) {
      return new Response(null, {
        status: 302,
        headers: { "Location": "/auth/login" }
      });
    }

    const token = match[1];
    const payload = parseJwt(token);
    if (!payload || !isValidIssuer(payload.iss) ) {
            // Token inválido      
      return new Response(null, {
        status: 302,
        headers: { "Location": "/auth/login" }
      });
    }

    // Verificar expiración
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return new Response(null, {
        status: 302,
        headers: { "Location": "/auth/login" }
      });
    }    
  }
  isAuthenticated = true;
  return null;
}
