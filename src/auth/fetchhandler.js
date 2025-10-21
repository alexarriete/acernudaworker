import {authMiddleware, isValidIssuer} from "./login"
import {getLayout} from '../layout'
import { insertFragmentById } from '../utils/inserter';



export async function fetchHandler(request) {
  const url = new URL(request.url);

  // Middleware de auth
  const authResponse = await authMiddleware(request, url);
  if (authResponse) return authResponse;  
  // Middleware de rutas protegidas
  const protectedResponse = await protectedMiddleware(request, url);
  if (protectedResponse ===1) return new Response(null, {status: 302, headers: { "Location": "/auth/login" }});
  
  let layout = protectedResponse !== 0 ? await getLayout(request): "";
  //Require layout and is uthenticated
  if(protectedResponse== 2){          
      layout = layout.replace("auth/login", "perfil");
      layout = layout.replace('"login"', "nombre de usuario");    
  }
  
  // Ruta pública
  if(layout.indexOf('layoutcontent')>0){
     layout =  await insertFragmentById(layout, 'layoutcontent', "not found")
     return new Response(layout, { headers: { "Content-Type": "text/html", status:404 } });
  }
  return new Response(layout, { headers: { "Content-Type": "text/html" } });  
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
  if (requiresLayout(url)) {
     return validToken(request)? 1:2;
    } 
    
  return 0;
}

function requiresLayout( url){
  const authPaths = ["nota"];  

  const pathSegments = url.pathname
                          .split('/')
                          .filter(segment => segment.length > 0);

  if (pathSegments.length > 0) {
    const primerSegmento = pathSegments[0];     
    if (authPaths.includes(primerSegmento)) {
      return false;
    }
  }
  return true;  
}

function validToken(request){
  const cookie = request.headers.get("Cookie") || "";
    const match = cookie.match(/id_token=([^;]+)/);
    if (!match) return false;

    const token = match[1];
    const payload = parseJwt(token);
    if (!payload || !isValidIssuer(payload.iss) ) return false;            
    

    // Verificar expiración
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now && url.pathname.startsWith("/auth")) return false;
}