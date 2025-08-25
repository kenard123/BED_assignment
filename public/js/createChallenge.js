document.addEventListener("DOMContentLoaded", function () {
    const createChallengeForm = document.getElementById("createChallengeForm");
  
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
      if (responseStatus == 201) {
        alert('Challenge created successfully! Now back to profile page.')
        // Reset the form fields
        createChallengeForm.reset();
        // Check if create player was successful
        window.location.href = "profile.html";
      } else {
        alert(responseData.message);
      }
    };
  
    createChallengeForm.addEventListener("submit", function (event) {
      console.log("createChallengeForm.addEventListener");
      event.preventDefault();
  
      const userId = localStorage.getItem("loggedInUserId");
      const challenge = document.getElementById('challenge').value;
      const skillpoints = document.getElementById('skillpoints').value;
  
      const data = {
        challenge: challenge,
        user_id: userId,
        skillpoints: parseInt(skillpoints, 10)
    };
      // Perform login request
      fetchMethod( currentUrl + "/api/challenges", callback, "POST", data, localStorage.getItem("token"));
    });
  });