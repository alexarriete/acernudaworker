import {authMiddleware, logout} from "./user/auth/login"
import {getLayout, insertMainContent} from './layout'
import { insertFragmentById } from './utils/inserter';
import {getCurrentUser, validToken} from "./user/auth/currentuser";
import {getFirstSlice} from "./utils/urlHelper";
import {getProfile} from "./user/profile";


export async function fetchHandler(env, request) {
  const url = new URL(request.url);
  
  const authResponse = await authMiddleware(request, url);
  if (authResponse) return authResponse;  
  const firstSlice = getFirstSlice(request).toLocaleLowerCase();
  
  const user = await getCurrentUser(env, request)
  let layout =await getLayout(request, user);  
  
  let html = "";
  if(firstSlice === "perfil")
    html = getProfile(user);
  if (firstSlice === 'logout') {
      return logout(request);
    }

  
  
  
  if(html === "" || html === null) html = "not found";
  layout = await insertMainContent(layout, html);
  

  return new Response(layout, { headers: { "Content-Type": "text/html" } });  
}




