#version 150

layout(points) in;
layout(triangle_strip, max_vertices = 8) out;

out vec2 _thetaCoords;
invariant out vec4 _ScreenRect;
invariant out vec2 _LensCenter;
invariant out vec2 _Scale;

uniform float DistortionOffset = 0.151976;
uniform vec2 Scale = vec2(0.25,0.5);
uniform float DistortionScale = 1.0;


void emitQuad(vec4 screen, vec4 coords)
{
/*
	screen is a rect describing the screen space coordinates
		of the rectangle to be emitted. screen.xy is the bottom left
		corner, and screen.zw is the upper right corner.
		
	coords is a rect describing the texture coordinates to be emitted
		with coords.xy describing the bottom left corner and coords.zw
		describing the upper right corner
		
*/
	gl_Position = vec4(screen.z, screen.w, 0.0, 1.0 );
	_thetaCoords = vec2( coords.z, coords.w);
	EmitVertex();

	gl_Position = vec4(screen.x, screen.w, 0.0, 1.0 );
	_thetaCoords = vec2( coords.x, coords.w );
	EmitVertex();

	gl_Position = vec4(screen.z,screen.y, 0.0, 1.0 );
	_thetaCoords = vec2( coords.z, coords.y );
	EmitVertex();

	gl_Position = vec4(screen.x,screen.y, 0.0, 1.0 );
	_thetaCoords = vec2( coords.x, coords.y );
	EmitVertex();
	
	EndPrimitive();
}

// apply scaling factors and build a rectangle
vec4 displacedRect( vec2 center)
{
	vec4 result;
	result.xy = (vec2(-1.0,1.0)  - center);
	result.zw = (vec2(1.0,-1.0)  - center);
	return result;
}

vec4 screenRect(vec2 center)
{
	vec4 result;
	result.xy = center - vec2(0.25,0.5);
	result.zw = center + vec2(0.25,0.5);
	return result;
}

void main()
{
	_Scale = Scale / DistortionScale;
	vec4 texRect;
	
	/* left eye */
	_ScreenRect = screenRect(vec2(0.25,0.5));
	_LensCenter = vec2(0.25 + DistortionOffset * 0.25, 0.5);
	texRect = displacedRect(vec2(DistortionOffset,0.0));

	emitQuad(vec4(-1.0,-1.0,0.0,1.0),texRect);

	/* right eye */
	_ScreenRect = screenRect(vec2(0.75,0.5));
	_LensCenter = vec2(0.75 - DistortionOffset * 0.25, 0.5);
	texRect = displacedRect(vec2(-DistortionOffset,0.0));

	emitQuad(vec4(0.0,-1.0,1.0,1.0),texRect);

}
