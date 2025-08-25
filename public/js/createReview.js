document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const challengeId = urlParams.get("challenge_id");
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const createReviewForm = document.getElementById("createReviewForm");
  
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);

      if (responseStatus == 201) {
        alert("Review created successfully!");
        
        // Reset the form fields
        createReviewForm.reset();
        // Check if create review was successful
        window.location.href = `review.html?challenge_id=${challengeId}`;
      } else {
        alert(responseData.message);
      }
    };
  
    createReviewForm.addEventListener("submit", function (event) {
      console.log("createReviewForm.addEventListener");
      event.preventDefault();

      if (!loggedInUserId) {
        alert("Please log in to create a review.");
        window.location.href = "login.html";
        return;
      }

      const ratingInput = document.querySelector('input[name="rating"]:checked');
      const rating = ratingInput ? ratingInput.value : null;  // Ensure a rating is selected
      const reviewtext = document.getElementById("reviewtext").value;

      if (!rating) {
        alert("Please select a rating.");
        return;
      } 

        // **Check for existing review only when user presses submit**
        fetch(`${currentUrl}/api/challenges/${challengeId}/review`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          if (response.status === 404) {
            console.warn("No existing reviews found, allowing review creation.");
            return []; // Treat as no reviews
          }
          return response.json();
        })
        .then(reviews => {
          if (!Array.isArray(reviews)) {
            console.warn("Unexpected response format, treating as no reviews.");
            reviews = [];
          }

          const userReview = reviews.find(review => review.user_id == Number(loggedInUserId));
          if (userReview) {
            alert("You have already created a review for this challenge.");
            return;
          }
  
      const data = {
        rating: parseInt(rating),
        review: reviewtext,
        user_id: loggedInUserId,
      };

      // Perform login request
      fetchMethod( currentUrl + `/api/challenges/${challengeId}/review`, callback, "POST", data, localStorage.getItem("token"));
    })
    .catch(error => console.error("Error checking review:", error));
    });
  });