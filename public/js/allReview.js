document.addEventListener("DOMContentLoaded", function () {
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
  
      const reviewList = document.getElementById("reviewList");
      responseData.forEach((review) => {

        const displayItem = document.createElement("div");
        displayItem.className =
          "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
        displayItem.innerHTML = `
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">NUMBER: ${review.review_id}</h5>
                  <p class="card-text">
                      User ID: ${review.user_id} <br>
                      Challenge ID: ${review.challenge_id} <br>
                      Rating: <span id="rating-${review.review_id}">${review.rating}</span> <i class="bi bi-star-fill" style="color: gold"></i> <br>
                      Review: <span id="review-${review.review_id}">${review.review}</span> <br>
                      Create Time: ${review.created_at} <br>
                  </p>
                  <button id="edit-review-${review.review_id}" class="btn btn-success">Edit</button>
                  <a href="#" class="btn btn-danger" id="delete-${review.review_id}">Delete</a>
              </div>
          </div>
          `;
        reviewList.appendChild(displayItem);

        const editButton = document.getElementById(`edit-review-${review.review_id}`);
        editButton.addEventListener("click", () => {

          if (!loggedInUserId) {
            alert("You must be logged in to edit review");
            window.location.href = "login.html";
            return;
          } else if (Number(loggedInUserId) !== review.user_id) {
            alert("You are not the owner of this review.");
            return;
          } 
          const newRating = prompt("Edit your Rating:", review.rating);
          const newReview = prompt("Edit your review:", review.review);
        
          if (newRating !== null && newReview !== null) {
            
            // Update the notes in the DOM
            document.getElementById(`rating-${review.review_id}`).innerText = newRating;
            document.getElementById(`review-${review.review_id}`).innerText = newReview;
        
            // Call fetchMethod with "PUT" to update the notes in the database
            const url = `${currentUrl}/api/challenges/review/${review.review_id}`;
            const data = { 
              rating: newRating,
              review: newReview
            };
        
            // Ensure you're passing the correct method to fetchMethod
            fetchMethod(url, (status, response) => {
              if (status === 204) {
                alert('Review updated successfully!');
              } else {
                alert('Failed to update review.');
              }
            }, 'PUT', data);  // Send as PUT request
          }
        });

        const deleteButton = document.getElementById(`delete-${review.review_id}`);
        deleteButton.addEventListener("click", (event) => {
          event.preventDefault();

          if (!loggedInUserId) {
            alert("You must be logged in to delete review");
            window.location.href = "login.html";
            return;
          } else if (Number(loggedInUserId) !== review.user_id) {
            alert("You are not the owner of this review.");
            return;
          } 
          if (confirm("Are you sure you want to delete this review?")) {
            alert("Review deleted successfully.");
            // Call the delete function here
            const callbackForDelete = (responseStatus, responseData) => {
              console.log("responseStatus:", responseStatus);
              console.log("responseData:", responseData);
              window.location.reload();
            };
            fetchMethod(currentUrl + `/api/challenges/review/${review.review_id}`, callbackForDelete, 'DELETE', null, localStorage.getItem("token"));
          }
        });
      });
    };
  
    // Fetch challenges reviews from the API and pass the callback function to handle the response
    fetchMethod(currentUrl + `/api/challenges/review`, callback);
  });
