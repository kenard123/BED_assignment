// The function to handle the "Complete" button click
function notCompletedChallenge(challengeId) {
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    if (!loggedInUserId) {
        alert("You must be logged in to complete the challenge.");
        window.location.href = "login.html";
        return;
    }

    // Get the current time in ISO format for the creation_date
    const creationDate = new Date().toISOString().split('T')[0];

    // Data to send to the server
    const data = {
        user_id: loggedInUserId,
        completed: "false", // Mark as completed
        notes: "", // Empty note
        creation_date: creationDate // Set to current date and time
    };

    // URL for the API (assuming the challenge endpoint is `/api/challenge/{challengeId}`)
    const url = `${currentUrl}/api/challenges/${challengeId}`;

    // Callback function to handle the response from the API
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus === 200) {
            alert(`Challenge not completed. 5 skill points awarded.`);
            window.location.href = "challenge.html";
        } else {
            alert(responseData.message || "An error occurred.");
        }
    };

    // Make the API call using your custom fetchMethod
    fetchMethod(url, callback, "POST", data, localStorage.getItem("token"));
}


