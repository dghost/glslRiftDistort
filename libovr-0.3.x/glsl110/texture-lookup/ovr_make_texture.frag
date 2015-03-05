#version 110

varying vec2 texCoords;
uniform vec2 scale;
uniform vec2 lensCenter;
uniform vec2 scaleIn;
uniform vec4 hmdWarpParam;

vec2 warp(vec2 uv)
{
	vec2 theta = (vec2(uv) - lensCenter) * scaleIn;
	float rSq = theta.x*theta.x + theta.y*theta.y;
	vec2 rvector = theta*(hmdWarpParam.x + hmdWarpParam.y*rSq + hmdWarpParam.z*rSq*rSq + hmdWarpParam.w*rSq*rSq*rSq);
	return (lensCenter + scale * rvector);
}

void main()
{
	vec2 tc = warp(texCoords);
	gl_FragColor.rg = tc;
}