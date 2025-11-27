export const generateAIUrl = (baseUrl: string, features: string[]): string => {
  const cleanBaseUrl = baseUrl.split('?')[0];
  
  if (features.length === 0) return cleanBaseUrl;

  const transformation: string[] = [];
  if (features.includes('bg-remove')) transformation.push('e-bgremove');
  if (features.includes('relight')) transformation.push('e-relight');
  if (features.includes('quality-improve')) transformation.push('e-quality-enhance');

  if (transformation.length > 0) {
    return `${cleanBaseUrl}?tr=${transformation.join(',')}`;
  }
  
  return cleanBaseUrl;
};

export const createFormData = (uri: string): FormData => {
  const formData = new FormData();
  const fileName = uri.split('/').pop() || `profile_${Date.now()}.jpg`;
  const fileType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

  formData.append("file", {
    uri: uri,
    name: fileName,
    type: fileType,
  } as any);
  
  formData.append('fileName', fileName);
  formData.append('useUniqueFileName', 'true');
  formData.append('folder', '/profile-avatars');

  return formData;
};