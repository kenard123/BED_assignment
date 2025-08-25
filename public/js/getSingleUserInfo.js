document.addEventListener("DOMContentLoaded", function () {
  url = new URL(document.URL);
  const urlParams = url.searchParams;
  const userId = urlParams.get("user_id");
  const getToken = localStorage.getItem("token");

  const callbackForUserInfo = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const userInfo = document.getElementById("userInfo");
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    if (responseStatus == 404) {
      userInfo.innerHTML = `${responseData.message}`;
      return;
    } else if (userId != loggedInUserId) {
      userInfo.innerHTML = "You are not logged in as this user!";
    } else {
      userInfo.innerHTML = `
      <div class="card">
          <div class="card-body d-flex flex-column justify-content-center text-center">
              <p class="card-text">
                  User ID: ${responseData.user_id} <br>
                  Username: ${responseData.username} <br>
                  Skillpoints: ${responseData.skillpoints} <br>
                  Email: ${responseData.email} <br>
                  Created On: ${responseData.created_on} <br>
                  Updated On: ${responseData.updated_on} <br>
                  Last Login On: ${responseData.last_login_on} <br>
              </p>
          </div>
      </div>
  `;
    }
  };

  fetchMethod(currentUrl + `/api/user/${userId}`, callbackForUserInfo, "GET", null, getToken);
});