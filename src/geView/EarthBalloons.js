/** 
 * A factory object for creating common types of GEAbstractBalloons.
 */
GE_View.EarthBalloons = {
  
  /** 
   * Creates a balloon containing some HTML string content. 
   * @param {GEPlugin} ge
   * @param {string} html
   * @return {GEHtmlStringBalloon}
   */
  createHtmlBalloon: function(ge, html) {
    var balloon = ge.createHtmlStringBalloon("");
    balloon.setContentString(html);
    return balloon;
  },
  
  
  /** 
   * Creates a balloon containing a Div element.
   * @param {GEPlugin} ge
   * @param {div element} div
   * @return {GEHtmlDivBalloon}
   */
  createDivBalloon: function(ge, div) {
    var balloon = ge.createHtmlDivBalloon("");
    balloon.setContentDiv(div);
    return balloon;
  },
  
};
