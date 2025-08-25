const challengeListcallback = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  const questList = document.getElementById("challengeCompletedList");
  responseData.forEach((challenge) => {
    const displayItem = document.createElement("div");
    displayItem.className = "col-xl-4 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
    displayItem.innerHTML = `
      <div class="card">
          <div class="card-body">
              <h5 class="card-title">Complete ID: ${challenge.complete_id}</h5>
              <p class="card-text">
                  Challenge ID: ${challenge.challenge_id} <br>
                  Completed: ${challenge.completed} <br>
                  Done date: ${challenge.creation_date} <br>
                  Notes: <span id="notes-${challenge.complete_id}">${challenge.notes}</span> <br>
              </p>
              <button id="edit-notes-${challenge.complete_id}" class="btn btn-primary">Edit Notes</button>
          </div>
      </div>
    `;
    questList.appendChild(displayItem);

    // Add event listener to the edit button
    const editButton = document.getElementById(`edit-notes-${challenge.complete_id}`);
    editButton.addEventListener("click", () => {
      const newNotes = prompt("Edit your notes:", challenge.notes);
    
      if (newNotes !== null) {
        // Update the notes in the DOM
        document.getElementById(`notes-${challenge.complete_id}`).innerText = newNotes;
    
        // Call fetchMethod with "PUT" to update the notes in the database
        const url = `${currentUrl}/api/user/${loggedInUserId}/challenge/${challenge.complete_id}`;
        const data = { notes: newNotes };
    
        // Ensure you're passing the correct method to fetchMethod
        fetchMethod(url, (status, response) => {
          if (status === 204) {
            alert('Notes updated successfully!');
          } else {
            alert('Failed to update notes.');
          }
        }, 'PUT', data);  // Send as PUT request
      }
    });
    
  });
};

const loggedInUserId = localStorage.getItem("loggedInUserId");
fetchMethod(currentUrl + `/api/user/${loggedInUserId}/challenge`, challengeListcallback);
