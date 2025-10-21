// Archivo: src/index.ts


import {getLayout} from './layout.js'
import { fetchHandler } from "./fetchhandler";

const BASE_HTML = `
<!DOCTYPE html>
<html>
<head><title>Mi Página</title></head>
<body>
    <h1>Contenido Principal</h1>
    <div id="contenedor-principal">
        <p>Este párrafo ya existía.</p>
    </div>
    <div id="otro-div">No será modificado.</div>
</body>
</html>
`;

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        
        const response = await fetchHandler(env,request);        
        return response;
        // let layout = getLayout(request);
        // //layout = await insertFragmentById(layout, 'layoutcontent', modifiedHtml)



        // return new Response(layout, {
        //     headers: { 'Content-Type': 'text/html; charset=utf-8' }
        // });
    },
};