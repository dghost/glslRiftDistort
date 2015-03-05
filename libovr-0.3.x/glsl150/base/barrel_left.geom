#version 150

layout(points) in;
layout(triangle_strip, max_vertices = 4) out;

out vec2 TexCoords;
invariant out vec2 ScreenCenter;
invariant out vec2 LensCenter;

uniform float DistortionOffset = 0.151976;

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
	TexCoords = vec2( coords.z, coords.w);
	EmitVertex();

	gl_Position = vec4(screen.x, screen.w, 0.0, 1.0 );
	TexCoords = vec2( coords.x, coords.w );
	EmitVertex();

	gl_Position = vec4(screen.z,screen.y, 0.0, 1.0 );
	TexCoords = vec2( coords.z, coords.y );
	EmitVertex();

	gl_Position = vec4(screen.x,screen.y, 0.0, 1.0 );
	TexCoords = vec2( coords.x, coords.y );
	EmitVertex();
	
	EndPrimitive();
};

void main()
{
	ScreenCenter = vec2(0.25,0.5);
	LensCenter = vec2(0.25 + DistortionOffset * 0.25, 0.5);
	
	emitQuad(vec4(-1.0,-1.0,0.0,1.0),vec4(0.0,1.0,0.5,0.0));
}
