#version 150

uniform sampler2D Texture; //Image to be projected
uniform vec4 HmdWarpParam = vec4(1.0,0.22,0.24,0.0);
uniform vec4 ChromAbParam = vec4(0.996000, -0.004000, 1.014000,0.000000);
invariant in vec4 _ScreenRect;
invariant in vec2 _LensCenter;
invariant in vec2 _Scale;
in vec2 _thetaCoords;

//layout(location = 0) out vec4 outColor; // GLSL 3.30 or higher only

out vec4 outColor; // GLSL 1.50 or higher

void main(void)
{
	// scale the texture coordinates for better noise
	vec2 theta = _thetaCoords;
	float rSq= theta.x * theta.x + theta.y * theta.y;
	vec2 theta1 = theta * (HmdWarpParam.x + HmdWarpParam.y * rSq +
							HmdWarpParam.z * rSq * rSq + HmdWarpParam.w * rSq * rSq * rSq);

	// Detect whether blue texture coordinates are out of range since these will scaled out the furthest.
	vec2 thetaBlue = theta1 * (ChromAbParam.z + ChromAbParam.w * rSq);
	vec2 tcBlue = _LensCenter + _Scale * thetaBlue;
	tcBlue.y = 1 - tcBlue.y;
	if (!all(equal(clamp(tcBlue, _ScreenRect.xy, _ScreenRect.zw), tcBlue)))
	{
		outColor = vec4(0);
		return;
	}

	// Now do blue texture lookup.

	float blue = texture2D(Texture, tcBlue).b;

	// Do green lookup (no scaling).
	vec2  tcGreen = _LensCenter + _Scale * theta1;
	tcGreen.y = 1 - tcGreen.y;

	vec4  center = texture2D(Texture, tcGreen);

	// Do red scale and lookup.
	vec2  thetaRed = theta1 * (ChromAbParam.x + ChromAbParam.y * rSq);
	vec2  tcRed = _LensCenter + _Scale * thetaRed;
	tcRed.y = 1 - tcRed.y;
	float red = texture2D(Texture, tcRed).r;

	outColor = vec4(red, center.g, blue, center.a);
}
