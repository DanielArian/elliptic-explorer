import Desmos from 'desmos';

/** Class representing a graphic calculator. */
export class Graphic {
  /**
  * Represents a graphic calculator.
  * @constructor
  * @param {string} element - The ID of the HTML element where the calculator will be.
  */
  constructor(element) {
    this.element = document.getElementById(element);
    if (this.element == undefined) {
      throw new Error(`Element : ${element} does not exist.`)
    }
    this.calculator = Desmos.GraphingCalculator(this.element);
    this.setup();

    this.pointColor = "#2d70b3";
    this.lineColor = "#000000";
    this.segemntColor = "#2d70b3";

    this.pointId = 0;
    this.lineId = 0;
    this.segmentID = 0;
  }

  get getElement() {
    return this.element;
  }

  get getcalculator() {
    return this.calculator;
  }
  /**
   * Setup the calculator with specified settings.
   */
  setup() {
    this.calculator.updateSettings({
      keypad: false,
      language: "fr",
      showResetButtonOnGraphpaper: true,
      //settingsMenu: false,
      border: false,
      expressionsCollapsed: true,
      autosize: true,
      //expressions: false
    });
  }

  /**
   * Save the current state of the graphic. This state can be loaded by using loadGraphicState()
   */
  saveGraphicState() {
    this.savedState = this.calculator.getState();
  }

  /**
   * Load the latest state of the graphic. A state can be saved using saveGraphicState()
   */
  loadGraphicState() {
    this.calculator.setState(this.savedState);
  }

  /**
   * Return the Desmos Expression giving his id
   * @param id - The id of the Desmos Expression
   * @returns The expression
   */
  getExpressionById(id) {
    let exp = this.calculator.getExpressions().find(element => element.id == id);
    if (exp == undefined) {
      console.warn(`id : ${id} does not exist.`);
    }
    return exp
  }

  /**
   * Set the parameters of an expression giving her id.
   * @param exp - The expression which you want to change the parameters of
   */
  setExpressionParameters(exp, params) {
    console.log(this.getExpressionById(exp),params);
    // if(this.getExpressionById(exp) == undefined) return;
    // console.log({...{id:`${exp}`}, ...params});
    // this.calculator.setExpression({...{id:`${exp}`}, ...{exp}});
    return exp
  }

  /**
  * add a draggable point on the graph giving his coordinates
  * 
  * @param {array} P - The point coordinates as an array 
  * @return {number} return the id of the point created.
  */
  addDraggablePoint(P, Axis) {
    if (!Array.isArray(P)) {
      throw new Error("Wrong Inputs. 'P' must be an array");
    }
    else if (Axis != 'X' && Axis != 'Y' && Axis != 'XY' && Axis != 'NONE') {
      throw new Error("Wrong Inputs. 'Axis' must be either 'X','Y', 'XY' or 'NONE'");
    }

    try {
      this.pointId++;
      this.calculator.setExpressions([
        { id: `x_{${this.pointId}}`, latex: `x_{${this.pointId}}=${P[0]}` },
        { id: `y_{${this.pointId}}`, latex: `y_{${this.pointId}}=${P[1]}` },
        { id: `p_{${this.pointId}}`, latex: `(x_{${this.pointId}},y_{${this.pointId}})`, showLabel: true, dragMode: Axis }
      ]);
      return this.pointId;
    } catch (error) {
      throw new Error(`An error has occured creating the point : ${error}`);
    }
  }

  /**
  * add a static point (not draggable) on the graph giving his coordinates
  * 
  * @param {array} P - The point coordinates as an array 
  * @return {number} return the id of the point created.
  */
  addStaticPoint(P) {
    return this.addDraggablePoint(P, 'NONE');
  }

  /**
   * update a point position on the graph giving his id and his new coordinates
   * 
   * @param {number} id - The id of the point to update
   * @param {array} newP - The new point coordinates as an array
   */
  updatePoint(id, newP) {
    if (typeof id != "number" || !Array.isArray(newP)) {
      throw new Error("Wrong Inputs. 'id' must be a number and 'newP' must be an array");
    }

    if (id > this.pointId) {
      throw new Error(`Selected point : ${id} do not exist. Number of points : ${this.pointId}`);
    }

    try {
      this.calculator.setExpressions([
        { id: `x_{${id}}`, latex: `x_{${this.pointId}}=${newP[0]}` },
        { id: `y_{${id}}`, latex: `y_{${this.pointId}}=${newP[1]}` },
      ]); // à revoir le try (set expression ne va pas renvoyer une erreur si point existe pas)
    } catch (error) {
      throw new Error(`Point ${id} not found : ${error}`);
    }
  }

