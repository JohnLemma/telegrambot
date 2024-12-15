import { useState, useEffect } from 'react';

interface BetHistoryProps {
  userId: string;
}

interface Bet {
  id: number;
  selectedNumbers: number[];
  matches: number;
  prize: number;
  date: string;
}

const BetHistory: React.FC<BetHistoryProps> = ({ userId }) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch bet history from your backend
    // This is a placeholder for now
    const fetchBetHistory = async () => {
      try {
        setLoading(true);
        // Add your API call here
        // const response = await fetch(`/api/bets/${userId}`);
        // const data = await response.json();
        // setBets(data);
      } catch (error) {
        console.error('Error fetching bet history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBetHistory();
  }, [userId]);

  if (loading) {
    return <div>Loading bet history...</div>;
  }

  return (
    <div className="bet-history">
      <h3>Bet History</h3>
      <div className="bet-list">
        {bets.map((bet) => (
          <div key={bet.id} className="bet-item">
            <div className="bet-numbers">
              Numbers: {bet.selectedNumbers.join(', ')}
            </div>
            <div className="bet-details">
              <span>Matches: {bet.matches}</span>
              <span>Prize: {bet.prize}</span>
              <span>Date: {new Date(bet.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {bets.length === 0 && (
          <div className="no-bets">No betting history yet</div>
        )}
      </div>
    </div>
  );
};

export default BetHistory;
