const callback = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  if (responseStatus == 401) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  } else if (responseStatus == 404) {
    return;
  }

  const playerList = document.getElementById("playerList");

  playerList.innerHTML = "";

  responseData.forEach((player) => {
          // Map class names to corresponding image paths (updated to match your filenames)
          const classImages = {
            Warrior: "class/1.png",
            Mage: "class/2.png",
            Archer: "class/3.png"
          };
          
          // Get the correct image for the class, or use a default image if not found
          const classImageSrc = classImages[player.class] || "images/default.png";

    const displayItem = document.createElement("div");
    displayItem.className = "col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
    displayItem.innerHTML = `
          <div class="card">
              <div class="card-body flex-column align-items-center text-center">
              <img src="${classImageSrc}" alt="${player.class}" class="img-fluid mb-3 rounded-3" style="width: 120px; height: 180px;">
                  <h5 class="card-title" id="name-${player.id}">${player.name}</h5>
                  <p class="card-text">
                      Level: ${player.level} <br>
                      Class: ${player.class} <br>
                      HP: ${player.hp} <br>
                      ATK: ${player.atk} <br>
                      Armor ID: ${player.armor_id ?? "None"} <br>
                      Weapon ID: ${player.weapon_id ?? "None"} <br>
                  </p>
                  <button id="edit-name-${player.id}" class="btn btn-primary">Rename</button>
                  <a href="#" class="btn btn-danger" id="delete-${player.id}">Delete</a>
                   <a href="#" class="btn btn-success" id="select-${player.id}">Select</a>
              </div>
          </div>
          `;
    playerList.appendChild(displayItem);

    // Add event listener to the edit button
    const editButton = document.getElementById(`edit-name-${player.id}`);
    editButton.addEventListener("click", () => {
      const newName = prompt("Edit your name:", player.name);
    
      if (newName !== null) {
        // Update the name in the DOM
        document.getElementById(`name-${player.id}`).innerText = newName;
    
        // Call fetchMethod with "PUT" to update the notes in the database
        const url = `${currentUrl}/api/player/${player.id}/name`;
        const data = { name: newName };
    
        // Ensure you're passing the correct method to fetchMethod
        fetchMethod(url, (status, response) => {
          if (status === 204) {
            alert('Player Name updated successfully!');
          } else {
            alert('Failed to update player name.');
          }
        }, 'PUT', data);  // Send as PUT request
      }
    });

    const deleteButton = document.getElementById(`delete-${player.id}`);
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (localStorage.getItem("selectedPlayerId") == player.id) {
        localStorage.removeItem("selectedPlayerId");
      }

      if (confirm("Are you sure you want to delete this player?")) {
        alert("Player deleted successfully.");

      const callbackForDelete = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        window.location.reload();
      };
      fetchMethod(currentUrl + "/api/player/" + player.id, callbackForDelete, 'DELETE', null, localStorage.getItem("token"));
    }
  });

    const selectButton = document.getElementById(`select-${player.id}`);
    selectButton.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.setItem("selectedPlayerId", player.id);

      // Show an alert for success
      alert('Select Player Success!');
    });
  });
};

const loggedInUserId = localStorage.getItem("loggedInUserId");
if (!loggedInUserId) {
  alert("User is not logged in. Redirecting to login page...");
  window.location.href = "login.html";
} else {
  // Fetch players for the logged-in user
  fetchMethod(currentUrl + `/api/user/${loggedInUserId}/players`, callback, "GET", null, localStorage.getItem("token"));
};