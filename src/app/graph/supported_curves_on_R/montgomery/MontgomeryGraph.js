import { RealCurveGraph } from "../../GraphicalInterface.js";

/* Class representing a real Montgomery elliptic curve*/
export class MontgomeryGraph extends RealCurveGraph {
  /** 
   * By^2 = x^3+ Ax^2 + x
   * @constructor 
   * @param {string} element
   * @param {number} A 
   * @param {number} B 
   * */
  constructor(element, A, B) {
    if (typeof (A) != "number" || typeof (B) != "number") {
      throw new Error("All coefficients must be a number type.");
    }
    if (A <= 2 && A >= -2) {
      throw new Error("A can not be selected between -2 and 2")
    }
    if (B * ((A ** 2) - 4) == 0) {
      throw new Error("This B value can not be chosen")
    }
    super(element)
    this.calculator.updateSettings({
      polarMode: true,
    });
    this.A = A;
    this.B = B;
  }

  // fonction to plot Montgomery curve 
  showCurve() {
    this.calculator.setExpressions([
      { id: 'A', latex: `A=${this.A}` },
      { id: 'B', latex: `B=${this.B}` },
      { id: 'curve', latex: 'B*y^2 = x^3 + A * x^2 + x' }
    ])
    this.saveGraphicState();
  }

  /**
   * add a point on the curve knowing its x position on the graph
   * @param {number} xPos
   * @return {number} return the id of the point created
   */
  addCurvePoint(xPos) {
    this.pointId++;
    this.addCurvePointInExpressions(
      xPos,
      `\\sqrt{\\frac{x_{${this.pointId}}^{3}+A*x_{${this.pointId}}^{2}+x_{${this.pointId}}}{B}}`,
      `-y_{p${this.pointId}}`)
    return this.pointId;
  }

  /**
   * shows the addition of two point given their id
   *
   * @param {number} idP - The id of the first point 
   * @param {number} idQ - The id of the second point  
   * @return {number} return the id of the point created
   * @return {number} return the id of line created 
   * @return {number} return the id of the segment created
   **/
  showAdditionOfPoints(idP, idQ) {
    this.pointId++;

    let idL = this.addLineBetweenTwoPoints(idP, idQ);

    this.calculator.setExpressions([
      { id: `x_{${this.pointId}}`, latex: `x_{${this.pointId}}=Bg_{${idL}}^{2}-A-x_{${idP}}-x_{${idQ}}` },
      { id: `y_{${this.pointId}}`, latex: `y_{${this.pointId}}=(2x_{${idP}}+x_{${idQ}}+A)g_{${idL}}-Bg_{${idL}}^{3}-y_{${idP}}` },
      { id: `y_{n${this.pointId}}`, latex: `y_{n${this.pointId}}=-y_{${this.pointId}}` },
      { id: `p_{${this.pointId}}`, latex: `p_{${this.pointId}} = (x_{${this.pointId}},y_{${this.pointId}})`, pointStyle: "POINT", color: this.pointColor, pointSize: 15 },
      { id: `p_{n${this.pointId}}`, latex: `p_{${this.pointId}} = (x_{${this.pointId}},y_{n${this.pointId}})`, pointStyle: "OPEN", color: this.pointColor }
    ]);

    this.addSegment([`x_{${this.pointId}}`, `x_{${this.pointId}}`], [`y_{${this.pointId}}`, `y_{n${this.pointId}}`]);
    return this.pointId, this.lineId, this.segmentID;
  }
  
  /**
   * shows the double of a point given his id
   *
   * @param {number} idP - The id of the first point 
   * @return {number} return the id of the point created
   * @return {number} return the id of line created 
   * @return {number} return the id of the segment created
   **/
  showDoublingPoint(idP) {
    this.pointId++;

    let idL = this.addTangent(idP);

    this.calculator.setExpressions([
      { id: `x_{${this.pointId}}`, latex: `x_{${this.pointId}}=Bg_{${idL}}^{2}-A-2x_{${idP}}` },
      { id: `y_{${this.pointId}}`, latex: `y_{${this.pointId}}=(3x_{${idP}}+A)g_{${idL}}-Bg_{${idL}}^{3}-y_{${idP}}` },
      { id: `y_{n${this.pointId}}`, latex: `y_{n${this.pointId}}=-y_{${this.pointId}}` },
      { id: `p_{${this.pointId}}`, latex: `p_{${this.pointId}} = (x_{${this.pointId}},y_{${this.pointId}})`, pointStyle: "POINT", color: this.pointColor, pointSize: 15 },
      { id: `p_{n${this.pointId}}`, latex: `p_{n${this.pointId}} = (x_{${this.pointId}},y_{n${this.pointId}})`, pointStyle: "OPEN", color: this.pointColor }
    ]);

    this.addSegment([`x_{${this.pointId}}`, `x_{${this.pointId}}`], [`y_{${this.pointId}}`, `y_{n${this.pointId}}`]);
    return this.pointId, this.lineId, this.segmentID;
  }

  /**
   * shows the tangent at the point P
   *
   * @param {number} idP - The id of the point 
   * @return {number} return the id of the line created
   **/
  addTangent(idP) {
    if (typeof idP != "number") {
      throw new Error("'idP' must be a number");
    }

    try {
      this.lineId++;
      this.calculator.setExpressions([
        { id: `g_{${this.lineId}}`, latex: `g_{${this.lineId}}=\\frac{3x_{${idP}}^{2}+2Ax_{${idP}}+1}{2By_{${idP}}}` },
        { id: `b_{${this.lineId}}`, latex: `b_{${this.lineId}}=y_{${idP}}-g_{${this.lineId}}x_{${idP}}` },
        { id: `l_{${this.lineId}}`, latex: `y_{l${this.lineId}} = g_{${this.lineId}}*x + b_{${this.lineId}}`, lineOpacity: 1 }
      ]);
      return this.lineId;
    } catch (error) {
      throw new Error(`An error has occured creating the line : ${error}`);
    }
  }
}
