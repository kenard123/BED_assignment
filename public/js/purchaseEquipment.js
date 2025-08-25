// The function to handle the "Complete" button click
function purchaseEquipment(equipmentid, skillpoints) {
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    if (!loggedInUserId) {
        alert("You must be logged in to purchase equipment.");
        window.location.href = "login.html";
        return;
    }

    // Data to send to the server
    const data = {
        user_id: loggedInUserId,
        id: equipmentid
    };

    // URL for the API (assuming the challenge endpoint is `/api/equipment/purchase`)
    const url = `${currentUrl}/api/equipment/purchase`;

    // Callback function to handle the response from the API
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        
        if (responseStatus === 200) {
            alert(`Equipment ID ${id} purchased successful! ${skillpoints} skill points deducted.`);
            window.location.href = "equipment.html";
        } else {
            alert(responseData.message || "An error occurred.");
        }
    };

    // Make the API call using your custom fetchMethod
    fetchMethod(url, callback, "POST", data, localStorage.getItem("token"));
}


