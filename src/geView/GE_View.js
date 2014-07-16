
/** 
 * A general-purpose Google Earth view created inside a div container.
 * The view also maintains caches of reused Kml objects to 
 * improve CPU and memory performance.
 * @constructor
 * @param {div element} container       The div element that will contain the 
 *      Google Earth view.
 * @param {object} optionalSettings     The json object representing optional settings 
 *      to load the Google Earth view. See the optionalSettings parameter in  
 *      https://developers.google.com/loader/#DetailedDocumentation.
 */
var GE_View = function(container, optionalSettings) {
  if(!optionalSettings) {
    optionalSettings = {};
  }
  
  this._containerID = container.id;
  this._container = container;
  this._optionalSettings = optionalSettings;
};


GE_View.prototype = {
  constructor: GE_View, 
  
  isaGE_View: true,
  
  _placemarks: {},
  
  _styles: {},
  
  _icons: {},
  
  //////// Initialization
  
  /** 
   * Attempts to create the Google Earth plugin instance and start the Google Earth view. 
   * @param {function} onInitHandler    Optional. A function that takes a  
   *      Google Earth plugin instance as an argument. This is called after the 
   *      plugin has been initialized.
   */
  start:function(onInitHandler) {
    var self = this;
    
    // Callback for when the plugin is successfully created.
    this.initCB = function(instance) {
      self._ge = instance;
      self._ge.getWindow().setVisibility(true);
      
      console.log("Google Earth plugin instance created!");
      console.log("Plugin version: " + instance.getPluginVersion());
      console.log("API version: " + instance.getApiVersion());
      
      // If we were provided a handler for additional initialization of the
      // view, run it.
      if(onInitHandler) {
        onInitHandler(instance);
      }
    };
    
    // Callback for when the plugin fails to be created.
    this.failCB = GE_View.defaultFailureCB;
    
    // Creates the plugin instance.
    var init = function() {
      self.reset();
    };
    
    // Append our google.load callback with a call to init.
    // This way, our Google Earth plugin will be created as soon as the API
    // finishes loading.
    if(this._optionalSettings.callback) {
      var origCB = this._optionalSettings.callback;
      
      this._optionalSettings.callback = function() {
        origCB();
        init();
      }
    }
    else {
      this._optionalSettings.callback = init;
    }
    
    // Load the Google Earth module.
    google.load("earth", "1", this._optionalSettings);
  },
  
  
  /** 
   * Resets the Google Earth view by creating a new plugin instance. 
   */
  reset:function() {
    google.earth.createInstance(this._containerID, this.initCB, this.failCB);
  },
  
  //////// Container
  
  /** 
   * Returns the ID of the view's container. 
   * @return {string}
   */
  getContainerID:function() {
    return this._containerID;
  },
  
  
  /** 
   * Returns the div element containing the view.
   * @return {div element}
   */
  getContainer:function() {
    return this._container;
  },
  
  
  //////// Plugin access
  
  /** 
   * Obtains the view's Google Earth plugin instance. 
   * @return {GEPlugin}
   */
  getGE:function() {
    return this._ge;
  },
  
  
  /** 
   * Returns the version of the Google Earth plugin installed on the user's system. 
   * @return {string}
   */
  getPluginVersion:function() {
    return this.getGE().getPluginVersion();
  },
  
  /** 
   * Returns the Google Earth API version being used. 
   * @return {string}
   */
  getApiVersion:function() {
    return this.getGE().getApiVersion();
  },
  
  
  //////// Camera
  
  
  /** 
   * Sets several parameters of the camera at the same time. 
   * params is expected to be of the following form:
   *  {
   *    lat,
   *    lon,
   *    alt,
   *    tilt,
   *    heading
   *  }
   *  All fields of params are optional.
   * @param {object} params
   * @param {KmlAltitudeModeEnum} altMode
   */
  setCamera:function(params, altMode) {
    var ge = this.getGE();
    if(!altMode) {
      altMode = ge.ALTITUDE_RELATIVE_TO_GROUND;
    }
    
    var lookAt = ge.getView().copyAsLookAt(altMode);
    
    if(params.lat !== undefined && params.lon !== undefined) {
      lookAt.setLatitude(params.lat);
      lookAt.setLongitude(params.lon);
    }
    
    if(params.alt !== undefined) {
      lookAt.setRange(params.alt);
    }
    
    if(params.tilt !== undefined) {
      lookAt.setTilt(params.tilt);
    }
    
    if(params.heading !== undefined) {
      lookAt.setHeading(params.heading);
    }
    
    ge.getView().setAbstractView(lookAt);
  },
  
  
  /** 
   * Moves the camera to look at the specified geographic coordinates. 
   * @param {number} lat  Latitude
   * @param {number} lon  Longitude
   */
  moveCamera:function(lat, lon) {
    var ge = this.getGE();
    var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    
    lookAt.setLatitude(lat);
    lookAt.setLongitude(lon);
    
    ge.getView().setAbstractView(lookAt);
  },
  
  
  /** 
   * Returns the camera's fly speed. This values is in the range [0.0, 5.0]. 
   * @return {double}
   */
  getSpeed: function() {
    return this.getGE().getOptions().getFlyToSpeed();
  },
  
  
  /** 
   * Sets the camera's fly speed. Allowed values are in the range [0.0, 5.0] or 
   * GEPlugin.SPEED_TELEPORT.
   * @param {double} speed
   */
  setSpeed: function(speed) {
    this.getGE().getOptions().setFlyToSpeed(speed);
  },
  
  
  /** 
   * Returns the latitude of the camera. 
   * @return {double}
   */
  getLatitude:function() {
    var ge = this.getGE();
    var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    return lookAt.getLatitude();
  },
  
  
  /** 
   * Returns the longitude of the camera.
   * @return {double}
   */
  getLongitude:function() {
    var ge = this.getGE();
    var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    return lookAt.getLongitude(); 
  },
  
  
  /** 
   * Sets the altitude of the camera.
   * @param {double} meters
   * @param {KmlAltitudeModeEnum} mode
   */
  setAltitude:function(meters, mode) {
    var ge = this.getGE();
    if(!mode) {
      mode = ge.ALTITUDE_RELATIVE_TO_GROUND;
    }
    
    var camera = ge.getView().copyAsCamera(mode);
    
    camera.setAltitude(meters);
    
    ge.getView().setAbstractView(camera);
  },
  
  
  /** 
   * Returns the altitude of the camera in meters.
   */
  getAltitude:function(mode) {
    var ge = this.getGE();
    if(!mode) {
      mode = ge.ALTITUDE_RELATIVE_TO_GROUND;
    }
    
    var camera = ge.getView().copyAsCamera(mode);
    return camera.getAltitude(); 
  },
  
  
  
  /** 
   * Sets the tilt of the camera. 
   * @param {double} degrees
   */
  setTilt:function(degrees) {
    var ge = this.getGE();
    var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    
    lookAt.setTilt(degrees);
    
    ge.getView().setAbstractView(lookAt);
  },
  
  
  /** 
   * Returns the tilt of the camera in degrees.
   * @param {double}
   */
  getTilt:function() {
    var ge = this.getGE();
    var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    return lookAt.getTilt(); 
  },
  
  
  /** 
   * Sets the compass heading of the camera.
   * @param {double}
   */
  setHeading:function(degrees) {
    var ge = this.getGE();
    var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    
    lookAt.setHeading(degrees);
    
    ge.getView().setAbstractView(lookAt);
  },
  
  
  /** 
   * Returns the compass heading of the camera in degrees. 
   * @return {double}
   */
  getHeading:function() {
    var ge = this.getGE();
    var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    return lookAt.getHeading(); 
  },
  
  
  //////// Placemarks
  
  /**
   * Returns the placemark with the specified ID.
   * @param {string} id
   * @return {KmlPlacemark}
   */
  getPlacemark:function(id) {
    return this._placemarks[id];
  },
  
  
  /** 
   * Adds a point placemark to the view.
   * @param {string} id   An ID to uniquely identify the placemark in the view.
   * @param {string} name   The text for the placemark's label.
   * @param {double} latitude
   * @param {double} longitude
   * @param {double} altitude   Optional
   * @return {KmlPlacemark}
   */
  addPlacemark:function(id, name, latitude, longitude, altitude) {
    if(!this._placemarks[id]) {
      var ge = this.getGE();
      
      if(!altitude) {
        altitude = 0;
      }
      
      var kml = ge.createPlacemark("");
      kml.setName(name);
      
      var pt = ge.createPoint("");
      pt.setLatLngAlt(latitude, longitude, altitude);
      
      kml.setGeometry(pt);
      
      this._placemarks[id] = kml;
      ge.getFeatures().appendChild(kml);
      
      return kml;
    }
  },
  
  
  /** 
   * Removes the placemark with the specified ID from the view. 
   * @param {string} id
   */
  removePlacemark: function(id) {
    var pm = this._placemarks[id];
    if(pm) {
      var ge = this.getGE();
      
      ge.getFeatures().removeChild(pm);
      delete this._placemarks[id];
    }
  },
  
  
  /** 
   * Removes all placemarks from the view. 
   */
  removeAllPlacemarks: function() {
    var ge = this.getGE();
    
    for(var id in this._placemarks) {
      var pm = this._placemarks[id];
      ge.getFeatures().removeChild(pm);
    }
    
    this._placemarks = {};
  },
  
  
  /** 
   * Adds a line string placemark to the view.
   * @param {string} id   A unique ID for the placemark.
   * @param {array: [lat, lng, alt]} points   The geographic points 
   *      definining the line string.
   * @param {double} altitude   Optional. The altitude offset of the line 
   *      string for all the points. Default 0.
   * @return {KmlPlacemark}
   */
  addPlacemarkLine: function(id, points, altitude) {
    if(!this._placemarks[id]) {
      var ge = this.getGE();
      
      if(!altitude) {
        altitude = 0;
      }
      
      var kml = ge.createPlacemark("");
      
      var line = ge.createLineString("");
      for(var i=0; i< points.length; i++) {
        var pt = points[i];
        if(!pt[2]) {
          pt[2] = 0;
        }
        
        line.getCoordinates().pushLatLngAlt(pt[0], pt[1], pt[2] + altitude);
      }
      line.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_GROUND);
      line.setTessellate(true);
      kml.setGeometry(line);
      
      this._placemarks[id] = kml;
      ge.getFeatures().appendChild(kml);
      
      return kml;
    }
  },
  
  
  /**
   * Adds a polygon placemark to the view.
   * @param {string} id   A unique ID for the placemark.
   * @param {array: [lat, lng, alt]} outerPoly    The geographic points 
   *      defining the outer perimeter of the polygon.
   * @param {array: array: [lat, lng, alt]} innerPolies   Optional. The array of inner 
   *      polygons whose area is removed from the outerPoly.
   * @param {double} altitude   Optional. The altitude offset of all the polygon's
   *      points. Default 0.
   */ 
  addPlacemarkPolygon: function(id, outerPoly, innerPolies, altitude) {
    if(!this._placemarks[id]) {
      var ge = this.getGE();
      
      if(!altitude) {
        altitude = 0;
      }
      
      var kml = ge.createPlacemark("");
      
      var poly = ge.createPolygon("");
      poly.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_GROUND);
      
      // Create the outer boundary.
      var outer = ge.createLinearRing("");
      outer.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_GROUND);
      for(var i=0; i < outerPoly.length; i++) {
        var pt = outerPoly[i];
        if(!pt[2]) {
          pt[2] = 0;
        }
        outer.getCoordinates().pushLatLngAlt(pt[0], pt[1], pt[2] + altitude);
      }
      poly.setOuterBoundary(outer);
      
      // If there are any inner boundaries, create them.
      if(innerPolies) {
        for(var i=0; i < innerPolies.length; i++) {
          var innerPoly = innerPolies[i];
          
          var inner = ge.createLinearRing("");
          inner.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_GROUND);
          
          for(var j=0; j < innerPoly.length; j++) {
            var pt = innerPoly[j];
            if(!pt[2]) {
              pt[2] = 0;
            }
            inner.getCoordinates().pushLatLngAlt(pt[0], pt[1], pt[2] + altitude);
          }
          
          poly.getInnerBoundaries().appendChild(inner);
        }
      }
      
      kml.setGeometry(poly);
      
      this._placemarks[id] = kml;
      ge.getFeatures().appendChild(kml);
      
      return kml;
    }
  },
  
  
  //////// Icons
  
  
  /** 
   * Returns the icon with the specified ID.
   * @param {string} id
   * @return {KmlIcon}
   */
  getIcon: function(id) {
    return this._icons[id];
  },
  
  
  /** 
   * Adds an icon to the view.
   * @param {string} id   A unique ID for the icon.
   * @param {string} href   The complete URL for the icon's graphic.
   * @param {uint} x      Optional. The X offset of the icon in the source image.
   * @param {uint} y      Optional. The Y offset of the icon in the source image.
   * @param {uint} w      Optional. The width of the icon in the source image.
   * @param {uint} h      Optional. The height of the icon in the source image.
   * @return {KmlIcon}
   */
  addIcon: function(id, href, x, y, w, h) {
    var ge = this.getGE();
    
    var icon = ge.createIcon("");
    icon.setHref(href);
    
    if(x && y && w && h) {
      icon.setX(x);
      icon.setY(y);
      icon.setW(w);
      icon.setH(h);
    }
    
    this._icons[id] = icon;
    
    return icon;
  },
  
  
  //////// Styles
  
  /** 
   * Returns the style with the specified ID.
   * @param {string} id
   * @return {KmlStyleMap}
   */
  getStyle:function(id) {
    return this._styles[id];
  },
  
  
  /** 
   * Adds a style (and perhaps a highlight style) to the view as a style map. 
   * @param {string} id   A unique ID for the style.
   * @param {KmlStyle} normal   The style.
   * @param {KmlStyle} highlight    Optional. The highlight style. If this
   *      is not provided, then the normal style will be used for the highlight
   *      style.
   * @return {KmlStyleMap}
   */
  addStyle:function(id, normal, highlight) {
    var ge = this.getGE();
    
    if(!highlight) {
      highlight = normal;
    }
    
    var styleMap = ge.createStyleMap("");
    styleMap.setStyle(normal, highlight);
    
    this._styles[id] = styleMap;
    
    return styleMap;
  },
  
  
  //////// Balloons
  
  /** 
   * Assigns a balloon to a placemark to be displayed when the placemark 
   * is clicked. 
   * @param {string} id   The ID of the placemark
   * @param {GEAbstractBalloon} balloon   The balloon that will be displayed 
   *      for the placemark.
   */
  assignBalloon:function(id, balloon) {
    var ge = this.getGE();
    var placemark = this.getPlacemark(id);
    balloon.setFeature(placemark);
    
    google.earth.addEventListener(placemark, 'click', function() {
      event.preventDefault();
      ge.setBalloon(balloon);
    });    
  },
  
  
  
  //////// Layers
  
  
  setLayerEnabled: function(layer, enabled) {
    var ge = this.getGE();
    ge.getLayerRoot().enableLayerById(layer, enabled);
  },
  
};


/** Default callback function for Google Earth errors. */
GE_View.defaultFailureCB = function(errorCode) {
  alert("Google Earth error: " + errorCode);
};



/** 
 * Main (test program). The GE_View object "view" is made global for easy 
 * testing in the browser's javascript console.
 */
GE_View.start = function() {
  var container = document.getElementById("map3d");
  view = new GE_View(container, {"callback" : function() {console.log("loaded GE.")}});
  view.start();
};

