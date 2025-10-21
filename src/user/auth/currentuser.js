import {b2cValues} from "../../utils/constant";
import {getFirstSlice} from "../../utils/urlHelper";

export function validToken(request){
  const cookie = request.headers.get("Cookie") || "";
    const match = cookie.match(/id_token=([^;]+)/);    
    if (!match) return "";

    const token = match[1];
    const payload = parseJwt(token);
    if (!payload || !isValidIssuer(payload.iss) ) return "";            
    

    // Verificar expiración
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now && url.pathname.startsWith("/auth")) return "";    
    return token;
}

// export async function requiresCurrentUser( env, request){
//   const authPaths = ["notas", "perfil"];    
//     const primerSegmento = getFirstSlice(request);         
//     if (authPaths.includes(primerSegmento)) {      
//     }         
//   return null;  
// }


export async function getCurrentUser(env, request){   
    const token = validToken(request); 
    if(token ==="" || token === null)   
        return null;

     return await handleAuthToken(env, token);
  }

  export function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

  export async function handleAuthToken(env,token){
    
    if(token !== null){     
      const objs = parseJwt(token);
      const auth ={id: objs.sub, email:objs.emails[0], role:objs.jobTitle, name:objs.given_name, fullname: objs.name};           
      return auth;
    }
    return null;
  }


  function getDatePlusAMonth(exp) {
    let dt = new Date(0);
    dt.setUTCSeconds(exp);
    let no_of_months = 1;
    dt.setMonth(dt.getMonth() + no_of_months)
    return dt;
 }

 function isValidIssuer(iss){
    console.log(iss);
    return iss === `https://${b2cValues.tenantName}.b2clogin.com/${b2cValues.tenantId}/v2.0/`;
}