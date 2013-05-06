#version 150

layout(points) in;
layout(triangle_strip, max_vertices = 4) out;

out vec2 TexCoords;
invariant out vec2 ScreenCenter;
invariant out vec2 LensCenter;

uniform float DistortionOffset = 0.151976;

void main()
{
    ScreenCenter = vec2(0.75,0.5);
	LensCenter = vec2(0.75 - DistortionOffset * 0.25, 0.5);
	
    gl_Position = vec4( 1.0, 1.0, 0.0, 1.0 );
    TexCoords = vec2( 1.0, 0.0 );
    EmitVertex();

    gl_Position = vec4(0.0, 1.0, 0.0, 1.0 );
    TexCoords = vec2( 0.5, 0.0 );
    EmitVertex();

    gl_Position = vec4( 1.0,-1.0, 0.0, 1.0 );
    TexCoords = vec2( 1.0, 1.0 );
    EmitVertex();

    gl_Position = vec4(0.0,-1.0, 0.0, 1.0 );
    TexCoords = vec2( 0.5, 1.0 );
    EmitVertex();

    EndPrimitive();
}
