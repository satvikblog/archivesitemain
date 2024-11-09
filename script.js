// Load the Google API client library and initialize it
function loadGAPI() {
    gapi.load('client:auth2', initClient);
}

// Initialize the Google API client with OAuth only
function initClient() {
    gapi.client.init({
        clientId: '1023798265353-5fq1j8vslasd96i8hcrk2m74jp0vf1t7.apps.googleusercontent.com',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: 'https://www.googleapis.com/auth/drive.file'  // Scope for file access on Google Drive
    }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }).catch(error => {
        console.error("Error initializing Google API client:", error);
        alert("Failed to initialize Google API client. Check console for more details.");
    });
}

// Update sign-in status and handle OAuth sign-in if needed
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        console.log("User signed in");
    } else {
        gapi.auth2.getAuthInstance().signIn().catch(error => {
            console.error("Sign-in failed:", error);
            alert("Google Sign-In failed. Please check the console for more details.");
        });
    }
}

// Upload file function
function uploadFile() {
    const fileInput = document.getElementById('fileInput').files[0];
    const fileName = document.getElementById('fileName').value || fileInput.name;

    if (!fileInput) {
        alert("Please select a file to upload.");
        return;
    }

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
    }).catch(error => {
        console.error('Upload failed:', error);
        alert("File upload failed. Please check the console for more details.");
    });
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
