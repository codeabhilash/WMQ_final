
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmOTdjNjU4NC03OTc0LTQyNDUtYTNmYy0wYTBmMDQyODBmOTQiLCJpZCI6MzM5MjcsImlhdCI6MTU5OTUzMTA1N30.iYADanQufMrxOBifl4LwPJyQDMhjhnGrwJJWR3FCdto";

var view3D = new Cesium.Viewer("view3D");
view3D._cesiumWidget._creditContainer.style.display = "none";

var tileset = view3D.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(mesh_id),
  })
);

var splide = null;
  
    view3D.selectedEntityChanged.addEventListener(function (entity) {
      if (Cesium.defined(entity)) {
        var geocacheEntities = view3D.dataSources.get(0).entities.values;
  
        for (var i = 0; i < geocacheEntities.length; i++) {
          if (entity.id == geocacheEntities[i].id) splide.go(i);
        }
      }
    });

function addToolbarMenu(options, toolbarID) 
{
       var defaultAction;
      var menu = document.createElement("select");
      menu.className = "cesium-button";
      menu.onchange = function () 
      {
        reset();
        var item = options[menu.selectedIndex];
        if (item && typeof item.onselect === "function") 
        {
          item.onselect();
        }
      };
      document.getElementById(toolbarID || "toolbar").appendChild(menu);

      if (!defaultAction && typeof options[0].onselect === "function") {
        defaultAction = options[0].onselect;
      }

      for (var i = 0, len = options.length; i < len; ++i) {
        var option = document.createElement("option");
        option.textContent = options[i].text;
        option.value = options[i].value;
        menu.appendChild(option);
      }
}


function zoom(view3D) {

    tileset.readyPromise
    .then(function () {
      view3D.zoomTo(tileset);
  
      // Apply the default style if it exists
      var extras = tileset.asset.extras;
      if (
        Cesium.defined(extras) &&
        Cesium.defined(extras.ion) &&
        Cesium.defined(extras.ion.defaultStyle)
      ) {
        tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
      }
    })
    .otherwise(function (error) {
      console.log(error);
   });
  }
  
  zoom(view3D);





  var kmlOptions = {
    camera: view3D.scene.camera,
    canvas: view3D.scene.canvas,
  };
  
//   function add2D(viewer, assetid, show) {



//     var promise = Cesium.IonResource.fromAssetId(assetid)
//    .then(function (resource) {
//      return Cesium.KmlDataSource.load(resource, {
//        camera: viewer.scene.camera,
//        canvas: viewer.scene.canvas,
//      });
//    })
//    .then(function (dataSource) {
//      return viewer.dataSources.add(dataSource);
//    })
//    .then(function (dataSource) {
//      return viewer.zoomTo(dataSource);
//    })
//    .otherwise(function (error) {
//      console.log(error);
//    });
//    promise.show = false;

 


// }

function add2D(viewer, assetid, show) {
  const domparser = new DOMParser();
  var doc = null;

  Cesium.IonResource.fromAssetId(assetid)
    .then(function (resource) {
      return Cesium.KmlDataSource.load(resource, kmlOptions);
    })
    .then(function (dataSource) {
      viewer.dataSources.add(dataSource);
      viewer.zoomTo(dataSource);

              var geocacheEntities = dataSource.entities.values;

    })
    .otherwise(function (error) {
      console.log(error);
    });
}

