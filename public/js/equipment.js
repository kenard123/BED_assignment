const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const equipmentList = document.getElementById("equipmentList");
    responseData.forEach((equipment) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      displayItem.innerHTML = `
          <div class="card">
          <img src="equipment/${equipment.id}.png" class="card-img-top" alt="Equipment Image">
              <div class="card-body">
                  <h5 class="card-title">ID: ${equipment.id}</h5>
                  <p class="card-text">
                      Name: ${equipment.name} <br>
                      classID: ${equipment.classID} <br>
                      level_required: ${equipment.level_required} <br>
                      HP: ${equipment.hp} <br>
                      ATK: ${equipment.atk} <br>
                      skillpoints: ${equipment.skillpoints} <br>
                  </p>
                  <button class="btn btn-primary" onclick="purchaseEquipment(${equipment.id})">
                  Purchase
                  </button>
              </div>
          </div>
          `;
      equipmentList.appendChild(displayItem);
    });
  };
  
  fetchMethod(currentUrl + "/api/equipment", callback);