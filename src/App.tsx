import { useState, useEffect } from 'react';
import UserPanel from './components/UserPanel';
import './App.css';

interface DrawResult {
  selectedNumbers: number[];
  winningNumbers: number[];
  matches: number;
}

interface Player {
  id: string;
  selectedNumbers: number[];
  betAmount: number;
}

interface GameState {
  totalPot: number;
  players: Player[];
  winners: {
    playerId: string;
    matches: number;
    prize: number;
  }[];
  currentRound: number;
}

function App() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [currentDrawnNumbers, setCurrentDrawnNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null);
  const [balance, setBalance] = useState(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [userId] = useState('USER' + Math.random().toString(36).substr(2, 6));
  const [userPanelOpen, setUserPanelOpen] = useState(false);
  const [timer, setTimer] = useState(30); // Timer state
  const [hasBetPlaced, setHasBetPlaced] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    totalPot: 0,
    players: [],
    winners: [],
    currentRound: 1
  });
  const betAmount = 10; // Fixed bet amount (10 birr)
  const [lastDrawnNumbers, setLastDrawnNumbers] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          const winning = generateWinningNumbers();
          
          if (currentDrawnNumbers.length > 0) {
            setLastDrawnNumbers([...currentDrawnNumbers]);
          }
          
          setCurrentDrawnNumbers([]);
          
          setTimeout(() => {
            setCurrentDrawnNumbers(winning);
            if (gameState.players.length > 0) {
              handleWinningDistribution(winning);
            }
            
            if (hasBetPlaced) {
              setSelectedNumbers([]);
              setHasBetPlaced(false);
            }
            
            setTimeout(() => {
              setLastDrawnNumbers(winning);
              setCurrentDrawnNumbers([]);
            }, 10000);
            
          }, 100);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedNumbers, hasBetPlaced, gameState.players]);

  const generateWinningNumbers = () => {
    const numbers: number[] = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 54) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  };

  const handleNumberSelect = (number: number) => {
    if (hasBetPlaced) return; // Prevent changes if bet is placed
    
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 54; i++) {
      numbers.push(
        <button
          key={i}
          className={`number-button ${selectedNumbers.includes(i) ? 'selected' : ''}`}
          onClick={() => handleNumberSelect(i)}
          disabled={hasBetPlaced || isDrawing || (selectedNumbers.length === 5 && !selectedNumbers.includes(i))}
        >
          {i}
        </button>
      );
    }
    return numbers;
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      setBalance(prev => prev + amount);
      setNotifications(prev => [`Successfully deposited $${amount}`, ...prev].slice(0, 5));
      setDepositAmount('');
      setShowDeposit(false);
    }
  };

  const handleWithdraw = () => {
    // Implement withdrawal logic
  };

  const handleLogout = () => {
    // Implement logout logic
  };

  const handlePlaceBet = () => {
    if (hasBetPlaced) return; // Prevent multiple bets
    
    if (balance < betAmount) {
      setNotifications(prev => ['Insufficient balance', ...prev].slice(0, 5));
      return;
    }

    // Add player bet to the game
    const newPlayer: Player = {
      id: userId,
      selectedNumbers: [...selectedNumbers],
      betAmount: betAmount
    };

    setGameState(prev => ({
      ...prev,
      totalPot: prev.totalPot + betAmount,
      players: [...prev.players, newPlayer]
    }));

    // Deduct bet amount from balance
    setBalance(prev => prev - betAmount);
    setHasBetPlaced(true);
    setNotifications(prev => [`Bet placed: ${betAmount} birr`, ...prev].slice(0, 5));
  };

  const handleWinningDistribution = (winningNumbers: number[]) => {
    const playerResults = gameState.players.map(player => ({
      playerId: player.id,
      matches: player.selectedNumbers.filter(num => winningNumbers.includes(num)).length
    }));

    // Find the highest number of matches
    const maxMatches = Math.max(...playerResults.map(r => r.matches));
    
    // Filter winners (players with highest matches)
    const winners = playerResults.filter(r => r.matches === maxMatches);
    
    // Calculate prize per winner
    const prizePerWinner = gameState.totalPot / winners.length;

    // Update winners with prizes (keep only one winner)
    const winner = {
      ...winners[0],
      prize: prizePerWinner
    };

    // Update game state with single winner
    setGameState(prev => ({
      ...prev,
      winners: [winner], // Keep only the latest winner
      totalPot: 0,
      players: [],
      currentRound: prev.currentRound + 1
    }));

    // Add winnings to winner balance
    if (winner.playerId === userId) {
      setBalance(prev => prev + prizePerWinner);
      setNotifications(prev => [
        `You won ${prizePerWinner.toFixed(2)} birr!`,
        ...prev
      ].slice(0, 5));
    }
  };

  return (
    <div className="app">
      <UserPanel
        userId={userId}
        balance={balance}
        onDeposit={() => setShowDeposit(true)}
        onWithdraw={handleWithdraw}
        onLogout={handleLogout}
        isOpen={userPanelOpen}
        onClose={() => setUserPanelOpen(false)}
      />
      <div className="top-bar">
        <button className="toggle-user-panel" onClick={() => setUserPanelOpen(!userPanelOpen)}>
          <span className="material-icons">
            {userPanelOpen ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>
        <div className="timer-display">
          <span className="material-icons">timer</span>
          <span className="timer-text">Next Draw:</span>
          <span className="timer-number">{timer}s</span>
        </div>
        <div className="top-bar-right">
          <div className="pot-display">
            Total Pot: {gameState.totalPot} birr
          </div>
          <div className="players-count">
            Players: {gameState.players.length}
          </div>
          <div className="balance-box clickable" onClick={() => setShowDeposit(true)}>
            <span className="material-icons">account_balance_wallet</span>
            Deposit
          </div>
          <div className="balance-box">
            Balance: {balance.toFixed(2)} birr
          </div>
        </div>
      </div>

      {showDeposit && (
        <div className="deposit-modal">
          <div className="deposit-content">
            <h2>Deposit Funds</h2>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
            />
            <div className="deposit-buttons">
              <button onClick={handleDeposit}>Deposit</button>
              <button onClick={() => setShowDeposit(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="game-container">
        <div className="game-layout">
          <div className="main-section">
            <div className="numbers-display-container">
              <div className="numbers-section">
                <div className="drawn-numbers">
                  {currentDrawnNumbers.map((number, index) => (
                    <div key={index} className="drawn-number animate-in">
                      {number}
                    </div>
                  ))}
                </div>
                {lastDrawnNumbers.length > 0 && (
                  <div className="last-drawn-numbers">
                    <div className="drawn-numbers small">
                      {lastDrawnNumbers.map((number, index) => (
                        <div 
                          key={index} 
                          className={`drawn-number ${selectedNumbers.includes(number) ? 'matched' : ''}`}
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="number-grid">
              {renderNumbers()}
            </div>

            <div className="controls">
              <button 
                className={`draw-button ${hasBetPlaced ? 'bet-placed' : ''}`}
                onClick={handlePlaceBet}
                disabled={selectedNumbers.length !== 5}
              >
                {hasBetPlaced ? 'Bet Placed' : 'Place Bet'}
              </button>
            </div>
          </div>

          <div className="side-panel">
            <div className="winners-section">
              <h3>Last Winner</h3>
              {gameState.winners.length > 0 && (
                <div className="winner-info">
                  <div className="winner-details">
                    <span className="winner-id">Player #{gameState.winners[0].playerId.slice(-4)}</span>
                    <span className="winner-prize">{gameState.winners[0].prize.toFixed(2)} birr</span>
                  </div>
                  <div className="winner-matches">{gameState.winners[0].matches} matches</div>
                </div>
              )}
            </div>

            <div className="selected-numbers-container">
              {selectedNumbers.map((number, index) => (
                <div key={index} className="drawn-number selected-number">
                  {number}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {drawResult && (
        <div className="results">
          <p>Matches: {drawResult.matches}</p>
        </div>
      )}
    </div>
  );
}

export default App;
