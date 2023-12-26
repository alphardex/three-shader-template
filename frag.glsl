varying vec2 vUv;

uniform sampler2D iChannel0;

void main(){
    vec2 uv=vUv;
    vec4 tex=texture(iChannel0,uv);
    vec3 col=tex.xyz;
    gl_FragColor=vec4(col,1.);
}