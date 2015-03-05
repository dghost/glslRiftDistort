#version 110

varying vec2 texCoords;
uniform vec2 lensCenter;
uniform vec2 scaleIn;
uniform vec2 scale;
uniform vec4 hmdWarpParam;
uniform vec4 chromAbParam;

// Scales input texture coordinates for distortion.
// ScaleIn maps texture coordinates to Scales to ([-1, 1]), although top/bottom will be
// larger due to aspect ratio.

void main()
{
	vec2 theta = (vec2(texCoords) - lensCenter) * scaleIn;

	float rSq = theta.x*theta.x + theta.y*theta.y;
	vec2 theta1 = theta*(hmdWarpParam.x + hmdWarpParam.y*rSq + hmdWarpParam.z*rSq*rSq + hmdWarpParam.w*rSq*rSq*rSq);
	vec2 thetaBlue = theta1 * (chromAbParam.z + chromAbParam.w * rSq);
	vec2 tcBlue = lensCenter + scale * thetaBlue;
	vec2 thetaRed = theta1 * (chromAbParam.x + chromAbParam.y * rSq);
	vec2 tcRed = lensCenter + scale * thetaRed;
	vec4 final;
	final.rg = tcRed;
	final.ba = tcBlue;
	gl_FragColor = final;
}
