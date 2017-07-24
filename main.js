'use strict';

var main = this;

main.dataset=[];
main.mapData=[];
main.timeData=[];
main.mapChart;
main.timeChart;

main.bounds;
main.interval;
main.intervalStarIndex;
main.optionsRed='00000000';
main.optionsBlue='00000000';

//-------------------------------------------------------------------------------------------------------------------------
main.init = function(){  //metodo que inicializa tudo. So é chamado qnd a API do google é carregada usando o boottrap
    main.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(40.6867497,-73.8913163),new google.maps.LatLng(40.7908029,-74.0629776)); 
    main.loadDataset();  //carrega o dataset inteiro
    if (main.dataset.length>0){
        main.interval=[main.dataset[0].date,main.dataset[main.dataset.length-1].date];
    }else{
        main.interval = [new Date('01/01/2017'),new Date('05/06/2017')];
    }
    main.timeChart = new timeSeries();
    main.timeChart.initTime('#timeDiv',main.callbackTime,main.interval);
    main.mapChart = new map(); //cria nova instancia d mapa
    main.mapChart.initMap('mapDiv',main.callbackMap);  // inicializa o mapa de fato 
}

main.callbackMap = function(bounds){ //callback que é enviado a instancia d mapa e executo por ele para reportar uma mudança de bounds
    main.bounds = bounds;
    main.updateDataset('map');
}

main.callbackTime = function(interval){ //callback que é enviado a instancia da timeseries executo por ele para reportar uma mudança de interval
    main.interval = interval;
    main.updateDataset('time');
}

main.callbackOptionsRed= function(){ //callback das options
    
    var checkBoxesRed = document.getElementsByClassName('optRedBox');
    var optionsRed = '';
    
    for(var i =0;i<checkBoxesRed.length;i++){
        if(checkBoxesRed[i].checked){
            optionsRed = optionsRed + '1';
        }else{
            optionsRed = optionsRed + '0';
        }
    }
    main.optionsRed = optionsRed;
    main.updateDataset('red');    
}

main.callbackOptionsBlue = function(){
        var checkBoxesBlue = document.getElementsByClassName('optBlueBox');
    var optionsBlue = '';
    
    for(var i =0;i<checkBoxesBlue.length;i++){
        if(checkBoxesBlue[i].checked){
            optionsBlue = optionsBlue + '1';
        }else{
            optionsBlue = optionsBlue + '0';
        }
    }
    main.optionsBlue = optionsBlue;
    main.updateDataset('blue');
    

}

main.compareOptions = function(data,color){
    var res = true;
    if (color == 'red'){
        for(var i =0;i<data.length;i++){
            if(data.charAt(i)=='0' && main.optionsRed.charAt(i)=='1'){
                res = false;
                break;
            }
        }
        
    }else if (color=='blue'){
        for(var i =0;i<data.length;i++){
            if(data.charAt(i)=='0' && main.optionsBlue.charAt(i)=='1'){
                res = false;
                break;
            }
        }
    }
    return res;
}

