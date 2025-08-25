const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const questList = document.getElementById("questList");
    responseData.forEach((quest) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      displayItem.innerHTML = `
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">Quest ID: ${quest.quests_id}</h5>
                  <p class="card-text">
                      Quest: ${quest.quests} <br>
                      Level Reward: ${quest.level_reward} <br>
                      Level required: ${quest.level_required} <br>
                  </p>
                  <button class="btn btn-primary" onclick="completeQuest(${quest.quests_id}, ${quest.level_reward})">
                  Take Quest
                  </button>
              </div>
          </div>
          `;
      questList.appendChild(displayItem);
    });
  };

  fetchMethod(currentUrl + "/api/quests", callback);
