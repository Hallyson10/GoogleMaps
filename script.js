var map,searchBox,geocoder ;
var marker = null;
var input_search = document.getElementById('search'); //input que recebe o nome da cidade ou rua
var input_number_residency = document.getElementById('input-numero'); //input que recebe o número da localização


//função que instancia o mapa
function createMap () {
    var options = {
      center: new google.maps.LatLng(38.50, -90.50),
      zoom: 15,
      draggable: true,
      gestureHandling: 'greedy',
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true,
    };  
    map = new google.maps.Map(document.getElementById('map'), options);//inicializando mapa
    searchBox = new google.maps.places.SearchBox(input_search); //pesquisando os endereços na api

    map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
    });
    //listener chamado quando move clica no mouse e move o mapa
    map.addListener('mouseup', function() {
      var coord_center = map.getCenter()
      geocodeLatLng(coord_center);
      insertMarkerInMap(coord_center);//mostra o marker
    });
    
    verifyAddress();// função onde contém o listener do input de pesquisa dos endereços
    geocoder = new google.maps.Geocoder();
}  

//busca o endereço pelas coordenadas
function geocodeLatLng(coord) {
  geocoder.geocode({'location': coord}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        alert(JSON.stringify(results[0].formatted_address))
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

//verifica endereço selecionado e insere o marker no mapa
function verifyAddress(){
    searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) return;

    var bounds = new google.maps.LatLngBounds();
    //listando endereços
    places.forEach(function(p) {
          if (!p.geometry)
          return;
          console.log(p)
          //verifica se o texto da busca é um endereço completo com número
          if(p.types[0] !== "street_address"){
          alert('por favor insira o número da rua')

          }else{
          try {
          insertMarkerInMap(p.geometry.location); //mostrando o marker
          if (p.geometry.viewport)
            bounds.union(p.geometry.viewport);
          else
            bounds.extend(p.geometry.location);
            map.fitBounds(bounds);
          } catch (error) {
            console.log(error)
          }
        }
       
    });
  });
}

//função chamada quando o número não é inserido junto com o nome da rua, busca a longitude e latitude e insere o marker
function searchLocaleWithNumber(){
          var address = input_search.value + input_number_residency.value;//address : nome da rua + numero da rua
          geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == 'OK') {
            //results[0].geometry.location = coordenadas do endereço inserido
          insertMarkerInMap(results[0].geometry.location);//inserindo o marker no mapa
          } else {
          alert('Geocode was not successful for the following reason: ' + status);
          }
          });
}

//função reponsavel por inserir o marker no mapa
function insertMarkerInMap(position){
    document.getElementById('insertMarkerInMap').style.display = 'inline-block';
    map.setCenter(position);
    map.addListener('zoom_changed',function(){
      map.panTo(position);
    }) 
}