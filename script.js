var map,searchBox,geocoder ;
var marker = null;
var input_search = document.getElementById('search'); //input que recebe o nome da cidade ou rua
var input_numero_residencia = document.getElementById('input-numero'); //input que recebe o número da localização
var long_lat;

//função que instancia o mapa
function createMap () {
  var options = {
    center: { lat: 43.654, lng: -79.383 },
    zoom: 15,
  };
  map = new google.maps.Map(document.getElementById('map'), options);//inicializando mapa
  searchBox = new google.maps.places.SearchBox(input_search); //pesquisando o nome da cidade digitada na api

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
   
  verificaEndereco();// função onde contém o listener do input de pesquisa dos endereços
}  
//verifica endereço selecionado e insere o marker no mapa
function verificaEndereco(){
  
    searchBox.addListener('places_changed', function () {
      
    var places = searchBox.getPlaces();

    if (places.length == 0) return;

    var bounds = new google.maps.LatLngBounds();
    //listando endereços
    places.forEach(function(p) {
      if (!p.geometry)
        return;
        //verifica se o texto da busca está contido o número do endereço
        if(p.types[0] !== "street_address"){
          alert('por favor insira o número da rua')
        }else{
          try {
            long_lat = p.geometry.location;
            marker = new google.maps.Marker({
            map: map,
            position: long_lat,//lat e long pra salvar no banco
            animation: google.maps.Animation.DROP,
            title:'Sua localização',
            draggable: true,
          });
          ouvindoMovimentoMarker()
          if (p.geometry.viewport)
            bounds.union(p.geometry.viewport);
          else
            bounds.extend(p.geometry.location);
            map.fitBounds(bounds);
          } catch (error) {
            
          }
        }
       
    });
  });
}
//função chamada quando o número não é inserido junto com o nome da rua, busca a longitude e latitude e insere o marker
function buscaLocalizacaoEnderecoNumero(){
  long_lat = null;
  geocoder = new google.maps.Geocoder();
  //address : nome da rua + numero da rua
  var address = input_search.value + input_numero_residencia.value;

  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      long_lat = results[0].geometry.location;
      marker = new google.maps.Marker({
          map: map,
          position: long_lat,//lat e long pra salvar no banco
          animation: google.maps.Animation.DROP,
          title:'Sua localização',
          draggable: true,
      });
      map.setCenter(long_lat);
      ouvindoMovimentoMarker()
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function ouvindoMovimentoMarker(){
      //ouvindo o mover do marker
      google.maps.event.addListener(marker, 'dragend', function() 
      {
          alert(JSON.stringify(marker.getPosition()));
      });
}