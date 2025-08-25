const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const enemyList = document.getElementById("enemyList");
    responseData.forEach((enemy) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      displayItem.innerHTML = `
          <div class="card">
          <img src="enemies/${enemy.number}.jpg" class="card-img-top" alt="Enemy Image">
              <div class="card-body">
                  <h5 class="card-title">NUMBER: ${enemy.number}</h5>
                  <p class="card-text">
                      Name: ${enemy.name} <br>
                      HP: ${enemy.hp} <br>
                      ATK: ${enemy.atk} <br>
                  </p>
              </div>
          </div>
          `;
      enemyList.appendChild(displayItem);
    });
  };
  
  fetchMethod(currentUrl + "/api/enemy", callback);