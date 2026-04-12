export const handleImageUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف المختار ليس صورة'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Optimization: Max dimensions 1600px for high quality but smaller size
        const MAX_SIZE = 1600;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // If canvas fails, use original base64
          resolve(event.target?.result as string);
          return;
        }

        // Use a white background (especially for PNGs with transparency)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // JPEG format with 0.8 quality is a good balance for text and photos
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to original if image object fails
        resolve(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('فشل قراءة الملف'));
    reader.readAsDataURL(file);
  });
};
