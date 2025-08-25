// The function to handle the "Equip" button click
function equip(inventory_id) {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    const selectedPlayerId = localStorage.getItem("selectedPlayerId");

    if (!loggedInUserId) {
        alert("You must be logged in to complete the challenge.");
        return;
    } else if (!selectedPlayerId) {
        alert("You must select player to wear the equipment.");
        return;
    }

    // Data to send to the server
    const data = {
        user_id: loggedInUserId,
        inventory_id: inventory_id 
    };

    // URL for the API (assuming the challenge endpoint is `/api/challenge/{challengeId}`)
    const url = `${currentUrl}/api/player/${selectedPlayerId}`;

    // Callback function to handle the response from the API
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus === 204) {
            alert(`New Equipment equipped successful!`);
            window.location.href = "inventory.html";
        } else {
            alert(responseData.message || "An error occurred.");
        }
    };

    // Make the API call using your custom fetchMethod
    fetchMethod(url, callback, "PUT", data, localStorage.getItem("token"));
}


