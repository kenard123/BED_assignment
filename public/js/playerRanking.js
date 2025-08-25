document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/api/topplayers") // Update with your actual backend URL
      .then(response => response.json())
      .then(players => {
          const leaderboard = document.getElementById("leaderboard");
          leaderboard.innerHTML = ""; // Clear existing content

          players.forEach((player, index) => {
              const row = document.createElement("tr");

              // Apply different styles for top 3 ranks
              let rankBadge = "";
              if (index === 0) rankBadge = "🥇"; // Gold
              else if (index === 1) rankBadge = "🥈"; // Silver
              else if (index === 2) rankBadge = "🥉"; // Bronze
              else rankBadge = `#${index + 1}`; // Regular rank

              row.innerHTML = `
                  <td class="text-center">${rankBadge}</td>
                  <td>${player.name}</td>
                  <td>${player.class}</td>
                  <td class="fw-bold">${player.level}</td>
                  <td>${player.armor || "None"}</td>
                  <td>${player.weapon || "None"}</td>
              `;
              leaderboard.appendChild(row);
          });
      })
      .catch(error => console.error("Error fetching leaderboard:", error));
});
