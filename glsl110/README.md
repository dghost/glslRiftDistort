####Directories

- **basic**: Stable, Rift SDK compatible versions of the distortion shader
- **texture-lookup**: Shaders for using a distortion texture

####Overview
The shaders require OpenGL 2.0 / GLSL 1.10+, and assume that each eye is stored in a separate texture. As an optimization, the texture coordinates and transformed to the [-1,1] range in the vertex shader so that it is not being performed per-pixel.

The distortion texture shaders need GL_RGBA16F textures in order to work correctly. The non-chromatic corrected texture only uses the red/green channels, so it can be stored in an GL_RG16F texture if supported on the system. It is important, though, to make sure you use the same (chromatic or non-chromatic corrected) texture creation and lookup shaders for it to work right.

####Uniforms
- `scaleIn` is the ratio that converts texture coordinates to the range [-1, 1]
- `scale` scales the distorted coordinates back to the range [-0.5,0.5]
- `hmdWarpParam` takes the DistortionK[] value provided by the Oculus SDK.
- `chromAbParam` takes the chromatic abberation correction parameters provided by the Oculus SDK.
- `lensCenter` is the texture coordinates that corresponds with the center of the lens
- `screenCenter` is the coordinates for the center of the texture being sampled


####Usage

To use:

- Bind the output framebuffer.
- Bind the source texture to uniform location `tex`.
- Bind values to `scaleIn`, `scale`, `screenCenter`, `lensCenter`, `hmdWarpParam`, and `chromAbParam`.
- Draw a quad that represents each eye.

####Example demonstrating minimal setup using per-eye shaders

```
		float scale = VR_OVR_GetDistortionScale();
		glUseProgramObject(current_shader->shader->program);

		glUniform4fv(current_shader->uniform.chrom_ab_param, 1, vrConfig.chrm);
		glUniform4fv(current_shader->uniform.hmd_warp_param, 1, vrConfig.dk);
		glUniform2f(current_shader->uniform.scale_in, 2.0f, 2.0f / vrConfig.aspect);
		glUniform2f(current_shader->uniform.scale, 0.5f / scale, 0.5f * vrConfig.aspect / scale);
		glUniform2f(current_shader->uniform.screen_center, 0.5 , 0.5);

		// draw left eye
		glUniform2f(current_shader->uniform.lens_center, 0.5 + vrState.projOffset * 0.5, 0.5);
		glBindTexture(GL_TEXTURE_2D,texture);

		glBegin(GL_TRIANGLE_STRIP);
		glTexCoord2f(0, 0); glVertex2f(-1, -1);
		glTexCoord2f(0, 1); glVertex2f(-1, 1);
		glTexCoord2f(1, 0); glVertex2f(0, -1);
		glTexCoord2f(1, 1); glVertex2f(0, 1);
		glEnd();

		// draw right eye
		glUniform2f(current_shader->uniform.lens_center, 0.5 - vrState.projOffset * 0.5, 0.5 );
		glBindTexture(GL_TEXTURE_2D,texture);

		glBegin(GL_TRIANGLE_STRIP);
		glTexCoord2f(0, 0); glVertex2f(0, -1);
		glTexCoord2f(0, 1); glVertex2f(0, 1);
		glTexCoord2f(1, 0); glVertex2f(1, -1);
		glTexCoord2f(1, 1); glVertex2f(1, 1);
		glEnd();
		glUseProgramObject(0);

		GL_Bind(0);
```

####Example demonstrating creating a distortion texture

```
	float scale = VR_OVR_GetDistortionScale();

	glUseProgram(current->shader->program);

	glUniform4fv(current->uniform.chrom_ab_param, 1, ovrConfig.chrm);
	glUniform4fv(current->uniform.hmd_warp_param, 1, ovrConfig.dk);
	glUniform2f(current->uniform.scale_in, 2.0f, 2.0f / ovrConfig.aspect);
	glUniform2f(current->uniform.scale, 0.5f / scale, 0.5f * ovrConfig.aspect / scale);
	glUniform2f(current->uniform.lens_center, 0.5 + ovrConfig.projOffset * 0.5, 0.5);

	glBindFramebuffer(GL_FRAMEBUFFER,leftDistortion.fbo);

	glBegin(GL_TRIANGLE_STRIP);
	glTexCoord2f(0, 0); glVertex2f(-1, -1);
	glTexCoord2f(0, 1); glVertex2f(-1, 1);
	glTexCoord2f(1, 0); glVertex2f(1, -1);
	glTexCoord2f(1, 1); glVertex2f(1, 1);
	glEnd();

	// draw right eye
	glUniform2f(current->uniform.lens_center, 0.5 - ovrConfig.projOffset * 0.5, 0.5 );

	glBindFramebuffer(GL_FRAMEBUFFER,rightDistortion.fbo);

	glBegin(GL_TRIANGLE_STRIP);
	glTexCoord2f(0, 0); glVertex2f(-1, -1);
	glTexCoord2f(0, 1); glVertex2f(-1, 1);
	glTexCoord2f(1, 0); glVertex2f(1, -1);
	glTexCoord2f(1, 1); glVertex2f(1, 1);
	glEnd();
	glUseProgram(0);

	glBindFramebuffer(GL_FRAMEBUFFER,0);
```

####Example demonstrating using a distortion texture

```
	glUseProgram(current_shader->shader->program);

	glUniform1i(current_shader->uniform.texture,0);
	glUniform1i(current_shader->uniform.distortion,1);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D,left.texture);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D,leftDistortion.texture);

	glBegin(GL_TRIANGLE_STRIP);
	glTexCoord2f(0, 0); glVertex2f(-1, -1);
	glTexCoord2f(0, 1); glVertex2f(-1, 1);
	glTexCoord2f(1, 0); glVertex2f(0, -1);
	glTexCoord2f(1, 1); glVertex2f(0, 1);
	glEnd();

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D,right.texture);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D,rightDistortion.texture);


	glBegin(GL_TRIANGLE_STRIP);
	glTexCoord2f(0, 0); glVertex2f(0, -1);
	glTexCoord2f(0, 1); glVertex2f(0, 1);
	glTexCoord2f(1, 0); glVertex2f(1, -1);
	glTexCoord2f(1, 1); glVertex2f(1, 1);
	glEnd();
	glUseProgram(0);

	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D,0);
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D,0);

```
