const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const classList = document.getElementById("classList");
    responseData.forEach((rpgclass) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-4 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-4";
      displayItem.innerHTML = `
          <div class="card text-center">
          <img src="class/${rpgclass.number}.png" class="card-img-top" alt="Class Image">
              <div class="card-body">
                  <h4 class="card-title">${rpgclass.name}</h4>
                  <p class="card-text">
                      BaseHP: ${rpgclass.basehp} <br>
                      BaseATK: ${rpgclass.baseatk} <br>
                  </p>
              </div>
          </div>
          `;
      classList.appendChild(displayItem);
    });
  };
  // Fetch class from the API and pass the callback function to handle the response
  fetchMethod(currentUrl + "/api/class", callback);