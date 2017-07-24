'use stricts'

function map() {
    
    var exports = {};
    var scope = this;
    
    scope.callback;
    
    scope.bounds;
    scope.map;
    scope.heatmapRed;
    scope.heatmapBlue;

//------------------------------------------------------------------------------------------------------------------    
    exports.initMap = function(div,callback){
        
        scope.callback = callback;  // adiciona o callback para mudança de bounds
        
        scope.map=new google.maps.Map(document.getElementById(div), {  // cria o mapa
          zoom: 12,
          center: {lat:40.7387967, lng: -73.977147},
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    
        scope.heatmapRed= new google.maps.visualization.HeatmapLayer({  // cria o heatmap vazio
            data: []
        });
        
        scope.heatmapBlue= new google.maps.visualization.HeatmapLayer({  // cria o heatmap vazio
            data: []
        });
        
        scope.map.addListener('bounds_changed',function(){  //cria um listener pro evento d mudança de bounds para poder chama o callback
            bounds = scope.map.getBounds();   // qnd esse evento ocorre o callback é chamado
            scope.callback(bounds);
        });
        
    }
    
        
    exports.setDatasetRed = function(dataset){  //atualiza os dados usados no heatmap, é sempre chamado em execucçao dos callbecks na main
        scope.heatmapRed.setMap(null);
        scope.heatmapRed = new google.maps.visualization.HeatmapLayer({
            data: dataset
        });
        scope.heatmapRed.set('radius',5);
        var gradient = ['rgba(255,140,140,0)',
                        'rgba(255,120,120,1)',
                        'rgba(255,100,100,1)',
                        'rgba(255,80,80,1)',
                        'rgba(255,60,60,1)',
                        'rgba(255,40,40,1)',
                        'rgba(255,20,20,1)',
                        'rgba(255,0,0,1)'];
        scope.heatmapRed.set('gradient',gradient);
        scope.heatmapRed.setMap(scope.map);
    }
    
    
    exports.setDatasetBlue = function(dataset){  //atualiza os dados usados no heatmap, é sempre chamado em execucçao dos callbecks na main
        scope.heatmapBlue.setMap(null);
        scope.heatmapBlue = new google.maps.visualization.HeatmapLayer({
            data: dataset
        });
        scope.heatmapBlue.set('radius',5);
        var gradient = ['rgba(140,140,255,0)',
                        'rgba(120,120,255,1)',
                        'rgba(100,100,255,1)',
                        'rgba(80,80,255,1)',
                        'rgba(60,60,255,1)',
                        'rgba(40,40,255,1)',
                        'rgba(20,20,255,1)',
                        'rgba(0,0,255,1)'];
        scope.heatmapBlue.set('gradient',gradient);
        scope.heatmapBlue.setMap(scope.map);
    }
    
   return exports;
};