const fs = require('fs-extra');
const path = require('path');

async function copySharpFiles() {
  const sourceRelease = path.join(__dirname, 'node_modules/sharp/build/Release');
  const targetRelease = path.join(__dirname, 'dist/sharp/build/Release');
  
  const sourceVendor = path.join(__dirname, 'node_modules/sharp/vendor/lib');
  const targetVendor = path.join(__dirname, 'dist/sharp/vendor/lib');

  try {
    await fs.ensureDir(targetRelease);
    await fs.ensureDir(targetVendor);
    
    await fs.copy(sourceRelease, targetRelease);
    await fs.copy(sourceVendor, targetVendor);
    
    console.log('Sharp files copied successfully');
  } catch (err) {
    console.error('Error copying Sharp files:', err);
  }
}

copySharpFiles();