  /**
   * Change the value of a parameter for example : x_{i}, y_{i}, a_{i}, g_{i}, b_{i} etc...
   * @param param - The parameter you want to change the value
   * @param value - The value you want to put in this parameter
   */
  setValueOfParameter(param, value) {
    this.calculator.setExpression({ id: `${param}`, latex: `${param}=${value}` })
  }

  /**
   * Get the value of a parameter for example : x_{i}, y_{i}, a_{i}, g_{i}, b_{i} etc...
   * @param param - The parameter from where you want to extract the value
   * @returns The value of the parameter
   */
  getValueOfParameter(param) {
    return this.calculator.model.expressionAnalysis[param].evaluation.value;
  }

  /**
   * add a straight line on the graph giving : gradient, b of the equation Y = gradient * X + b
   * 
   * @param {number} gradient - The gradiant of the equation Y = gradient * X + b 
   * @param {number} b - The b of the equation Y = gradient * X + b 
   * @return {number} return the id of the line created.
   */
  addLine(gradient, b) {
    if (typeof gradient != "number" || typeof b != "number") {
      throw new Error("'grandiant' and 'b' must be numbers");
    }

    try {
      this.lineId++;
      this.calculator.setExpressions([
        { id: `g_{${this.lineId}}`, latex: `g_{${this.lineId}}=${gradient}` },
        { id: `b_{${this.lineId}}`, latex: `b_{${this.lineId}}=${b}` },
        { id: `l_{${this.lineId}}`, latex: `y_{l${this.lineId}} = g_{${this.lineId}}*x + b_{${this.lineId}}` }
      ]);
      return this.lineId;
    } catch (error) {
      throw new Error(`An error has occured creating the line : ${error}`);
    }
  }

  /**
   * add a straight line on the graph between two points 
   * 
   * @param {number} idP - The id of the first point 
   * @param {number} idQ - The id of the second point 
   * @return {number} - return the id of the line created.
   */
  addLineBetweenTwoPoints(idP, idQ) {
    if (typeof idP != "number" || typeof idQ != "number") {
      throw new Error("'idP' and 'idQ' must be numbers");
    }

    try {
      this.lineId++;
      this.calculator.setExpressions([
        { id: `g_{${this.lineId}}`, latex: `g_{${this.lineId}}=\\frac{(y_{${idP}}-y_{${idQ}})}{(x_{${idP}}-x_{${idQ}})}` },
        { id: `b_{${this.lineId}}`, latex: `b_{${this.lineId}}=y_{${idP}}-g_{${this.lineId}}x_{${idP}}` },
        { id: `l_{${this.lineId}}`, latex: `y_{l${this.lineId}} = g_{${this.lineId}}*x + b_{${this.lineId}}`, lineOpacity: 0.3 }
      ]);
      return this.lineId;
    } catch (error) {
      throw new Error(`An error has occured creating the line : ${error}`);
    }
  }

  /**
   * update a line position on the graph giving his id and his new coordinates
   * 
   * @param {number} id - The id of the line to update
   * @param {array} newP - The new point coordinates as an array
   */
  updateLine(id, newGradient, newB) {
    if (typeof id != "number" || typeof newGradient != "number" || typeof newB != "number") {
      throw new Error("Wrong Inputs. 'id', 'newline' and 'b' must be numbers");
    }

    if (id > this.lineId) {
      throw new Error(`Selected line : ${id} do not exist. Number of lines : ${this.lineId}`);
    }

    try {
      this.calculator.setExpressions([
        { id: `g_{${id}}`, latex: `g_{${id}}=${newGradient}` },
        { id: `b_{${id}}`, latex: `b_{${id}}=${newB}` },
      ]);
    } catch (error) {
      throw new Error(`Line ${id} not found : ${error}`);
    }
  }

