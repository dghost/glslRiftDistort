#version 110

varying vec2 theta;

uniform vec2 lensCenter;
uniform vec2 scaleIn;

void main(void) {
	// pre-transform the texture coordinates
	theta = (gl_MultiTexCoord0.xy - lensCenter) * scaleIn;
	gl_Position = gl_Vertex;
}