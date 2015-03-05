
###Overview
These shaders require OpenGL 2.0 / GLSL 1.10+, and are to be used with the mesh-based distortion used in libovr 0.4.x and newer. They have been thoroughly tested in [Quake II VR](https://github.com/q2vr/quake2vr) and have no known compatibility issues.

For more information on how to use these please see the Oculus SDK Developer's Guide.

All shaders support the following features:

* Automatic usage of texture2DLod when available
* Luminance overdrive support (mitigates blur during off->on transition time)
* Enabling or disabling the vignette fade effect
* Variable desaturation (useful for indicating HMD is nearing edge of position tracking)


####Limitations

In order for luminance overdrive to function correctly it needs to be applied *after* any gamma correction or color space transform is performed. Failing to apply these steps in the proper order will result in the wrong amount of correction being applied and can negatively impact the final quality. 

These shaders do not support multisample antialiasing. In order to support that correctly the various calls to texture2D* need to be updated to use texelFetch instead. Doing this in GLSL 1.10 is problematic for a variety of reasons.

####Files

There are two sets of shaders to choose from - uncorrected shaders and shaders that applie chromatic abberation correction. Given that the chromatic abberation is applied to the mesh itself now it requires both vertex + fragment shader support to function correctly.

#####Uncorrected Shaders
| Shader |	Description
|-	|-	|
| `rift.vert` | The absolute bare minimum vertex shader necessary render to the screen. |
| `rift_timewarp.vert` | Vertex shader that uses SDK provided timewarp values |
| `rift.frag` | Bare minimum fragment shader w/o any additional processing |

#####Chromatic Abberation Correction Shaders
| Shader |	Description
|-	|-	|
|`rift_chromatic.vert`	| Vertex shader that supports chromatic abberation correction without timewarp. |
|`rift_chromatic_timewarp.vert`	| Vertex shader that supports both timewarp and chromatic abberation correction. |
| `rift_chromatic.frag`	| Fragment shader that applies chromatic abberation correction. |

####Vertex Attributes
- `Position` : vertex xy position
- `Color` : lerp parameters for vignette fading and timewarp
- `TexCoord` : vertex texture coordinate 
- `TexCoord0` : red texture coordinate for chromatic abberation correction
- `TexCoord1` : green texture coordinate for chromatic abberation correction
- `TexCoord2` : blue texture coordinate for chromatic abberation correction

####Vertex Shader Uniforms
- `EyeToSourceUVScale` : texture scaling value from libovr
- `EyeToSourceUVOffset` : texture offset value from libovr
- `EyeRotationStart` : per-eye timewarp transform matrix from libovr
- `EyeRotationEnd` : per-eye timewarp transform matrix from libovr

####Fragment Shader Uniforms
- `CurrentFrame` - Texture sampler used for sampling the current frame
- `LastFrame` - Texture sampler used for sampling the last frame (only used during luminance overdrive)
- `OverdriveScales` - Values providing control over luminance overdrive. Comes from libovr.
- `InverseResolution` - Only used with luminance overdrive. Needs to be set to vec2(screenwidth, screenheight)^-1.
- `VignetteFade` - Boolean controlling whether vignette fading should be enabled/disabled.
- `Desaturate` - Float controlling how much to desaturate the image. 0.0 disables.

####Usage

See the Oculus SDK Developers Guide for an overview of how to query libovr for the required values, and for a general overview of how it should be used.