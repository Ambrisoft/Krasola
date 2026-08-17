import { recordUserActivity } from './telemetryTracker';

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Validates binary magic-byte signatures to block disguised executables (.exe, .php, .html)
 */
export async function validateImageMagicBytes(blob) {
  try {
    const buffer = await blob.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // PNG: 89 50 4E 47
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      return { isValid: true, detectedType: 'image/png' };
    }

    // JPEG: FF D8 FF
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      return { isValid: true, detectedType: 'image/jpeg' };
    }

    // WebP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
    if (
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    ) {
      return { isValid: true, detectedType: 'image/webp' };
    }

    // GIF: GIF8 (47 49 46 38)
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
      return { isValid: true, detectedType: 'image/gif' };
    }

    return { isValid: false, detectedType: 'unknown' };
  } catch (e) {
    console.warn("Magic byte inspection error:", e);
    return { isValid: false, detectedType: 'error' };
  }
}

/**
 * Compresses an image file, blob, or URL into modern WebP format with bounding box downscaling.
 */
export async function compressImageToWebP(imageSource, maxDimension = 1920, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let originalSize = 0;
    if (imageSource instanceof Blob || imageSource instanceof File) {
      originalSize = imageSource.size;
      img.src = URL.createObjectURL(imageSource);
    } else if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      return reject(new Error("Invalid image source provided for compression."));
    }

    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Downscale if exceeding max bounding box
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Draw and compress to WebP
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error("Canvas toBlob compression failed."));
        }

        const compressedSize = blob.size;
        const initialSize = originalSize || compressedSize * 2; // estimation if from URL
        const savingsPercent = Math.max(0, Math.round(((initialSize - compressedSize) / initialSize) * 100));
        const savedBytes = Math.max(0, initialSize - compressedSize);

        recordUserActivity({
          category: 'optimization',
          title: 'On-Device WebP Compression',
          description: `Optimized to ${width}×${height} WebP (${formatBytes(compressedSize)}, -${savingsPercent}%)`,
          bytesSaved: savedBytes,
          status: 'success'
        });

        resolve({
          blob,
          dataUrl: canvas.toDataURL('image/webp', quality),
          width,
          height,
          originalSize: initialSize,
          compressedSize,
          savingsPercent,
          mimeType: 'image/webp'
        });
      }, 'image/webp', quality);
    };

    img.onerror = (err) => {
      reject(new Error("Failed to load image for compression."));
    };
  });
}