function addFlightPath(viewer, colore=Cesium.Color.RED.withAlpha(0)) {
 

 
 viewer.entities.removeAll();
 const fligghtData = JSON.parse(
 '[{"longitude": 130.4439719, "latitude": 33.36309, "height": 81.028}, {"longitude": 130.4439832, "latitude": 33.3631007, "height": 81.147}, {"longitude": 130.4439615, "latitude": 33.3630785, "height": 80.991}, {"longitude": 130.444038, "latitude": 33.3631288, "height": 81.063}, {"longitude": 130.4439478, "latitude": 33.36307, "height": 81.035}, {"longitude": 130.4440443, "latitude": 33.3631304, "height": 81.147}, {"longitude": 130.443915, "latitude": 33.3630482, "height": 81.047}, {"longitude": 130.4439972, "latitude": 33.3631083, "height": 81.12}, {"longitude": 130.4439381, "latitude": 33.3630632, "height": 81.11}, {"longitude": 130.4440203, "latitude": 33.3631215, "height": 81.063}, {"longitude": 130.4440111, "latitude": 33.3631156, "height": 81.054}, {"longitude": 130.4439266, "latitude": 33.3630554, "height": 81.116}, {"longitude": 130.4440473, "latitude": 33.3631324, "height": 81.113}, {"longitude": 130.4440478, "latitude": 33.3631326, "height": 81.118}, {"longitude": 130.4440302, "latitude": 33.363125, "height": 81.046}]'
 );

const flightData = fl_id;

 let colors = [Cesium.Color.RED.withAlpha(0), Cesium.Color.YELLOW, Cesium.Color.RED, Cesium.Color.WHITE, Cesium.Color.GREEN];
 const timeStepInSeconds = 30;
 const totalSeconds = timeStepInSeconds * (flightData.length - 1);
 const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
 const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
 viewer.clock.startTime = start.clone();
 viewer.clock.stopTime = stop.clone();
 viewer.clock.currentTime = start.clone();
 viewer.timeline.zoomTo(start, stop);
 viewer.clock.multiplier = 100;
 viewer.clock.shouldAnimate = false;

 const positionProperty = new Cesium.SampledPositionProperty();

 for (let i = 0; i < flightData.length; i++) {
   const dataPoint = flightData[i];

   const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
   const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
   positionProperty.addSample(time, position);


 }

 const airplaneEntity = viewer.entities.add({
   availability: new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: start, stop: stop }) ]),
   position: positionProperty,
   point: { pixelSize: 1, color: Cesium.Color.YELLOW },
   path: new Cesium.PathGraphics({ width: 5, material : colore })
 });
 viewer.trackedEntity = airplaneEntity;
 return viewer.trackedEntity;

}

var viewer3D = true;
var viewer2D = false;

var defect = 0;
// var assetid = [274043, 274046, 274034, 274037];
var assetid = [im_id, def_id];
var colors = [Cesium.Color.YELLOW, Cesium.Color.BLUE, Cesium.Color.RED, Cesium.Color.GREEN];
document.getElementById("3DAdjust").style.display = "block";
document.getElementById("3DAdjust").style.padding = "10px 10px 30px 10px";
document.getElementById("toolbar").style.padding = "20px 20px 20px 20px";



addToolbarMenu([
 {
   text: "view3D",
   onselect: function () {
     document.getElementById("3DAdjust").style.display = "block";
     view3D.entities.removeAll();
     tileset.show = true;
     viewer3D = true;
     viewer2D = false;
     zoom(view3D);

   }
 },
 {
   text: "view2D",
   onselect: function () {
     document.getElementById("3DAdjust").style.display = "none";
     add2D(view3D, assetid[defect], true);
     tileset.show = false;
     var flight = addFlightPath(view3D, colors[defect]);
     viewer3D = false;
     viewer2D = true;

   },
 },
 {
   text: "viewBoth",
   onselect: function () {
     document.getElementById("3DAdjust").style.display = "block";
     add2D(view3D, assetid[defect], true);
     tileset.show = true;
     var flight = addFlightPath(view3D, colors[defect]);
     zoom(view3D);
     viewer3D = true;
     viewer2D = true;
     flight.show = true;

  },
 },

]);



