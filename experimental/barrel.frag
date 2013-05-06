#version 150

uniform sampler2D Texture; //Image to be projected

uniform vec2 ScaleIn = vec2(4.0,2.0);
uniform vec2 Scale = vec2(0.25,0.5);

uniform vec4 HmdWarpParam = vec4(1.0,0.22,0.24,0.0);

invariant in vec2 _sCenter;
invariant in vec2 _lCenter;
invariant in vec2 _scale;

in vec2 _thetaCoords;

//layout(location = 0) out vec4 outColor; // GLSL 3.30 or higher only

out vec4 outColor; // GLSL 1.50 or higher

vec2 HmdWarp(vec2 theta)
{

	float rSq = theta.x * theta.x + theta.y * theta.y;
	vec2 rvector= theta * (	HmdWarpParam.x + HmdWarpParam.y * rSq +
		HmdWarpParam.z * rSq * rSq 
		+ HmdWarpParam.w * rSq * rSq * rSq
		);
	return (_lCenter + _scale * rvector);
}


void main(void)
{
	// scale the texture coordinates for better noise
	vec2 tc = HmdWarp(_thetaCoords);
	tc.y = 1.0 - tc.y;
	if (!all(equal(clamp(tc, _sCenter-vec2(0.25,0.5), _sCenter+vec2(0.25,0.5)), tc)))
	{
		outColor = vec4(0.0);
	} else {
		outColor = texture2D(Texture,tc);
	}
}
