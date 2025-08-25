document.addEventListener("DOMContentLoaded", function () {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    const getToken = localStorage.getItem("token");

    if (!loggedInUserId) {
        document.getElementById("userprofile").innerHTML = `<p>You're not logged in. Please log in to view your profile.</p>`;
        return;
    }

    const callbackForUserInfo = (responseStatus, responseData) => {
        const userInfo = document.getElementById("userprofile");

        if (responseStatus === 404) {
            userInfo.innerHTML = `<p>${responseData.message}</p>`;
            return;
        }

        userInfo.innerHTML = `
        <div class="container mt-4">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-lg p-4">
                        <div class="card-header bg-primary text-white text-center">
                            <h3>User Profile</h3>
                        </div>
                        <div class="card-body">
                            <p class="card-text">
                                <strong>🆔 User ID:</strong> ${responseData.user_id} <br>
                                <strong>👤 Username:</strong> ${responseData.username} <br>
                                <strong>🔶 Skillpoints:</strong> ${responseData.skillpoints} <br>
                                <strong>📧 Email:</strong> ${responseData.email} <br>
                                <strong>📅 Created On:</strong> ${responseData.created_on} <br>
                                <strong>🔄 Updated On:</strong> ${responseData.updated_on} <br>
                                <strong>🕒 Last Login:</strong> ${responseData.last_login_on} <br>
                            </p>
                        </div>
                        <hr>
                        <div class="text-center">
                        <button class="btn btn-success" onclick="window.location.href='createChallenge.html'">Create Challenge</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // Fetch user profile based on loggedInUserId
    fetchMethod(
        `http://localhost:3000/api/user/${loggedInUserId}`, // Use the logged-in user's ID
        callbackForUserInfo,
        "GET",
        null,
        getToken
    );
});
