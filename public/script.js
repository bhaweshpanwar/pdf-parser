document.getElementById('uploadBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const statusMessage = document.getElementById('statusMessage');
  const downloadSection = document.getElementById('downloadSection');
  const downloadBtn = document.getElementById('downloadBtn');

  if (!fileInput.files.length) {
    alert('Please select a PDF file first!');
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('pdfFile', file);

  statusMessage.textContent = 'Processing...';
  downloadSection.style.display = 'none';

  try {
    const response = await fetch('/api/v1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors properly
    }

    const data = await response.json();

    if (data.filename) {
      const filename = data.filename;
      const downloadUrl = `/outputs/${filename}`; // Construct the download URL *on the client side*
      downloadBtn.href = downloadUrl;
      downloadBtn.download = filename; // Set the suggested filename for download
      downloadSection.style.display = 'block';
      statusMessage.textContent = ''; // Clear processing message
    } else {
      statusMessage.textContent = 'Error processing file.';
    }
  } catch (error) {
    console.error('Upload failed:', error);
    statusMessage.textContent = 'Failed to upload. ' + error.message; // Display error message
  }
});
