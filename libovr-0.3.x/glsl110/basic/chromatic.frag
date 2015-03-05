#version 110

varying vec2 theta;

uniform vec2 lensCenter;
uniform vec2 scale;
uniform vec2 screenCenter;
uniform vec4 hmdWarpParam;
uniform vec4 chromAbParam;

uniform sampler2D tex;

// Scales input texture coordinates for distortion.
// ScaleIn maps texture coordinates to Scales to ([-1, 1]), although top/bottom will be
// larger due to aspect ratio.
void main()
{
	float rSq = theta.x*theta.x + theta.y*theta.y;
	vec2 theta1 = theta*(hmdWarpParam.x + hmdWarpParam.y*rSq + hmdWarpParam.z*rSq*rSq + hmdWarpParam.w*rSq*rSq*rSq);

	// Detect whether blue texture coordinates are out of range since these will scaled out the furthest.
	vec2 thetaBlue = theta1 * (chromAbParam.z + chromAbParam.w * rSq);
	vec2 tcBlue = lensCenter + scale * thetaBlue;

	if (!all(equal(clamp(tcBlue, screenCenter - vec2(0.5,0.5), screenCenter + vec2(0.5,0.5)),tcBlue)))
	{
		gl_FragColor = vec4(0.0,0.0,0.0,1.0);
		return;
	}

	// Now do blue texture lookup.
	float blue = texture2D(tex, tcBlue).b;

	// Do green lookup (no scaling).
	vec2  tcGreen = lensCenter + scale * theta1;

	float green = texture2D(tex, tcGreen).g;

	// Do red scale and lookup.
	vec2  thetaRed = theta1 * (chromAbParam.x + chromAbParam.y * rSq);
	vec2  tcRed = lensCenter + scale * thetaRed;

	float red = texture2D(tex, tcRed).r;

	gl_FragColor = vec4(red, green, blue, 1.0);
}