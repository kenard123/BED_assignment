document.addEventListener("DOMContentLoaded", function () {
    url = new URL(document.URL);
    const urlParams = url.searchParams;
    const playerId = urlParams.get("user_id");
  
    const callbackForPlayerInfo = (responseStatus, responseData) => {
      // Map class names to corresponding image paths (updated to match your filenames)
      const classImages = {
        Warrior: "class/1.png",
        Mage: "class/2.png",
        Archer: "class/3.png"
      };
      
      // Get the correct image for the class, or use a default image if not found
      const classImageSrc = classImages[responseData.class] || "images/default.png";

      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
  
      const playerInfo = document.getElementById("playerInfo");
  
      if (responseStatus == 404) {
        playerInfo.innerHTML = `${responseData.message}`;
        return;
      }
  
      playerInfo.innerHTML = `
      <div class="card border-0 rounded-4 p-3">
      <div class="d-flex align-items-center">
        <img src="${classImageSrc}" alt="${responseData.class}" 
            class="rounded-3 border" 
            style="width: 160px; height: 240px; object-fit: cover;">
            
            <div class="ms-3 w-100">
            <h5 class="fw-bold text-primary">${responseData.name}</h5>
            <small><strong>ID:</strong> ${responseData.id}</small>

            <div class="d-flex justify-content-between">
                <small><strong>Class:</strong> ${responseData.class}</small>
                <small><strong>Level:</strong> ${responseData.level}</small>
            </div>

            <div class="d-flex justify-content-between">
                <small><strong>HP:</strong> ${responseData.hp}</small>
                <small><strong>ATK:</strong> ${responseData.atk}</small>
            </div>

            <div class="d-flex justify-content-between">
                <small><strong>Armor:</strong> ${responseData.armor}</small>
                <small><strong>Weapon:</strong> ${responseData.weapon}</small>
            </div>

            <hr class="my-2">
            <small class="text-muted">Created: ${new Date(responseData.created_on).toLocaleDateString()}</small>
        </div>
    </div>
</div>

      `;
    };
  
    fetchMethod(currentUrl + `/api/player/${playerId}`, callbackForPlayerInfo);
  });