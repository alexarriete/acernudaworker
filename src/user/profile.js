
//Authorized
export function getProfile(user) {
         if(user ===null || user === undefined){
        return "<p class='center-screen'>No tiene permisos para ver esta página</p>";
    }
    let html = ` 
        
<div class="row center-screen">
    <div class="notice col-lg-3 col-md-6 col-xs-12" style="margin:1%;cursor:pointer;height:fit-content" >
          <div class="card" style="border:none;">
              <div class="card-body">
                  <h5 class="card-title text-center">Nueva nota</h5>                                      
                  <p class="card-text" style="color:darkgray" >Publique una nueva nota</p>                   
                  <a href="new" class="btn btn-outline-success"><span style="font-size:14px;color:red;">Nueva nota</span></a>            
              </div> 
          </div>
    </div>
    <div class="notice col-lg-3 col-md-6 col-xs-12" style="margin:1%;cursor:pointer;height:fit-content" >
          <div class="card" style="border:none;">
              <div class="card-body">
                  <h5 class="card-title text-center">Cerrar sesión</h5>                                      
                  <p class="card-text" style="color:darkgray" >Considere cerrar la sesión por seguridad</p>                   
                  <a href="logout" class="btn btn-outline-success"> Salir</a>
              </div> 
          </div>
    </div>      
</div>
  <hr />
   `;
       return html; 
    }