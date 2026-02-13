# Shaders

Shared GLSL shader chunks reused across multiple materials using pragma glslify:

```
#pragma glslify: functionName = require('../../shaders/filename.glsl')
```