// Download utility functions for handling Google Drive downloads

/**
 * Attempts to download a file from Google Drive using multiple methods
 * @param {string} googleDriveFileId - The Google Drive file ID
 * @param {string} filename - Optional filename for the download
 * @returns {Promise<boolean>} - Returns true if download was initiated successfully
 */
export const downloadFromGoogleDrive = async (googleDriveFileId, filename = 'wallpaper') => {
  if (!googleDriveFileId) {
    throw new Error('Google Drive file ID is required');
  }

  const downloadMethods = [
    // Method 1: Direct download URL
    `https://drive.google.com/uc?export=download&id=${googleDriveFileId}`,
    // Method 2: Alternative direct download
    `https://drive.google.com/uc?id=${googleDriveFileId}&export=download`,
    // Method 3: Sharing URL (fallback)
    `https://drive.google.com/file/d/${googleDriveFileId}/view?usp=sharing`
  ];

  try {
    // Try the first method (most reliable)
    const downloadUrl = downloadMethods[0];
    const response = await fetch(downloadUrl, { method: 'HEAD' });
    
    if (response.ok) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }
  } catch (error) {
    console.warn('Primary download method failed, trying fallback:', error);
  }

  // Fallback: Open in new tab
  try {
    const fallbackUrl = downloadMethods[2]; // Sharing URL
    window.open(fallbackUrl, '_blank');
    return true;
  } catch (error) {
    console.error('All download methods failed:', error);
    throw new Error('Unable to initiate download. Please try again.');
  }
};

/**
 * Shows a user-friendly download notification
 * @param {boolean} success - Whether the download was successful
 * @param {string} message - Custom message to show
 */
export const showDownloadNotification = (success, message = '') => {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
    success 
      ? 'bg-green-500 text-white' 
      : 'bg-red-500 text-white'
  }`;
  
  notification.textContent = success 
    ? (message || 'Download started! Check your downloads folder.')
    : (message || 'Download failed. Please try again.');
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

/**
 * Validates if a Google Drive file ID is in the correct format
 * @param {string} fileId - The file ID to validate
 * @returns {boolean} - True if valid format
 */
export const isValidGoogleDriveFileId = (fileId) => {
  if (!fileId || typeof fileId !== 'string') return false;
  // Google Drive file IDs are typically 28 characters long and contain alphanumeric characters
  return /^[a-zA-Z0-9_-]{25,}$/.test(fileId);
};

