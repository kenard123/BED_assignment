document.addEventListener("DOMContentLoaded", function () {
    url = new URL(document.URL);
    const urlParams = url.searchParams;
    const playerId = urlParams.get("player_id");

    const callbackForPlayerWeapon = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
    
      const playerWeapon = document.getElementById("playerWeapon");
      
      // Ensure responseData is always an array
      const armorList = Array.isArray(responseData) ? responseData : [responseData];

      if (responseStatus == 404) {
        console.log("User inventory empty");
        return;
      }

      armorList.forEach((playerE) => {
        const displayItem = document.createElement("div");
        displayItem.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
        displayItem.innerHTML = `
          <div class="card">
          <img src="equipment/${playerE.id}.png" class="card-img-top" alt="Equipment Image">
              <div class="card-body">
                  <h5 class="card-title">ID: ${playerE.id}</h5>
                  <p class="card-text">
                      Name: ${playerE.name} <br>
                      classID: ${playerE.classID} <br>
                      level_required: ${playerE.level_required} <br>
                      HP: ${playerE.hp} <br>
                      ATK: ${playerE.atk} <br>
                  </p>
              </div>
          </div>
            `;
        playerWeapon.appendChild(displayItem);
      });
    };
  
    fetchMethod(currentUrl + `/api/player/${playerId}/weapon`, callbackForPlayerWeapon);
  });
