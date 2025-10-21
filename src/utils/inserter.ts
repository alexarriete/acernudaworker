// Archivo: src/utils/inserter.ts

/**
 * Modifica una cadena de HTML, buscando un elemento por su ID e insertando 
 * otro fragmento de HTML dentro de él (al final).
 * * @param htmlContent El contenido HTML original (como string).
 * @param targetId El valor del atributo 'id' del div que se quiere modificar.
 * @param fragment El fragmento de HTML a insertar.
 * @returns Una Promesa que resuelve en la cadena de HTML modificada.
 */
export async function insertFragmentById(
    htmlContent: string,
    targetId: string,
    fragment: string
): Promise<string> {
    
    // 1. Crear una instancia de HTMLRewriter
    const rewriter = new HTMLRewriter();
    
    // Bandera para saber si se encontró el elemento
    let found = false;

    // 2. Definir un manipulador (handler) para el elemento
    const handler = {
        element(element: any) {
            // Verifica si el ID del elemento coincide con el ID objetivo
            if (element.getAttribute('id') === targetId) {
                // Si el ID coincide, inserta el fragmento de HTML al final del div
                element.append(fragment, { html: true });
                found = true;
            }
        }
    };
    
    // 3. Aplicar el manipulador a todos los selectores de ID (#targetId)
    // Aunque el handler solo necesita el selector 'div', es más eficiente en HTMLRewriter
    // usar un selector más específico si es posible.
    
    const rewriterInstance = rewriter.on(`#${targetId}`, handler);

    // 4. Aplicar la reescritura al contenido. 
    // HTMLRewriter trabaja con Streams, por lo que convertimos la cadena de entrada en un ReadableStream
    // y la salida la guardamos en un Response.
    
    const input = new Response(htmlContent);
    const output = rewriterInstance.transform(input);
    
    // 5. Devolver el texto completo del resultado
    return output.text();
}