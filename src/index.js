window.onload = function () {
    var img=new Image();
    img.addEventListener("load",()=>{
        init();
    });
    img.src="9.jpg";//https://user-images.githubusercontent.com/4150631/133870331-2ea4da9e-7ef4-4d28-af0a-3b365c1aa4cf.jpg";
    function createTexture(img,w,h,repeat,maplevel){
        var texture=gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if(img!=null) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        }else{
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
        }
        if (repeat){
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }else{
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        if(maplevel>0){
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        }else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        }
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    var gl;
    var renderTexture;
    var fb;
    var texture;
    var program;
    function init(){
        //创建gl
        var canvasObject = document.getElementById("webglview");
        gl = canvasObject.getContext("webgl");
        if (gl == null) {
            alert("do not support webgl");
            return;
        }

        //创建shader
        var vsh = `
        attribute vec4 position;
        varying vec2 uv;
        void main(){
            uv=position.xy;
            //uv.y=1.0-uv.y;
            vec4 pos=position*2.0-1.0;
            pos.xy=pos.xy/2.0;
            gl_Position = pos;
        }`;
        var fsh = `
        precision mediump float;
        varying vec2 uv;
        uniform sampler2D fs0;
        void main(){
            gl_FragColor = texture2D(fs0,uv);
        }`;
        var vshader = gl.createShader(gl.VERTEX_SHADER);
        var fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vshader, vsh);
        gl.shaderSource(fshader, fsh);
        gl.compileShader(vshader);
        gl.compileShader(fshader);
        program = gl.createProgram();
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        gl.bindAttribLocation(program, 0, "test");
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            alert(gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        //创建buff
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0, 0,
            1, 1, 0,
            1, 0, 0,
            1, 1, 0,
            0, 0, 0,
            0, 1, 0
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        //创建texture
        texture=createTexture(img);

        renderTexture= createTexture(null,512,512);

        fb=gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,renderTexture,0);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);

        update();
    }

    function update(){
        requestAnimationFrame(update);

        gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(program,"fs0"), 0);
        gl.viewport(0,0,512,512);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,renderTexture);
        gl.uniform1i(gl.getUniformLocation(program,"fs0"), 0);
        gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
    }
};