main.updateDataset = function(origin){ // metodo que atualiza o dataset baseado em bounds, interval e options
    var timeDataRed=[{date:new Date('01/01/2000'),cont:0}];
    var mapDataRed=[];
    var timeDataBlue=[{date:new Date('01/01/2000'),cont:0}];
    var mapDataBlue=[];
    var maxCont = 0;
    
    for(var i =0;i<dataset.length;i++){
        if (main.dataset[i].date.getTime >= main.interval[0].getTime && main.dataset[i].date.getTime<=main.interval[1].getTime){
            if(main.bounds.contains(dataset[i].latlong) && main.compareOptions(main.dataset[i].options,'red') &&
                        (origin == 'map' || origin =='time' ||origin=='red')){
                mapDataRed.push(dataset[i].latlong);
                
                if(i==0){
                    timeDataRed.push({date:main.dataset[i].date,cont:1});//////////////////////////////////
                    maxCont = Math.max(maxCont,1);
                }else if(i==dataset.length-1){
                    if(main.dataset[i].date.getTime()===timeDataRed[timeDataRed.length-1].date.getTime()){
                        timeDataRed[timeDataRed.length-1].cont++;
                        maxCont = Math.max(maxCont,timeDataRed[timeDataRed.length-1].cont);
                    }else{
                        timeDataRed.push({date:main.dataset[i].date,cont:1});////////////////////////////////
                        maxCont = Math.max(maxCont,1);
                    }  
                }else{
                    if(main.dataset[i].date.getTime() <= main.dataset[i-1].date.getTime() && main.dataset[i].date.getTime() >= main.dataset[i+1].date.getTime()){
                        if(main.dataset[i].date.getTime()===timeDataRed[timeDataRed.length-1].date.getTime()){
                            timeDataRed[timeDataRed.length-1].cont++;
                            maxCont = Math.max(maxCont,timeDataRed[timeDataRed.length-1].cont);
                        }else{
                            timeDataRed.push({date:main.dataset[i].date,cont:1}); ////////////////////////////////////////
                            maxCont = Math.max(maxCont,1);
                        }
                    }  
                }
            }
            if(main.bounds.contains(dataset[i].latlong) && main.compareOptions(main.dataset[i].options,'blue') &&
                        (origin == 'map' || origin =='time' ||origin=='blue')){mapDataBlue.push(dataset[i].latlong);
                
                if(i==0){
                    timeDataBlue.push({date:main.dataset[i].date,cont:1});//////////////////////////////////
                    maxCont = Math.max(maxCont,1);
                }else if(i==dataset.length-1){
                    if(main.dataset[i].date.getTime()===timeDataBlue[timeDataBlue.length-1].date.getTime()){
                        timeDataBlue[timeDataBlue.length-1].cont++;
                        maxCont = Math.max(maxCont,timeDataBlue[timeDataBlue.length-1].cont);
                    }else{
                        timeDataBlue.push({date:main.dataset[i].date,cont:1});////////////////////////////////
                        maxCont = Math.max(maxCont,1);
                    }  
                }else{
                    if(main.dataset[i].date.getTime() <= main.dataset[i-1].date.getTime() && main.dataset[i].date.getTime() >= main.dataset[i+1].date.getTime()){
                        if(main.dataset[i].date.getTime()===timeDataBlue[timeDataBlue.length-1].date.getTime()){
                            timeDataBlue[timeDataBlue.length-1].cont++;
                            maxCont = Math.max(maxCont,timeDataBlue[timeDataBlue.length-1].cont);
                        }else{
                            timeDataBlue.push({date:main.dataset[i].date,cont:1}); ////////////////////////////////////////
                            maxCont = Math.max(maxCont,1);
                        }
                    }  
                }
            }
        }else if(main.dataset[i].date>main.interval[1]){
            break;
        }
    }
    
    
    timeDataRed = timeDataRed.slice(1,timeDataRed.length);
    timeDataBlue = timeDataBlue.slice(1,timeDataBlue.length);
    main.timeChart.setMaxCont(maxCont);
    if(origin=='red'){
        main.mapChart.setDatasetRed(mapDataRed);
        main.timeChart.setDatasetRed(timeDataRed);
    }else if(origin =='blue'){
        main.mapChart.setDatasetBlue(mapDataBlue);
        main.timeChart.setDatasetBlue(timeDataBlue);
    }else{
        main.mapChart.setDatasetRed(mapDataRed);
        main.timeChart.setDatasetRed(timeDataRed);
        main.mapChart.setDatasetBlue(mapDataBlue);
        main.timeChart.setDatasetBlue(timeDataBlue);
    }
    
    
    
}

