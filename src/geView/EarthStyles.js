/**
 * A factory object for creating common types of KmlStyles.
 */
GE_View.EarthStyles = {
  
  /** 
   * Produces a style with a custom icon.
   * @param {GEPlugin} ge
   * @param {KmlIcon} icon
   * @param {float} scale  Optional. Default 1.0.
   * @return {KmlStyle}
   */
  createSimpleIconStyle: function(ge, icon, scale) {
    if(!scale) {
      scale = 1.0;
    }
    
    var style = ge.createStyle("");
    style.getIconStyle().setIcon(icon);
    style.getIconStyle().setScale(scale);
    
    return style;
  },
  
  
  /** 
   * Produces a style that scales and colors labels.
   * @param {GEPlugin} ge
   * @param {string} color    The color of the label in abgr hex format.
   * @param {float} width
   * @return {KmlStyle}
   */
  createSimpleLabelStyle: function(ge, color, scale) {
    if(!scale) {
      scale = 1;
    }
    
    var style = ge.createStyle("");
    style.getLabelStyle().getColor().set(color);
    style.getLabelStyle().setScale(scale);
    
    return style;
  },
  
  
  
  /**
   * Produces a style for lines with a specified color and width.
   * @param {GEPlugin} ge
   * @param {string} color   The color of the line in abgr hex format.
   * @param {float} width
   * @return {KmlStyle}
   */
  createSimpleLineStyle: function(ge, color, width) {
    if(!width) {
      width = 1.0;
    }
    
    var style = ge.createStyle("");
    style.getLineStyle().setWidth(width);
    style.getLineStyle().getColor().set(color);
    
    return style;
  },
  
  
  /** 
   * Produces a style for defining the fill and outline colors of polygons as
   * well as outline width.
   * @param {GEPlugin} ge
   * @param {string} fill   The color for the polygon interior in abgr hex format.
   * @param {string} outline  The color for the polygon outline in abgr hex format.
   * @param {float} width   The polygon outline width.
   * @return {KmlStyle}
   */
  createSimplePolyStyle: function(ge, fill, outline, width) {
    if(!width) {
      width = 1.0;
    }
    
    var style = ge.createStyle("");
    if(outline) {
      style.getPolyStyle().setOutline(true);
      style.getLineStyle().setWidth(width);
      style.getLineStyle().getColor().set(outline);
    }
    else {
      style.getPolyStyle().setOutline(false);
    }
    
    if(fill) {
      style.getPolyStyle().setFill(true);
      style.getPolyStyle().getColor().set(fill);
    }
    else {
      style.getPolyStyle().setFill(false);
    }
    
    return style;
  }
  
};
