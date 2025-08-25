document.addEventListener("DOMContentLoaded", function () {
    const createPlayerForm = document.getElementById("createPlayerForm");
  
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
      if (responseStatus == 201) {
        // Reset the form fields
        createPlayerForm.reset();
        // Check if create player was successful
        window.location.href = "profile.html";
      } else {
        alert(responseData.message);
      }
    };
  
    createPlayerForm.addEventListener("submit", function (event) {
      console.log("createPlayerForm.addEventListener");
      event.preventDefault();
  
      const character_name = document.getElementById("createPlayerName").value;
      const character_class = document.getElementById("createPlayerClass").value;
      const loggedInUserId = localStorage.getItem("loggedInUserId");

      if (character_class === "Choose...") {
        alert("Please select Class");
        return;
      }
  
      const data = {
        name: character_name,
        class: character_class,
        user_id: loggedInUserId,
      };
      // 
      fetchMethod( currentUrl + "/api/player", callback, "POST", data, localStorage.getItem("token"));
    });
  });