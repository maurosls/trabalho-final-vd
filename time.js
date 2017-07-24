'use strict'

function timeSeries(){
    
    var scope = this;
    var exports = {};
    
    scope.datasetRed = null;
    scope.pathDataRed = null;
    
    scope.datasetBlue = null;
    scope.pathDataBlue = null;
    
    scope.callback=null;
    scope.interval=null;
    
    scope.svg=null;
    scope.chartGroup = null;
    
    scope.chartWidth = 600;
    scope.chartHeight = 300;
    scope.margin={top : 50, bottom : 50, left : 50, right : 100, spacing:50};
    
    scope.xScale=null;
    scope.nScaleX=null;
    scope.yScale=null;
    scope.nScaleY=null;
    scope.xAxis=null;
    scope.yAxis=null;
    scope.xAxisGroup = null;
    scope.yAxisGroup = null;
    
    scope.maxCont = 0;
    
    scope.zoom=null;
    
//------------------------------------------------------------------------------------------------
//metodo q cria o conjunto d dados q é d fato usado pelo 
exports.setMaxCont = function(max){
    scope.maxCont = max;
}
scope.updateYAxis = function () {

    scope.nScaleY = d3.scaleLinear().domain([0,scope.maxCont]).range([scope.chartHeight,0]);
    scope.yAxis.scale(scope.nScaleY);
    scope.yAxisGroup.call(scope.yAxis);

}  
    
scope.appendPathRed = function(){
    
    var tran = d3.transition().duration(700);
    
    var lineFunction = d3.line()
                .x(function(d) { 
                    return scope.nScaleX(d.date); })
                .y(function(d) { 
                    return scope.nScaleY(d.cont); });
          
    
    if(scope.pathDataRed.length==1){
        var path = scope.chartGroup.selectAll('.pathRed').data([]); 
        var circle =scope.chartGroup.selectAll('.circleRed').data(scope.pathDataRed);
        
        path.exit()
            .transition(tran)
            .remove(); 
        
        circle.enter()
        .append('circle')
        .transition(tran)
        .attr('cx', function(d){ return scope.nScaleX(d.date); })
        .attr('cy', function(d){ return scope.nScaleY(d.cont); })
        .attr('r' , 2 )
        .attr('class','circleRed')
        .style('fill', 'red');
        
        circle
        .transition(tran)
        .attr('cx', function(d){ return scope.nScaleX(d.date); })
        .attr('cy', function(d){ return scope.nScaleY(d.cont); })
        .style('fill', 'blue');
    }else{
        var path = scope.chartGroup.selectAll('.pathRed').data(scope.pathDataRed); 
        var circle =scope.chartGroup.selectAll('.circleRed').data([]);
        path.enter()
            .append('path')
            .transition(tran)
            .attr('d', lineFunction(scope.pathDataRed))
            .attr('class','pathRed')
            .attr('stroke', 'red')
            .attr('fill','none');
 
    path.transition(tran)
            .attr('d', lineFunction(scope.pathDataRed))
            .attr('stroke', 'red')
            .attr('fill','none');
   
    path.exit()
            .transition(tran)
            .remove();   
        
        circle.exit()
        .transition(tran)
        .remove();   
    }    
     
} 

scope.appendPathBlue = function(){
    
    var tran = d3.transition().duration(700);
    
    var lineFunction = d3.line()
                .x(function(d) { 
                    return scope.nScaleX(d.date); })
                .y(function(d) { 
                    return scope.nScaleY(d.cont); });
          
    if(scope.pathDataBlue.length==1){
        var path = scope.chartGroup.selectAll('.pathBlue').data([]); 
        var circle =scope.chartGroup.selectAll('.circleBlue').data(scope.pathDataBlue);
        
        path.exit()
            .transition(tran)
            .remove(); 
        
        circle.enter()
        .append('circle')
        .transition(tran)
        .attr('cx', function(d){ return scope.nScaleX(d.date); })
        .attr('cy', function(d){ return scope.nScaleY(d.cont); })
        .attr('r' , 2 )
        .attr('class','circleBlue')
        .style('fill', 'blue');
        
        circle
        .transition(tran)
        .attr('cx', function(d){ return scope.nScaleX(d.date); })
        .attr('cy', function(d){ return scope.nScaleY(d.cont); })
        .style('fill', 'blue');
    }else{
        var path = scope.chartGroup.selectAll('.pathBlue').data(scope.pathDataBlue); 
        var circle =scope.chartGroup.selectAll('.circleBlue').data([]);
        path.enter()
            .append('path')
            .attr('d', lineFunction(scope.pathDataBlue))
            .attr('class','pathBlue')
            .attr('stroke', 'blue')
            .attr('fill','none');
 
    path.transition(tran)
            .attr('d', lineFunction(scope.pathDataBlue))
            .attr('stroke', 'Blue')
            .attr('fill','none');
   
    path.exit()
            .transition(tran)
            .remove();   
        
        circle.exit()
        .transition(tran)
        .remove();   
    }  
    
     
}   

scope.appendSVG = function (div) {
    var svg = d3.select(div).append('svg')
            .attr('width', scope.margin.left + scope.chartWidth + scope.margin.right)
            .attr('height', scope.chartHeight + scope.margin.top + scope.margin.bottom);
    scope.svg = svg;
    
    scope.svg.append('text')
        .text('Data X N Ocorrencia')
        .attr('text-anchor', 'middle')
        .attr('font-size',25)
        .attr('x',scope.margin.left+scope.chartWidth/2)
        .attr('y',scope.margin.top/2);
    
    
    
    scope.svg.append('text')
        .text('Data')
        .attr('text-anchor', 'middle')
        .attr('x',scope.margin.left+scope.chartWidth/2)
        .attr('y',scope.margin.top+scope.chartHeight+scope.margin.bottom*0.7);
    
    scope.svg.append('text')
        .text('N Ocorrencias')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x',-(scope.margin.top+scope.chartHeight/2))
        .attr('y',scope.margin.left/3);
}

scope.appendChartGroup = function () {
    var chart = scope.svg.append('svg')
        .attr('class','chartGroup')
        .attr('width', scope.chartWidth)
        .attr('height', scope.chartHeight)
        .attr('x', scope.margin.left)
        .attr('y', scope.margin.top);
    scope.chartGroup = chart;
}

scope.appendAxis = function(){
    scope.xScale = d3.scaleTime().domain([scope.interval[0],scope.interval[1]]).range([0,scope.chartWidth]);
    scope.yScale = d3.scaleLinear().domain([0,10]).range([scope.chartHeight,0]);

    scope.xAxisGroup = scope.svg.append('g')
        .attr('class','xAxis')
        .attr('transform','translate('+scope.margin.left+','+(scope.margin.top+scope.chartHeight)+')');

    scope.yAxisGroup = scope.svg.append('g')
        .attr('class','yAxis')
        .attr('transform','translate('+scope.margin.left+','+scope.margin.top+')');    
    
    scope.xAxis = d3.axisBottom(scope.xScale).tickFormat(d3.timeFormat("%d-%m-%y")).ticks(5);
    scope.yAxis = d3.axisLeft(scope.yScale).tickFormat(d3.format(".0f")).ticks(5);
    
    scope.xAxisGroup.call(scope.xAxis);
    scope.yAxisGroup.call(scope.yAxis);
}

scope.addZoom = function(){
    function zoomed()
    {   var t = d3.event.transform;
        
        scope.nScaleX = t.rescaleX(scope.xScale);
        scope.xAxis.scale(scope.nScaleX);
        scope.xAxisGroup.call(scope.xAxis);
        
        scope.interval = [scope.nScaleX.invert(0),scope.nScaleX.invert(scope.chartWidth)];
     

        scope.callback(scope.interval);
    }
        scope.nScaleX = scope.xScale;
        scope.nScaleY = scope.yScale;
        scope.zoom = d3.zoom()
        .on("zoom", zoomed);

        scope.chartGroup.append("rect")
        .attr("class", "zoom")
        .attr("width", scope.chartWidth)
        .attr("height", scope.chartHeight)
        .attr('fill','rgba(0,0,0,0)')
        .call(scope.zoom);   
}

exports.setDatasetRed = function(dataset){
    scope.pathDataRed = dataset;
    scope.updateYAxis();
    scope.appendPathRed();
}

exports.setDatasetBlue = function(dataset){
    scope.pathDataBlue = dataset;
    //scope.updateYAxis();
    scope.appendPathBlue();
}

exports.initTime = function(div,callback,interval){
    scope.appendSVG(div);
    scope.appendChartGroup();
    scope.callback = callback;
    scope.interval = interval;
    scope.appendAxis();
    scope.addZoom();
}

return exports;
};
