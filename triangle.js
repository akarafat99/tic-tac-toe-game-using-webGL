// Call the function to draw the triangle. Pass 1 for rotation and 0 for no rotation.
// drawTriangle(gl1, 0); // Use 1 for rotation, 0 for no rotation

// Function to initialize WebGL and handle rotation based on isRotate value
function drawTriangle(gl, isRotate) {
    // Shader code with rotation matrix
    var vertexCode = `
    attribute vec2 coordinate;
    attribute vec4 color;
    varying vec4 vColor;
    uniform mat4 rotationMatrix;

    void main(void) {
        gl_Position = rotationMatrix * vec4(coordinate, 0.0, 1.0);
        vColor = color;
    }
`;

    var fragmentCode = `
    precision mediump float;
    varying vec4 vColor;
    void main(void) {
        gl_FragColor = vColor;
    }
`;

    // Create, compile, and attach shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexCode);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentCode);
    gl.compileShader(fragmentShader);

    // Create and link the program
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Buffer for vertices and colors
    var point = new Float32Array([
        0, 0.5, 1.0, 1.0, 1.0, 0.0,
        0.5, -0.5, 1.0, 1.0, 1.0, 0.0,

        0.5, -0.5, 1.0, 1.0, 1.0, 0.0,
        -0.5, -0.5, 1.0, 1.0, 1.0, 0.0,

        -0.5, -0.5, 1.0, 1.0, 1.0, 0.0,
        0, 0.5, 1.0, 1.0, 1.0, 0.0
    ]);

    var pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, point, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Setting up the vertex attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    var coordPos = gl.getAttribLocation(program, "coordinate");
    gl.vertexAttribPointer(coordPos, 2, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(coordPos);

    var colorPos = gl.getAttribLocation(program, "color");
    gl.vertexAttribPointer(colorPos, 4, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(colorPos);

    // Get the location for the rotation matrix
    var rotationMatrixLocation = gl.getUniformLocation(program, "rotationMatrix");

    // Check if rotation is enabled or not
    if (isRotate === 1) {
        // Call the animate rotation function for continuous rotation
        animateTriangleRotation(gl, rotationMatrixLocation);
    } else {
        // Static rendering without rotation
        drawStaticTriangle(gl, rotationMatrixLocation);
    }
}

// Function to animate the rotation
function animateTriangleRotation(gl, rotationMatrixLocation) {
    var angle = 0; // Initial angle in radians

    // Function to update the rotation and render the scene
    function render() {
        // Increment the angle (for smooth animation)
        angle += 0.01;

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        // Create a rotation matrix
        var rotationMatrix = new Float32Array([
            cos, -sin, 0.0, 0.0,
            sin, cos, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);

        // Pass the rotation matrix to the vertex shader
        gl.uniformMatrix4fv(rotationMatrixLocation, false, rotationMatrix);

        // Clear and draw the scene
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.LINES, 0, 6);

        // Call render repeatedly to keep animating
        requestAnimationFrame(render);
    }

    // Start the rendering loop
    render();
}

// Function to draw the rectangle without rotation (static)
function drawStaticTriangle(gl, rotationMatrixLocation) {
    // Create an identity matrix (no rotation)
    var rotationMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);

    // Pass the identity matrix to the vertex shader
    gl.uniformMatrix4fv(rotationMatrixLocation, false, rotationMatrix);

    // Clear and draw the scene (without rotation)
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, 6);
}