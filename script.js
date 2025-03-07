document.addEventListener("DOMContentLoaded", () => {
    let participants = [];
    let scores = {};
    let battleRecords = [];

    // Add participant function (both judge & competitor)
    document.getElementById("addParticipant").addEventListener("click", () => {
        let name = prompt("Enter your name:");
        if (name) {
            let formattedName = name.trim().toLowerCase();
            if (!participants.some(p => p.toLowerCase() === formattedName)) {
                participants.push(name.trim());
                updateParticipantList();
            }
        }
    });

    function updateParticipantList() {
        let list = document.getElementById("participantList");
        list.innerHTML = "";
        let selectA = document.getElementById("competitorA");
        let selectB = document.getElementById("competitorB");
        selectA.innerHTML = "<option value=''>Select a competitor</option>";
        selectB.innerHTML = "<option value=''>Select a competitor</option>";
        
        participants.forEach(person => {
            let li = document.createElement("li");
            li.textContent = person;
            li.addEventListener("click", () => startQualifying(person));
            list.appendChild(li);

            let optionA = document.createElement("option");
            let optionB = document.createElement("option");
            optionA.value = person;
            optionA.textContent = person;
            optionB.value = person;
            optionB.textContent = person;
            selectA.appendChild(optionA);
            selectB.appendChild(optionB);
        });
    }

    function startQualifying(competitor) {
        if (!participants.includes(competitor)) {
            alert("Competitor not found!");
            return;
        }
        let totalScore = 0;
        let count = 0;
        participants.forEach(judge => {
            if (judge !== competitor) {
                let score = parseFloat(prompt(`${judge}, enter score (0-100) for ${competitor}:`));
                if (!isNaN(score) && score >= 0 && score <= 100) {
                    totalScore += score;
                    count++;
                }
            }
        });
        if (count > 0) {
            let avgScore = (totalScore / count).toFixed(2);
            scores[competitor] = avgScore;
            updateLeaderboard();
        }
    }

    function updateLeaderboard() {
        let board = document.getElementById("leaderboard");
        board.innerHTML = "";
        Object.entries(scores).sort((a, b) => b[1] - a[1]).forEach(([comp, score]) => {
            let li = document.createElement("li");
            li.textContent = `${comp}: ${score}`;
            board.appendChild(li);
        });
    }

    // Battle Mode
    document.getElementById("startBattle").addEventListener("click", () => {
        let compA = document.getElementById("competitorA").value;
        let compB = document.getElementById("competitorB").value;
        
        if (!compA || !compB || compA === compB) {
            alert("Invalid competitors!");
            return;
        }
        
        let votes = { [compA]: 0, [compB]: 0 };
        let voteDetails = [];
        participants.forEach(judge => {
            if (judge !== compA && judge !== compB) {
                let vote = prompt(`${judge}, vote for ${compA} or ${compB}:`);
                if (vote === compA || vote === compB) {
                    votes[vote]++;
                    voteDetails.push(`${judge} voted for ${vote}`);
                }
            }
        });
        let winner = votes[compA] > votes[compB] ? compA : votes[compB] > votes[compA] ? compB : "Tie";
        battleRecords.push({ compA, compB, winner, voteDetails });
        updateBattleHistory();
        alert(`Winner: ${winner}`);
    });

    function updateBattleHistory() {
        let history = document.getElementById("battleHistory");
        history.innerHTML = "";
        battleRecords.forEach((record, index) => {
            let battleEntry = document.createElement("div");
            battleEntry.innerHTML = `<strong>Battle ${index + 1}: ${record.compA} vs ${record.compB}</strong> - Winner: ${record.winner} <button onclick="toggleVoteDetails(${index})">Show Votes</button>`;
            let voteDetailsDiv = document.createElement("div");
            voteDetailsDiv.id = `voteDetails${index}`;
            voteDetailsDiv.style.display = "none";
            voteDetailsDiv.innerHTML = `<ul>${record.voteDetails.map(vote => `<li>${vote}</li>`).join('')}</ul>`;
            battleEntry.appendChild(voteDetailsDiv);
            history.appendChild(battleEntry);
        });
    }

    window.toggleVoteDetails = (index) => {
        let detailsDiv = document.getElementById(`voteDetails${index}`);
        detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
    };
});
