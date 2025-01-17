function performSimulation() {
    const wagerType = document.getElementById('wagerType').value;
    const winningUnits = parseInt(document.getElementById('winningUnits').value, 10);
    const startingUnits = parseInt(document.getElementById('startingUnits').value, 10);
    const numberOfTrials = parseInt(document.getElementById('numberOfTrials').value, 10);
    const startDateTime = Date.now();

    let percentWin = 0.00;

    switch (wagerType) {
      case 'R-0':
        // Roulette Single Zero (True probability)
        percentWin = 0.5 - (1.0 / 74.0);
        break;
      case 'R-00':
        // Roulette Double Zero (True probability)
        percentWin = 0.5 - (1.0 / 38.0);
        break;
      case 'C-P':
        // Craps Pass Line (True probability)
        percentWin = 0.5 - (7.0/990.0);
        break;
      case 'C-DP':
        // Craps Don't Pass Line (Estimated probability)
        percentWin = 0.5 - (0.01364 / 2.0);
        break;
      case 'B-P':
        // Baccarat Player Bet (Estimated probability)
        percentWin = 0.5 - (0.01235 / 2.0);
        break;
    };

    let successes = 0;
    let failures = 0;
    let betsPlaced = 0;
    let amountWagered = 0.00;
    let totalWinLoss = 0.00;
    
    for (let trial = 0; trial < numberOfTrials; trial++) {
        // An array of length [winningUnits] with all 1's
        let wagers = Array(winningUnits).fill(1);
        let currentBalance = startingUnits;
        
        while (true) {
            // Calculate the bet. Use only element in the array or the ends.
            let currentBet = wagers.length > 1 ? wagers[0] + wagers[wagers.length - 1] : wagers[0];

            // Short circuit if we succeed or fail the sim
            if (wagers.length === 0) {
                successes++;
                break;
            }
            if (currentBet > currentBalance) {
                failures++;
                break;
            }

            betsPlaced++;
            amountWagered += currentBet;
            const randomValue = Math.random();

            if (randomValue <= percentWin) {
                currentBalance += currentBet;
                totalWinLoss += currentBet * 1.000;
                wagers.pop(); // Remove the bottom of the array
                wagers.shift(); // Remove the top of the array
            } else {
                currentBalance -= currentBet;
                totalWinLoss -= currentBet * 1.000;
                wagers.push(currentBet); // Append to the bottom of the array
            }
        }
    }

    const endDateTime = Date.now();
    const totalTrials = successes + failures;
    const percentSuccess = ((successes / totalTrials) * 100).toFixed(3);
    const percentWinLoss = ((totalWinLoss / amountWagered) * 100).toFixed(3);
    const elapsedTime = endDateTime - startDateTime;

    // Format results
    let resultsCssClass = "num-neg";
    if (totalWinLoss > 0) {
      resultsCssClass = "num-pos";
    }
    else if (totalWinLoss == 0) {
      resultsCssClass = "num-zero";
    }

    document.getElementById('successes').textContent = `${successes.toLocaleString()}`;
    document.getElementById('totalTrials').textContent = `${totalTrials.toLocaleString()}`;
    document.getElementById('percentSuccess').textContent = `${percentSuccess}%`;
    document.getElementById('amountWagered').textContent = `${amountWagered.toLocaleString()}`;
    document.getElementById('totalWinLoss').textContent = `${totalWinLoss.toLocaleString()}`;
    document.getElementById('percentWinLoss').textContent = `${percentWinLoss}%`;
    document.getElementById('percentWinLoss').classList = resultsCssClass;
    document.getElementById('elapsedTime').textContent = `${elapsedTime.toLocaleString()} ms`;
    document.getElementById('results').style.display = 'block';
}
