#version 110

varying vec2 theta;

uniform vec2 scale;
uniform vec2 screenCenter;
uniform vec2 lensCenter;
uniform vec4 hmdWarpParam;

uniform sampler2D tex;

void main()
{
	float rSq = theta.x*theta.x + theta.y*theta.y;
	vec2 rvector = theta*(hmdWarpParam.x + hmdWarpParam.y*rSq + hmdWarpParam.z*rSq*rSq + hmdWarpParam.w*rSq*rSq*rSq);
	vec2 tc = (lensCenter + scale * rvector);

	if (any(bvec2(clamp(tc, screenCenter - vec2(0.5,0.5), screenCenter + vec2(0.5,0.5))-tc)))
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	else
		gl_FragColor = texture2D(tex, tc);
}