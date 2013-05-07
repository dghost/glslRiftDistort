#version 150

layout(points) in;
layout(triangle_strip, max_vertices = 8) out;

out vec2 _thetaCoords;
invariant out vec2 _sCenter;
invariant out vec2 _lCenter;
invariant out vec2 _scale;

uniform float DistortionOffset = 0.151976;
uniform vec2 ScaleIn = vec2(4.0,2.0);
uniform vec2 Scale = vec2(0.25,0.5);


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
vec4 preScaleCoords(vec2 bl, vec2 ur, vec2 center)
{
	vec4 result;
	result.xy = (bl  - center) * ScaleIn;
	result.zw = (ur  - center) * ScaleIn;
	return result;
}

void main()
{
	_scale = Scale;

	/* right eye */
    _sCenter = vec2(0.75,0.5);
    _lCenter = vec2(0.75 - DistortionOffset * 0.25, 0.5);
	vec4 texRect = preScaleCoords(vec2(0.5,1.0),vec2(1.0,0.0), _lCenter);

	emitQuad(vec4(0.0,-1.0,1.0,1.0),texRect);
}
