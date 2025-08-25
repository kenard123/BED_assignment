// The function to handle the "Complete" button click
function completeQuest(questId, level) {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    const selectedPlayerId = localStorage.getItem("selectedPlayerId");

    if (!loggedInUserId) {
        alert("You must login user and select player to take the quest.");
        window.location.href = "login.html";
        return;
    } else if (!selectedPlayerId) {
        alert("You must select player to take the quest.");
        window.location.href = "profile.html";
        return;
    }

    // Get the current time in ISO format for the creation_date
    const creationDate = new Date().toISOString().split('T')[0];

    // Data to send to the server
    const data = {
        user_id: loggedInUserId,
        player_id: selectedPlayerId,
        creation_date: creationDate // Set to current date and time
    };

    // URL for the API (assuming the quests endpoint is `/api/quests/{challengeId}`)
    const url = `${currentUrl}/api/quests/${questId}`;

    // Callback function to handle the response from the API
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus === 200) {
            alert(`Quest completed! ${level} level awarded.`);
            window.location.href = "quests.html";
        } else {
            alert(responseData.message || "An error occurred.");
        }
    };

    // Make the API call using your custom fetchMethod
    fetchMethod(url, callback, "POST", data, localStorage.getItem("token"));
}


