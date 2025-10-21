
export function buildResponse(data: string, status: number): Response {
    return new Response(data, {
        headers: { 'Content-Type': 'text/plain' },
        status: status,
    });
}