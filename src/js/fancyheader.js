import { Renderer, Geometry, Program, Mesh } from 'ogl';
if (window.innerHeight < window.innerWidth) {
    

{
    const renderer = new Renderer({
        alpha: true,
        width: window.innerWidth/2,
        height: window.innerHeight*2/2,
    });
    const gl = renderer.gl;

    document.body.appendChild(gl.canvas);
    // Adjust canvas style
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '200vh';  // 50% of the viewport height
    gl.canvas.style.display = 'block'; // To ensure no extra space is taken up by the canvas
    gl.canvas.style.zIndex = -100;
    gl.canvas.style.imageRendering = "pixelated";

    gl.clearColor(0, 0, 0, 0);
    // Triangle that covers viewport, with UVs that still span 0 > 1 across viewport
    const geometry = new Geometry(gl, {
        position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
        uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });
    // Alternatively, you could use the Triangle class.

    const program = new Program(gl, {
        vertex: /* glsl */ `
            attribute vec2 uv;
            attribute vec2 position;

            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = vec4(position, 0, 1);
            }
        `,
        fragment: `
            precision highp float;

            uniform float uTime;
            uniform float resx;
            uniform float resy;
            varying vec2 vUv;

            float smin2( float a, float b, float k )
            {
                k *= 6.0;
                float h = max( k-abs(a-b), 0.0 )/k;
                return min(a,b) - h*h*h*k*(1.0/6.0);
            }

            float domain(vec3 v, float t) {
                vec2 torus = vec2(8.0, 3.0);
                vec2 q = vec2(length(v.xz+vec2(0.0, -2.4))-torus.x,v.y);
                float b = length(q)-torus.y;
                
                float size=3.0;
                
                vec3 sv = size*(v);
                
                float g= abs(cos(sv.x)+cos(sv.y+uTime)+cos(sv.z))-0.6;
                return -smin2(-b,-g/(2.0*size), 0.04);
            }

            vec3 grad (vec3 v) {
                float e = 0.0001;
                float local = domain(v,uTime);
                vec3 g = vec3(
                    (domain(vec3(v.x+e,v.yz),uTime)-local)/(1.0*e),
                    (domain(vec3(v.x,v.y+e,v.z),uTime)-local)/(1.0*e),
                    (domain(vec3(v.xy,v.z+e),uTime)-local)/(1.0*e)
                );
                return g;
            }
            void main() {
                vec2 uv = (2.0*vUv-vec2(1.0)) *3.0 * normalize(vec2(resx, resy));
                vec3 dir = normalize(vec3(uv.x, 4.0, uv.y));
                gl_FragColor.rgba = vec4(vec3(1.0), 1.0);
                
                const int MAX_STEPS = 100;
                vec3 loc = vec3(0.0, -14.0, 0.0);
                float dist = 0.0;
                float current_sign = sign(domain(loc, uTime));

                for(int i = 0; i < MAX_STEPS; i++){
                    if (sign(domain(loc,uTime)) != current_sign) {
                        break;
                    } 
                    dist += abs(domain(loc,uTime));
                    loc = loc + dir*abs(domain(loc,uTime));
                }
                vec3 v_normal = grad(loc);
                vec3 v_position = loc;
                v_normal = v_normal.xzy;
                v_normal.z = -v_normal.z;

                gl_FragColor.w *= exp(-0.0001*pow(dist, 1.6))/1.5;
                gl_FragColor.xyz *= 0.4*normalize(v_normal) ;
                gl_FragColor.xyz += 0.3;
                gl_FragColor.xyz = vec3(length(gl_FragColor.xyz));
                gl_FragColor.w *= 0.8;
            }
        `,
        uniforms: {
            uTime: { value: 0 },
            resx: { value: window.innerWidth },
            resy: { value: window.innerHeight*2  },
        },
        transparent: true
    });

    const mesh = new Mesh(gl, { geometry, program });

    requestAnimationFrame(update);
    function update(t) {
        requestAnimationFrame(update);
        program.uniforms.uTime.value = t * 0.001;
        renderer.render({ scene: mesh });
    }
}

}