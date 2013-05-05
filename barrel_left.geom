#version 330 core

layout(points) in;
layout(triangle_strip, max_vertices = 4) out;

out vec2 warpTexCoords;
invariant out vec2 ScreenCenter;
invariant out vec2 LensCenter;

uniform float in_DistortionOffset = 0.151976;

void main()
{

    ScreenCenter = vec2(0.25,0.5);
//	LensCenter = ScreenCenter + vec2(in_ViewPortShift,0.0);
//	LensCenter = vec2(1.0 - 2.0 * 0.0635 / 0.0936,0.0);
	LensCenter = vec2(0.25+ in_DistortionOffset * 0.25, 0.5);

    gl_Position = vec4( 0.0, 1.0, 0.0, 1.0 );
    warpTexCoords = vec2( 0.5, 0.0);
    EmitVertex();

    gl_Position = vec4(-1.0, 1.0, 0.0, 1.0 );
    warpTexCoords = vec2( 0.0, 0.0 );
    EmitVertex();

    gl_Position = vec4( 0.0,-1.0, 0.0, 1.0 );
    warpTexCoords = vec2( 0.5, 1.0 );
    EmitVertex();

    gl_Position = vec4(-1.0,-1.0, 0.0, 1.0 );
    warpTexCoords = vec2( 0.0, 1.0 );
    EmitVertex();

    EndPrimitive();
}
