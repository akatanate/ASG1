// HelloPoint1.js
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main(){
        gl_Position = a_Position;
        //gl_PointSize = 20.0;
        gl_PointSize = u_Size;
    }`

    // Coordinates
    // Set the point size

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
    }`

    //Set the color

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    //gl = getWedGLContext(canvas);

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    } 

    // Get the storage location of a_Position variable
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Fail to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor variable
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Fail to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_Sizevariable
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Fail to get the storage location of u_Size');
        return;
    }
}

//Constants
const POINT = 0;
const TRIANGLE = 1;

//globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; //white starting
let selectedSize = 5;
let g_selectedType=POINT;

//set up actions for HTML UI elements
function addActionsForHtmlUI(){

    //button events (shape type)
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; };
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
    document.getElementById('clear').onclick = function() { g_shapesList=[]; renderAllShapes(); };

    document.getElementById('pointButton').onclick = function() { g_selectedType=POINT };
    document.getElementById('triButton').onclick = function() { g_selectedType=TRIANGLE };



    //Slider events
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0]; } );
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1]; } );
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2]; } );

    //size slider events
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { selectedSize = this.value; } );


}


function main() {

    setupWebGL();
    connectVariablesToGSL();

 
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = click = function(ev){ if(ev.buttons == 1) { click(ev) } };

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}




var g_shapesList = [];

// var g_points = []; // The array for a mouse press
// var g_colors = []; // The array to store the color of a point
// var g_sizes = []; // The array tp stpre the size of a point

function click(ev) {
  //extract the event click and return it in WebGL coordinates
  // let can see in local vars, or just type in the var in console to see same thing
  [x, y] = convertCoordinatesEventToGL(ev);

  // create and store the new point
  let point;
  if (g_selectedType==POINT){
    point = new PointerEvent();
  } else{
    point = new Triangle();
  }
  

  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // Store the color to the g_colors array
  // g_colors.push(g_selectedColor.slice());

    //store the size to the g sizes array
    // g_sizes.push(g_selectedSize);

  // Store the color to g_colors array
  /*if(x >= 0.0 && y >= 0.0) { // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]); // Red
  } else if(x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]); // Green
  } else { // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]); // White
  }*/

  //Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
  
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2)

    return([x, y]);
}



function renderAllShapes(){
    // Check the time at the start of this function
    var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

// Draw each shape in the list
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  //check time at end of function, show on pg
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");

}

// set the text of a HTML element
function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}