main.loadDataset = function(){ //dataset estruturado dessa forma MAS PODE MUDAR A PARTE D OPTIONS
//    main.dataset =[ {date:new Date('01/01/2016'),latlong: new google.maps.LatLng(40.7105042,-74.1961234),options:'001011'},
//                    {date:new Date('01/01/2016'),latlong: new google.maps.LatLng(40.7124224,-74.1624345),options:'101100'},
//                    {date:new Date('01/01/2016'),latlong: new google.maps.LatLng(40.8652242,-74.2432552),options:'101110'},
//                    {date:new Date('01/01/2016'),latlong: new google.maps.LatLng(40.6111342,-74.1244532),options:'001000'},
//                    {date:new Date('01/01/2016'),latlong: new google.maps.LatLng(40.7203179,-74.0121683),options:'101011'},
//                    {date:new Date('01/01/2016'),latlong: new google.maps.LatLng(40.7256734,-74.0057798),options:'000110'},
//                    {date:new Date('01/02/2016'),latlong: new google.maps.LatLng(40.7131354,-74.0040581),options:'101011'},
//                    {date:new Date('01/02/2016'),latlong: new google.maps.LatLng(40.7187947,-73.9890116),options:'111101'},
//                    {date:new Date('01/02/2016'),latlong: new google.maps.LatLng(40.7277455,-73.9912976),options:'101010'},
//                    {date:new Date('01/02/2016'),latlong: new google.maps.LatLng(40.7218863,-73.9773477),options:'101101'},
//                    {date:new Date('01/02/2016'),latlong: new google.maps.LatLng(40.7222418,-73.9862873),options:'110011'},
//                    {date:new Date('01/02/2016'),latlong: new google.maps.LatLng(40.7382552,-73.9996234),options:'001101'},
//                    {date:new Date('01/02/2016'),latlong: new google.maps.LatLng(40.7563515,-74.0054034),options:'000100'},
//                    {date:new Date('01/03/2016'),latlong: new google.maps.LatLng(40.7388307,-73.9831481),options:'011100'},
//                    {date:new Date('01/03/2016'),latlong: new google.maps.LatLng(40.7385305,-73.9917278),options:'101001'},
//                    {date:new Date('01/03/2016'),latlong: new google.maps.LatLng(40.7438808,-73.9815589),options:'001101'},
//                    {date:new Date('01/03/2016'),latlong: new google.maps.LatLng(40.7387967,-73.9771247),options:'001010'},
//                    {date:new Date('01/04/2016'),latlong: new google.maps.LatLng(40.7333357,-73.9831855),options:'011010'},
//                    {date:new Date('01/04/2016'),latlong: new google.maps.LatLng(40.7382519,-73.9856242),options:'000110'},
//                    {date:new Date('01/06/2016'),latlong: new google.maps.LatLng(40.7381471,-73.9776219),options:'011011'},
//                    {date:new Date('01/06/2016'),latlong: new google.maps.LatLng(40.7623963,-73.9786009),options:'001110'},
//                    {date:new Date('01/06/2016'),latlong: new google.maps.LatLng(40.7788219,-73.9537985),options:'011011'},
//                    {date:new Date('01/06/2016'),latlong: new google.maps.LatLng(40.7621793,-73.9661291),options:'011011'},
//                    {date:new Date('01/06/2016'),latlong: new google.maps.LatLng(40.7939814,-73.9722814),options:'010111'},
//                    {date:new Date('01/06/2016'),latlong: new google.maps.LatLng(40.8050573,-73.9390342),options:'011101'},
//                    {date:new Date('01/06/2016'),latlong: new google.maps.LatLng(40.8486847,-73.9392147),options:'010110'},
//                    {date:new Date('01/07/2016'),latlong: new google.maps.LatLng(40.8677669,-73.9259174),options:'011110'}];
    main.dataset=[];
    d3.csv("Data-2017.csv", function(data) {
        
		var datacsv = data;
		for (var i=0; i<datacsv.length;i++){
			
			var opt = "";
			if(datacsv[i].INJURED == 0){
				opt = opt + "0";
			} else{
				opt = opt + "1";
			}
			if(datacsv[i].KILLED == 0){
				opt = opt + "0";
			} else{
				opt = opt + "1";
			}
			if(datacsv[i].PED_INJURED == 0){
				opt = opt + "0";
			} else{
				opt = opt + "1";
			}
            if(datacsv[i].PED_KILLED == 0){
				opt = opt + "0";
			} else{
				opt = opt + "1";
			}
			if(datacsv[i].CYC_INJURED == 0){
				opt = opt + "0";
			} else{
				opt = opt + "1";
			}
            if(datacsv[i].CYC_KILLED == 0){
				opt = opt + "0";
			} else{
				opt = opt + "1";
			}
			if(datacsv[i].MOT_INJURED == 0){
				opt = opt + "0";
			} else{
				opt = opt + "1";
			}
            if(datacsv[i].MOT_KILLED == 0){
				opt = opt + "0";
			} else{
				opt = opt + "1";
			}            
			var latcsv = datacsv[i].LATITUDE;
            
			var loncsv = datacsv[i].LONGITUDE;

			var datecsv = datacsv[i].DATE;		

			var row = {date: new Date(datecsv), latlong: new google.maps.LatLng(latcsv, loncsv),options: opt};
			
			main.dataset.push(row);
        }
    });
}

