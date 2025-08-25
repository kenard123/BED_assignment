// Function to create the overlay div
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  const container = document.createElement('div');

  const loadingText = document.createElement('p');
  loadingText.textContent = 'Loading...';
  loadingText.style.color = '#fff';
  loadingText.style.fontSize = "1.5em";

  // Add CSS animation keyframes
  const style = document.createElement('style');
  style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;

  document.head.appendChild(style);

  const loadingSVG = document.createElement('img');
  loadingSVG.src = 'https://cdn-icons-png.flaticon.com/512/10069/10069167.png';
  loadingSVG.style.width = '50px';
  loadingSVG.style.height = '50px';
  loadingSVG.style.animation = 'spin 1s infinite linear';
  loadingSVG.style.display = 'block';
  loadingSVG.style.margin = 'auto';
  
  container.appendChild(loadingSVG);
  container.appendChild(loadingText);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  return overlay;
}

// Function to remove the overlay div
function removeOverlay(overlay) {
  document.body.removeChild(overlay);
}

//=====================================================================================
// FETCH METHOD
// This function uses the fetch API to make a request to the server.
//=====================================================================================
function fetchMethod(url, callback, method = "GET", data = null, token = null) {

  console.log("fetchMethod: ", url, method, data, token);

  const headers = {};

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  let options = {
    method: method.toUpperCase(),
    headers: headers,
  };

  if (method.toUpperCase() !== "GET" && data !== null) {
    options.body = JSON.stringify(data);
  }

  // Create the overlay
  const overlay = createOverlay();

  fetch(url, options)
    .then((response) => {
      // Remove the overlay
      removeOverlay(overlay);

      if (response.status == 204) {
        callback(response.status, {});
      } else {
        response.json().then((responseData) => callback(response.status, responseData));
      }
    })
    .catch((error) => console.error(`Error from ${method} ${url}:`, error));
}

//=====================================================================================
// JQUERY METHOD
// This function uses the jQuery ajax method to make a request to the server.
//=====================================================================================


//=====================================================================================
// AXIOS METHOD
// This function uses the axios method to make a request to the server.
//=====================================================================================
