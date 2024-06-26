function drawTriangle(vertices){
    var n = 3; //number of vertices

    //create buffer object
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }

    //bind the buffer object to the target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    //assign the buffer object to a_position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    //return n;
}  
  
  
  
  // HelloTriangle.js
  // Vertex shader program
  var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    '}\n';

 // Fragment shader program
  var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

 function main() {
    ...
   // Set vertex coordinates
   var n = initVertexBuffers(gl);
...
   // Draw a triangle
   gl.drawArrays(gl.TRIANGLES, 0, n);
 }

 function initVertexBuffers(gl) {
   var vertices = new Float32Array([
0, 0.5, -0.5, -0.5, 0.5, -0.5
   ]);
   var n = 3; // The number of vertices
     ...
   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    ...
   return n;
 }