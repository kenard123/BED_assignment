document.addEventListener("DOMContentLoaded", function () {
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
  
      const userList = document.getElementById("userList");
      responseData.forEach((user) => {
        const displayItem = document.createElement("div");
        displayItem.className =
          "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
        displayItem.innerHTML = `
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">
                      ID: ${user.user_id}
                  </h5>
                  <p class="card-text">
                      Username: ${user.username}
                  </p>
                  <a href="singleUserInfo.html?user_id=${user.user_id}" class="btn btn-primary">View More</a>
              </div>
          </div>
          `;
        userList.appendChild(displayItem);
      });
    };
  
    fetchMethod(currentUrl + "/api/user", callback);
  });