const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const questList = document.getElementById("challengeList");
    responseData.forEach((challenge) => {
      // Create a new div element for each challenge
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-4 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";

      // Set the inner HTML to display challenge details
      displayItem.innerHTML = `
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">Challenge ID: ${challenge.challenge_id}</h5>
                  <p class="card-text">
                      Challenge: ${challenge.challenge} <br>
                      Creator: ${challenge.creator_id} <br>
                      skillpoints reward: ${challenge.skillpoints} <br>
                  </p>
                  <a href="review.html?challenge_id=${challenge.challenge_id}" class="btn btn-success">Review</a>
                  <button class="btn btn-primary" onclick="completeChallenge(${challenge.challenge_id}, ${challenge.skillpoints})">
                  Complete
                  </button>
                  <button class="btn btn-secondary" onclick="notCompletedChallenge(${challenge.challenge_id})">
                  Not Completed
                  </button>
              </div>
          </div>
          `;
      // Append the newly created challenge item to the challenge list container
      questList.appendChild(displayItem);
    });
  };
  
// Fetch challenges from the API and pass the callback function to handle the response
  fetchMethod(currentUrl + "/api/challenges", callback);