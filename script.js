// Load the Google API client library and initialize it
function loadGAPI() {
    gapi.load('client:auth2', initClient);
}

// Initialize the Google API client with your credentials
function initClient() {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY',  // Not needed for OAuth, but you can provide it if required
        clientId: '203381975937-ufr719kdv9ngl2of7q2o39f7chpvtqsi.apps.googleusercontent.com',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: 'https://www.googleapis.com/auth/drive.file'
    }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

// Update sign-in status
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        console.log("User signed in");
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

// Upload file function
function uploadFile() {
    const fileInput = document.getElementById('fileInput').files[0];
    const fileName = document.getElementById('fileName').value || fileInput.name;

    if (fileInput) {
        const metadata = {
            name: fileName,
            mimeType: fileInput.type
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', fileInput);

        gapi.client.request({
            path: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/related'
            },
            body: form
        }).then((response) => {
            console.log('File uploaded:', response);
            displayFile(fileName, response.result.id);
        }).catch(error => console.error('Upload failed:', error));
    }
}

// Display uploaded files in the gallery dynamically
function displayFile(fileName, fileId) {
    const fileGallery = document.getElementById('fileGallery');
    const fileCard = document.createElement('div');
    fileCard.classList.add('file-card');
    fileCard.innerHTML = `
        <div class="file-preview">
            <embed src="https://drive.google.com/uc?export=view&id=${fileId}" class="file-content">
        </div>
        <p class="file-name">${fileName}</p>
        <button class="download-btn" onclick="window.open('https://drive.google.com/uc?export=download&id=${fileId}', '_blank')">Download</button>
    `;
    fileGallery.appendChild(fileCard);
}

// Load the Google API client library when the page loads
document.addEventListener("DOMContentLoaded", loadGAPI);
