document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("loggedInUserId");

    // If no user is logged in, do nothing
    if (!userId) {
        console.log("No user logged in. Inventory will not be displayed.");
        return; // Stop execution if no user is logged in
    }

    const callbackForInventory = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
    
      const inventory = document.getElementById("inventoryList");
      
      // Ensure responseData is always an array
      const inventoryList = Array.isArray(responseData) ? responseData : [responseData];

      if (responseStatus == 404) {
        console.log("User inventory empty");
        return;
      }

      inventoryList.forEach((userInventory) => {
        const displayItem = document.createElement("div");
        displayItem.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
        displayItem.innerHTML = `
          <div class="card">
          <img src="equipment/${userInventory.equipment_id}.png" class="card-img-top" alt="Equipment Image">
              <div class="card-body">
                  <h5 class="card-title">Inventory ID: ${userInventory.inventory_id}</h5>
                  <p class="card-text">
                      Equipment ID: ${userInventory.equipment_id} <br>
                  </p>
                  <div class = "text-center">
                  <button class="btn btn-primary" onclick="equip(${userInventory.inventory_id})")>Equip</button>
                  </div>
              </div>
          </div>
            `;
        inventory.appendChild(displayItem);
      });
    };
    fetchMethod(currentUrl + `/api/inventory/user/${userId}`, callbackForInventory, "GET", null, localStorage.getItem("token"));
  });