  /**
   * add a straight line on the graph between two points 
   * 
   * @param {array} coordinatesX - An array of the x pos to link 
   * @param {array} coordinatesY - An array of the y pos to link 
   * @return {number} - return the id of the segment created.
   */
  addSegment(coordinatesX, coordinatesY) {
    if (!Array.isArray(coordinatesX) || !Array.isArray(coordinatesY)) {
      throw new Error(`'coordinatesX' and 'coordinatesY' must be arrays. Given : ${typeof coordinatesX} and ${typeof coordinatesY}`)
    }

    this.segmentID++;
    this.calculator.setExpression({
      id: `s_{${this.segmentID}}`,
      type: 'table',
      columns: [
        {
          latex: `s_{x${this.segmentID}}`,
          values: coordinatesX
        },
        {
          latex: `s_{y${this.segmentID}}`,
          values: coordinatesY,
          color: this.segemntColor,
          hidden: false,
          pointStyle: "OPEN",
          lineStyle: "DASHED",
          points: false,
          lines: true
        }
      ]
    });

    return this.segmentID;
  }

  /**
   * Hide all the lines
   */
  hideLines() {
    for (let id = 1; id <= this.lineId; id++) {
      this.calculator.setExpression({ id: `l_{${id}}`, hidden: true })
    }
  }

  /**
   * Show all the lines
   */
  showLines() {
    for (let id = 1; id <= this.lineId; id++) {
      this.calculator.setExpression({ id: `l_{${id}}`, hidden: false })
    }
  }
}

/** Class representing a real elliptic curve.*/
export class RealCurveGraph extends Graphic {
  /**
  * Represents a graphic calculator.
  * @constructor
  * @param {string} element - The ID of the HTML element where the calculator will be.
  */
  constructor(element) {
    super(element);
  }

  /**
   * show the curve on the graph
   */
  showCurve() {
    throw new Error('You have to implement the method showCurve for this curve!');
  }

  /**
   * add a point on the curve giving his x position on the graph
   * @param {number} xPos - The point X coordinate 
   * @return {number} return the id of the point created.
   */
  addCurvePoint() {
    throw new Error('You have to implement the method addCurvePoint for this curve!');
  }

  /**
   * create a point in the expression list giving his x position, the expression of his y value(positive and negative)
   * @param {number} xPos - The point X coordinate 
   * @param {number} yPositiveExpression - The expression of the positive solution of y in latex
   * @param {number} yNegativeExpression - The expression of the negative solution of y in latex
   */
  addCurvePointInExpressions(xPos, yPositiveExpression, yNegativeExpression,) {
    this.calculator.setExpressions([
      { id: `x_{${this.pointId}}`, latex: `x_${this.pointId}=${xPos}` },
      { id: `y_{p${this.pointId}}`, latex: `y_{p${this.pointId}}=${yPositiveExpression}` },
      { id: `y_{n${this.pointId}}`, latex: `y_{n${this.pointId}}=${yNegativeExpression}` },
      { id: `y_{${this.pointId}}`, latex: `y_{${this.pointId}} = y_{p${this.pointId}}` },
      { id: `p_{${this.pointId}}`, latex: `p_{${this.pointId}}=(x_{${this.pointId}},y_{${this.pointId}})` }
    ]);
  }
}


/** Class representing a modular elliptic curve.*/
export class ModCurveGraph extends Graphic {
  /**
  * Represents a graphic calculator.
  * @constructor
  * @param {string} element - The ID of the HTML element where the calculator will be.
  */
  constructor(element) {
    super(element);
  }

  displayPoints(list_points) {
    var that = this;
    list_points.forEach(function (item) {
      that.addStaticPoint(item);
    });
  }

  displayClickPoints(list_point) {
    var that = this;
    // Find the pixel coordinates of the graphpaper origin:
    that.calculator.mathToPixels({ x: 0, y: 0 });
    // Find the math coordinates of the mouse
    var calculatorRect = this.element.getBoundingClientRect();
    document.addEventListener('click', function (evt) {
      var coordonnees_souris = that.calculator.pixelsToMath({
        x: evt.clientX - calculatorRect.left,
        y: evt.clientY - calculatorRect.top
      })
      var x = coordonnees_souris.x;
      var y = coordonnees_souris.y;
      var x_arrondi = Math.round(x);
      var y_arrondi = Math.round(y);
      list_point.forEach(function (item) {
        if ((x_arrondi == item[0]) && (y_arrondi == item[1])) {
          console.log([x_arrondi, y_arrondi])
        }
      });

    });
  }

  stopClickPoints() {
    document.removeEventListener('click');
  }
}  
