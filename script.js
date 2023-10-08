
document.addEventListener("DOMContentLoaded", function() {
    const fetchRankButton = document.getElementById("fetchRank");
    const playerNameInput = document.getElementById("player_name");
    const regionSelect = document.querySelector("select");
    const apiResponseDiv = document.getElementById("apiResponse");

    fetchRankButton.addEventListener("click", async () => {
        const playerName = playerNameInput.value;
        const region = regionSelect.value;

        if (!playerName || !region) {
            apiResponseDiv.innerText = "Please enter a player name and select a region.";
            return;
        }

        // Show loading spinner and disable button
        fetchRankButton.innerHTML = '<div class="loading-spinner"></div>';
        fetchRankButton.disabled = true;

        try {
            const response = await fetch(`/rank/${playerName}/en/${region}`);
            const result = await response.text();

            apiResponseDiv.innerText = result;
        } catch (error) {
            apiResponseDiv.innerText = "Error fetching the rank. Please try again later.";
        } finally {
            // Restore button's original state
            fetchRankButton.innerHTML = 'Fetch Rank';
            fetchRankButton.disabled = false;
        }
    });
});
