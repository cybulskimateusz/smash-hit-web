precision highp float;

vec3 frostBlur(sampler2D tex, vec2 uv, float blurSize) {
    // Optimized 13-tap blur (instead of 81)
    // Uses weighted samples in a cross + diagonal pattern
    vec3 color = texture2D(tex, uv).rgb * 0.2;

    // Cross pattern (4 samples)
    color += texture2D(tex, uv + vec2(blurSize, 0.0)).rgb * 0.12;
    color += texture2D(tex, uv - vec2(blurSize, 0.0)).rgb * 0.12;
    color += texture2D(tex, uv + vec2(0.0, blurSize)).rgb * 0.12;
    color += texture2D(tex, uv - vec2(0.0, blurSize)).rgb * 0.12;

    // Diagonal pattern (4 samples)
    float diag = blurSize * 0.707;
    color += texture2D(tex, uv + vec2(diag, diag)).rgb * 0.08;
    color += texture2D(tex, uv + vec2(-diag, diag)).rgb * 0.08;
    color += texture2D(tex, uv + vec2(diag, -diag)).rgb * 0.08;
    color += texture2D(tex, uv + vec2(-diag, -diag)).rgb * 0.08;

    return color;
}

#pragma glslify: export(frostBlur)
