float specularLight(vec3 light, float shininess, float diffuseness, vec3 normal, vec3 eyeVector) {
  vec3 lightVector = normalize(-light);
  vec3 halfVector = normalize(eyeVector + lightVector);

  float NdotL = dot(normal, lightVector);
  float NdotH = dot(normal, halfVector);
  float kDiffuse = max(0.0, NdotL);
  float NdotH2 = NdotH * NdotH;

  float kSpecular = pow(NdotH2, shininess);
  return kSpecular + kDiffuse * diffuseness;
}

#pragma glslify: export(specularLight)