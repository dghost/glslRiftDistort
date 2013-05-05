#version 330

uniform sampler2D warpTexture; //Image to be projected

uniform vec2 in_ScaleIn = vec2(4.0,2.0);
uniform vec2 in_Scale = vec2(0.25,0.5);

uniform vec4 in_HmdWarpParam = vec4(1.0,0.22,0.24,0.0);

invariant in vec2 ScreenCenter;
invariant in vec2 LensCenter;

in vec2 warpTexCoords;

layout(location = 0) out vec4 outColor;

vec2 HmdWarp(vec2 in01)
{
	vec2 theta = (in01 - LensCenter) * in_ScaleIn; // Scales to [-1, 1]
	float rSq = theta.x * theta.x + theta.y * theta.y;
	vec2 rvector= theta * (	in_HmdWarpParam.x + in_HmdWarpParam.y * rSq +
		in_HmdWarpParam.z * rSq * rSq 
		+ in_HmdWarpParam.w * rSq * rSq * rSq
		);
	return (LensCenter + in_Scale * rvector);
}


void main(void)
{
	// scale the texture coordinates for better noise
	vec2 tc = HmdWarp(warpTexCoords);
	tc.y = 1.0 - tc.y;
	if (!all(equal(clamp(tc, ScreenCenter-vec2(0.25,0.5), ScreenCenter+vec2(0.25,0.5)), tc)))
	{
		outColor = vec4(0.0);
	} else {
		outColor = texture2D(warpTexture,tc);
	}
}
