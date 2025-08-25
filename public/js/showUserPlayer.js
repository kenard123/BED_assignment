document.addEventListener("DOMContentLoaded", function () {
    const userId = new URLSearchParams(window.location.search).get("user_id");

    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
  
      const playerList = document.getElementById("playerList");
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
        displayItem.className =
          "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
        displayItem.innerHTML = `
          <div class="card">
              <div class="card-body flex-column align-items-center text-center">
              <img src="${classImageSrc}" alt="${player.class}" class="img-fluid mb-3 rounded-3" style="width: 120px; height: 180px;">
                  <h5 class="card-title">${player.name}</h5>
                  <p class="card-text">
                      level: ${player.level} <br>
                      class: ${player.class} <br>
                  </p>
                  <a href="singlePlayerInfo.html?player_id=${player.id}" class="btn btn-primary">View Details</a>
              </div>
          </div>
          `;
        playerList.appendChild(displayItem);
      });
    };
  
    fetchMethod(currentUrl + `/api/user/${userId}/players`, callback);
  });
