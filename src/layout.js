export function getLayout(request){
    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Algunas notas tomadas al vuelo" />
      <meta name="author" content="Alejandro Cernuda" />
      <meta name="robots" content="noindex, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
      <!-- Open Graph -->
      <meta property="og:type" content="article" />
      <meta property="og:title" content="aCernuda.com" />
      <meta property="og:description" content="Algunas notas tomadas al vuelo" />
      <meta property="og:image" content="https://res.cloudinary.com/cernuda/image/upload/v1684602861/notas-baudelaire.jpg" />
      <meta property="og:image:alt" content="Las flores del mal. Charles Baudelaire" />
      <meta property="og:image:width" content="1199" />
      <meta property="og:image:height" content="655" />
      <meta property="og:url" content="$origin$" />
    
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@alej_cernuda" />
      <meta name="twitter:title" content="aCernuda.com" />
      <meta name="twitter:description" content="Algunas notas tomadas al vuelo" />
      <meta name="twitter:image" content="https://res.cloudinary.com/cernuda/image/upload/v1684602861/notas-baudelaire.jpg" />
      <meta name="twitter:url" content="$origin$" />
    
      <title>aCernuda.com</title>
    
      <!-- CSS -->
      <link rel="preload" href="https://static-udl.pages.dev/fonts/montserrat-v30-latin-regular.woff2" as="font" type="font/woff2" crossorigin>
      <link rel="preload" href="https://static-udl.pages.dev/css/bootstrap.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
      <noscript>
       <link rel="stylesheet" href="https://static-udl.pages.dev/css/bootstrap.min.css">
      </noscript>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      <link rel="stylesheet" href="https://acernuda.com/css/notestyles.css" />
      <link rel="icon" href="https://acernuda.com/images/favicon.ico" type="image/x-icon" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
    </head>
    
    <body>
      <nav class="navbar navbar-expand-lg" style="background-color:black;" role="navigation" aria-label="Menú principal">
        <div class="container-fluid">
          <a class="navbar-brand" href="$origin$" title="Inicio">Notas</a>
          <a class="nav-link" href="https://nota.acernuda.com/map" title="Mapa">Mapa</a>
    
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
            aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
    
          <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
            <ul class="navbar-nav mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" href="$searchUrl$" title="Buscar"><i class="bi bi-search"></i></a>
              </li>              
              <li class="nav-item">
                <a class="nav-link" href="auth/login" title="login" >
                  <i class="bi bi-person"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    
      <main class="container mt-4">
        <div id="messagelayout"></div>        
        <div id="layoutcontent"></div>        
      </main>
    
      <footer>
        <iframe title="Pie de página y enlaces" src="https://acernuda.com/footer.html" width="100%" height="200" style="border: none; overflow: hidden;" loading="lazy"></iframe>
      </footer>
    
      <!-- JavaScript -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" defer></script>
      <script src="https://acernuda.com/js/JavaHelper.js" defer></script>            
    </body>
    </html>
    
    `
    const url = new URL(request.url);                
    const hostName = url.hostname;
    html = html.replaceAll("$origin$",hostName);
    return html;
}