addToolbarMenu([
 {
   text: "just images",
   onselect: function () {
     defect = 0;
     if (viewer2D !== false) {
       add2D(view3D, assetid[defect], true);
       var flight = addFlightPath(view3D, Cesium.Color.YELLOW);
       flight.show = true;
     
     }
   },
 },
 {
   text: "rust",
   onselect: function () {
     defect = 1;
     if (viewer2D !== false) {

        add2D(view3D, assetid[defect], true);
       var flight = addFlightPath(view3D, Cesium.Color.BLUE);
       flight.show = true;
     }
   },
 },
//  {
//    text: "crack",
//    onselect: function () {
//      defect = 2;
//      if (viewer2D !== false) {

//        add2D(view3D, 399578, true);
//        var flight = addFlightPath(view3D, Cesium.Color.RED);
//        flight.show = true;
//      }
//    },

//  },
//  {
//    text: "combined_defect",
//    onselect: function () {
//      defect = 3;
//      if (viewer2D !== false) {

//        add2D(view3D, 274037, true);
//        var flight = addFlightPath(view3D, Cesium.Color.GREEN);
//        flight.show = true;
//      }
//   },
//  },

]);

reset = function () {
 view3D.dataSources.removeAll();
 view3D.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
 view3D.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
};





view3D.scene.globe.depthTestAgainstTerrain = true;

var viewModel = {
 height: 0,
 latitude: 0,
 longitude: 0,
};

Cesium.knockout.track(viewModel);

var toolbar = document.getElementById("toolbar");
Cesium.knockout.applyBindings(viewModel, toolbar);




tileset.readyPromise
 .then(function () {
   view3D.zoomTo(tileset);

   // Apply the default style if it exists
   var extras = tileset.asset.extras;
   if (
     Cesium.defined(extras) &&
     Cesium.defined(extras.ion) &&
     Cesium.defined(extras.ion.defaultStyle)
   ) {
     tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
   }
 })
 .otherwise(function (error) {
   console.log(error);
 });


Cesium.knockout
 .getObservable(viewModel, "height")
 .subscribe(function (height) {
   height = Number(height);
   if (isNaN(height)) {
     return;
   }

   var cartographic = Cesium.Cartographic.fromCartesian(
     tileset.boundingSphere.center
   );
   var surface = Cesium.Cartesian3.fromRadians(
     cartographic.longitude,
     cartographic.latitude,
     0.0
   );
   var offset = Cesium.Cartesian3.fromRadians(
     cartographic.longitude + Number(document.getElementById('lo').value)*0.0000002,
     cartographic.latitude + Number(document.getElementById('la').value)*0.0000002,
     height
   );
   var translation = Cesium.Cartesian3.subtract(
     offset,
     surface,
     new Cesium.Cartesian3()
   );
   tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
 });



Cesium.knockout
 .getObservable(viewModel, "latitude")
 .subscribe(function (latitude) {
   latitude = Number(latitude);
   if (isNaN(latitude)) {
     return;
   }

   var cartographic = Cesium.Cartographic.fromCartesian(
     tileset.boundingSphere.center
   );
   var surface = Cesium.Cartesian3.fromRadians(
     cartographic.longitude,
     cartographic.latitude,
     0.0
   );
   var offset = Cesium.Cartesian3.fromRadians(
     cartographic.longitude + Number(document.getElementById('lo').value)*0.0000002,
     cartographic.latitude + latitude*0.0000002,
     Number(document.getElementById('h').value)
   );
   var translation = Cesium.Cartesian3.subtract(
     offset,
     surface,
     new Cesium.Cartesian3()
   );
   tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
 });

Cesium.knockout
 .getObservable(viewModel, "longitude")
 .subscribe(function (longitude) {
   longitude = Number(longitude);
   if (isNaN(longitude)) {
     return;
   }

   var cartographic = Cesium.Cartographic.fromCartesian(
     tileset.boundingSphere.center
   );
   var surface = Cesium.Cartesian3.fromRadians(
     cartographic.longitude,
     cartographic.latitude,
     0.0
   );
   var offset = Cesium.Cartesian3.fromRadians(
     cartographic.longitude + longitude*0.0000002,
     cartographic.latitude + Number(document.getElementById('la').value)*0.0000002,
     Number(document.getElementById('h').value)
   );
   var translation = Cesium.Cartesian3.subtract(
     offset,
     surface,
     new Cesium.Cartesian3()
   );
   tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
 });


reset = function () {
  view3D.dataSources.removeAll();
  view3D.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
  view3D.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
};