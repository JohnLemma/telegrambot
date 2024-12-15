import { useEffect, useRef } from 'react';
import './UserPanel.css';

interface UserPanelProps {
  userId: string;
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const UserPanel = ({ userId, balance, onDeposit, onWithdraw, onLogout, isOpen, onClose }: UserPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`user-panel ${isOpen ? 'open' : ''}`} ref={panelRef}>
      <div className="panel-content">
        <div className="user-info">
          <span className="material-icons user-icon">account_circle</span>
          <div className="user-details">
            <h3>User Profile</h3>
            <p className="user-id">ID: {userId}</p>
          </div>
        </div>

        <div className="balance-info">
          <h4>Balance</h4>
          <p>${balance.toFixed(2)}</p>
        </div>

        <div className="panel-buttons">
          <button onClick={onDeposit}>
            <span className="material-icons">add_circle</span>
            Deposit
          </button>
          <button onClick={onWithdraw}>
            <span className="material-icons">remove_circle</span>
            Withdraw
          </button>
          <button className="settings-button">
            <span className="material-icons">settings</span>
            Settings
          </button>
          <button className="logout-button" onClick={onLogout}>
            <span className="material-icons">exit_to_app</span>
            Leave Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPanel; 