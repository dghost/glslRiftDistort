####Directories

- **base**: Stable, Rift SDK compatible versions of the barrel distortion shader
- **experimental**: Experimental optimized shaders

####Files included in each directory
- **barrel.frag**: Fragment shader that performs barrel distortion.
- **barrel_left.geom**: Geometry shader for the left half of the screen.
- **barrel_right.geom**: Geometry shader for the right half of the screen.
- **barrel.geom**: Experimental geometry shader that does both quads in a single call.
- **empty.shdr**: Empty shader to use as the vertex shader.

####Overview
This assumes that the source texture follows normal OpenGL texture coordinate conventions and that (0,0) is the bottom left of the screen and (1,1) is the upper right. It works bygenerating a quad with the texture coordinates inverted along the Y-axis and then re-inverting it after the calculation is complete. Because the distortion should be symmetric along theY-axis it is actually quite likely that this step could be eliminated, but I kept it in for completeness and to maintain conventions with the Rift SDK. There are other optimizations that could be performed too (e.g., the distortion calculations for the w term could be eliminated as it is currently unused) but I will leave that up to you to perform.

The shaders require OpenGL 3.2 / GLSL 1.50+. Earlier versions of OpenGL won't be compatible due to the lack of geometry shaders, but if you calculate the ScreenCenter and LensCenter values yourself it would be easy to modify it for use with regular quads. It was tested on Nvidia hardware (which itself counts for next to nothing, as their shader compiler is the most lax), but it should work fine with other hardware.

In order for the shader to compile correctly it needs to have a vertex shader attached. I have included the file empty.shdr to be used for that purpose. It's really nothing special, but it's there if you need it.

####Uniforms
- ScaleIn matches the variable ScaleIn referenced by the Rift SDK docs.
- Scale matches the variable Scale referenced by the Rift SDK docs. If you want to apply a texture scaling value you should add it to this.
- HmdWarpParam matches the variable HmdWarpParam referenced by the Rift SDK docs. It is equivalent to the DistortionK[] value.
- DistortionOffset matches the viewport shift value that is mentioned in the Rift SDK.


The geometry shader itself generates the LensCenter and ScreenCenter values. At a later date I might update this later to support setting center points for the lenses, or alternatively make a common geometry shader that can be used to draw both without rebinding shaders. Again, the point of this was largely to follow Rift SDK conventionswhile using modern OpenGL.

####Usage

To use:

- Bind the source texture to uniform location warpTexture.
- Bind the output framebuffer.
- Bind values to ScaleIn, Scale, HmdWarpParam, and DistortionOffset.
- Issue a command like glDrawArrays(GL_POINTS, 0, 1) with an empty VAO bound.

Currently, the uniforms have default values that match the values for the Rift DK1, but you should still calculate these separately as they will likely change in future versions of the SDK. 

####Example demonstrating minimal setup using per-eye shaders

```
void cRenderer::stereoWarp(GLuint outFBO, GLuint inTexture)
{
	glBindVertexArray(_nullVAO);
	int tLoc = 0;
	glViewport(0,0,_width,_height);

	glBindFramebuffer(GL_FRAMEBUFFER,outFBO);
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D,inTexture);

	/* bind the shader for the left eye */
	glUseProgram(_leftShaderID);
	tLoc =  glGetUniformLocation(_leftShaderID,"Texture");
	glUniform1i(tLoc,0);
	
	/* set uniforms here */
	tLoc =  glGetUniformLocation(_warpShaderID,"DistortionOffset");
	glUniform1f(tLoc,distortionOffset);
    // etc
    
	glDrawArrays(GL_POINTS, 0, 1);

	/* bind the shader for the right eye */
	glUseProgram(_rightShaderID);
	tLoc =  glGetUniformLocation(_rightShaderID,"Texture");
	glUniform1i(tLoc,0);
	
	/* set uniforms here */
	tLoc =  glGetUniformLocation(_warpShaderID,"DistortionOffset");
	glUniform1f(tLoc,distortionOffset);
    // etc
	
	glDrawArrays(GL_POINTS, 0, 1);

	glBindTexture(GL_TEXTURE_2D,0);
	glBindFramebuffer(GL_FRAMEBUFFER,0);
	glBindVertexArray(0);
}
```

####Example demonstrating minimal setup using experimental single pass shader

```
void cRenderer::stereoWarp(GLuint outFBO, GLuint inTexture)
{
	glBindVertexArray(_nullVAO);
	int tLoc = 0;
	glViewport(0,0,_width,_height);

	glBindFramebuffer(GL_FRAMEBUFFER,outFBO);
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D,inTexture);

	/* bind the shader for entire screen */
	glUseProgram(_warpShaderID);
	tLoc =  glGetUniformLocation(_warpShaderID,"Texture");
	glUniform1i(tLoc,0);
	
	/* set uniforms here */
	tLoc =  glGetUniformLocation(_warpShaderID,"DistortionOffset");
	glUniform1f(tLoc,distortionOffset);
    // etc
    
	glDrawArrays(GL_POINTS, 0, 1);

	glBindTexture(GL_TEXTURE_2D,0);
	glBindFramebuffer(GL_FRAMEBUFFER,0);
	glBindVertexArray(0);
}
```