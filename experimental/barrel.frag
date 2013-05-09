#version 150

uniform sampler2D Texture; //Image to be projected

uniform vec4 HmdWarpParam = vec4(1.0,0.22,0.24,0.0);

invariant in vec4 _ScreenRect;
invariant in vec2 _LensCenter;
invariant in vec2 _Scale;
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
	return (_LensCenter + _Scale * rvector);
}


void main(void)
{
	// scale the texture coordinates for better noise
	vec2 tc = HmdWarp(_thetaCoords);
	tc.y = 1.0 - tc.y;
	if (!all(equal(clamp(tc, _ScreenRect.xy, _ScreenRect.zw), tc)))
	{
		outColor = vec4(0.0);
	} else {
		outColor = texture2D(Texture,tc);
	}
}
