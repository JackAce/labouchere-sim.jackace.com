// class MersenneTwister {
//     constructor(seed) {
//         this.N = 624;
//         this.M = 397;
//         this.MATRIX_A = 0x9908b0df;   // constant vector a
//         this.UPPER_MASK = 0x80000000; // most significant w-r bits
//         this.LOWER_MASK = 0x7fffffff; // least significant r bits
//         this.mt = new Array(this.N); // the state vector
//         this.mti = this.N + 1;       // mti==N+1 means mt[N] is not initialized

//         this.init_genrand(seed || Date.now());
//     }

//     // Initialize with a seed
//     init_genrand(s) {
//         this.mt[0] = s >>> 0;
//         for (this.mti = 1; this.mti < this.N; this.mti++) {
//             const prev = this.mt[this.mti - 1] >>> 30;
//             this.mt[this.mti] = (1812433253 * ((this.mt[this.mti - 1] ^ prev) >>> 0) + this.mti) >>> 0;
//         }
//     }

//     // Generate a random number on [0, 0xffffffff]-interval
//     genrand_int32() {
//         let y;
//         const mag01 = [0x0, this.MATRIX_A];

//         if (this.mti >= this.N) { // generate N words at one time
//             let kk;

//             if (this.mti === this.N + 1)  // if init_genrand() has not been called
//                 this.init_genrand(5489);  // a default initial seed is used

//             for (kk = 0; kk < this.N - this.M; kk++) {
//                 y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
//                 this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
//             }
//             for (; kk < this.N - 1; kk++) {
//                 y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
//                 this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
//             }
//             y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
//             this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

//             this.mti = 0;
//         }

//         y = this.mt[this.mti++];

//         // Tempering
//         y ^= (y >>> 11);
//         y ^= (y << 7) & 0x9d2c5680;
//         y ^= (y << 15) & 0xefc60000;
//         y ^= (y >>> 18);

//         return y >>> 0;
//     }

//     // Generate a random number on [0, 1)-real-interval
//     genrand_real1() {
//         return this.genrand_int32() * (1.0 / 4294967296.0);
//     }

//     // Generate a random number on [0, 1) with 53-bit resolution
//     genrand_real2() {
//         const a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
//         return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
//     }
// }

//let isDebug = false;

// function debugLog(logMessage) {
//     if (isDebug) {
//         console.log(logMessage);
//     }
// }

function performSimulation() {
    const wagerType = document.getElementById('wagerType').value;
    const winningUnits = parseInt(document.getElementById('winningUnits').value, 10);
    const startingUnits = parseInt(document.getElementById('startingUnits').value, 10);
    const numberOfTrials = parseInt(document.getElementById('numberOfTrials').value, 10);

    let percentWin = 0.00;

    switch (wagerType) {
      case 'R-0':
        // Roulette Single Zero
        percentWin = 0.5 - (1.0 / 74.0); // True probability
        break;
      case 'R-00':
        // Roulette Double Zero
        percentWin = 0.5 - (1.0 / 38.0); // True probability
        break;
      case 'C-P':
        // Craps Pass Line
        percentWin = 0.5 - (7.0/990.0); // True probability
        break;
      case 'C-DP':
        // Craps Don't Pass Line
        percentWin = 0.5 - (0.01364 / 2.0); // Estimated probability
        break;
      case 'B-P':
        // Baccarat Player Bet
        percentWin = 0.5 - (0.01235 / 2.0); // Estimated probability
        break;
    };

    let successes = 0;
    let failures = 0;
    let betsPlaced = 0;
    let amountWagered = 0.00;
    let totalWinLoss = 0.00;
    
    //let isDebug = numberOfTrials == 1;

    for (let trial = 0; trial < numberOfTrials; trial++) {
        let wagers = Array(winningUnits).fill(1);   // An array of length [winningUnits] with all 1's
        let currentBalance = startingUnits;
        
        //debugLog(wagers);

        while (true) {
            let currentBet = wagers.length > 1 ? wagers[0] + wagers[wagers.length - 1] : wagers[0];

            if (wagers.length === 0) {
                //debugLog('SUCCESS: ' + currentBalance);
                successes++;
                break;
            }
            if (currentBet > currentBalance) {
                //debugLog('FAILURE: ' + currentBet + ' vs. ' + currentBalance);
                failures++;
                break;
            }

            const randomValue = Math.random();
            //const randomValue = mt.genrand_real1();
            betsPlaced++;
            amountWagered += currentBet;

            if (randomValue <= percentWin) {
                currentBalance += currentBet;
                totalWinLoss += currentBet * 1.000;
                wagers.pop();
                wagers.shift();
                //debugLog('WIN:  ' + wagers + ' balance: ' + currentBalance);
            } else {
                currentBalance -= currentBet;
                totalWinLoss -= currentBet * 1.000;
                wagers.push(currentBet);
                //debugLog('LOSS: ' + wagers + ' balance: ' + currentBalance);
            }
        }
    }

    const totalTrials = successes + failures;
    const percentSuccess = ((successes / totalTrials) * 100).toFixed(3);
    const percentWinLoss = ((totalWinLoss / amountWagered) * 100).toFixed(3);

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
    document.getElementById('results').style.display = 'block';
}

//const mt = new MersenneTwister(Date.now()); // Initialize with a seed
