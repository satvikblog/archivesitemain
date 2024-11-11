// File preview function for PDFs and Images
function previewFile(fileId, fileName) {
    const filePreview = document.getElementById(fileId);
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    // Preview logic for images
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        filePreview.src = `https://your-s3-bucket-url/${fileName}`;
    } 
    // Preview logic for PDF
    else if (fileExtension === 'pdf') {
        filePreview.src = `https://your-s3-bucket-url/${fileName}`;
    }
}

// Download file from S3 bucket
function downloadFile(fileName) {
    const url = `https://your-s3-bucket-url/${fileName}`;
    window.open(url, '_blank');
}

// Preview files
previewFile('file1-preview', 'aadhar.png');
previewFile('file2-preview', 'resume.pdf');
previewFile('file3-preview', 'pan.png');
