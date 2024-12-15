import { useState } from 'react';
import '../styles/SpinWheel.css';

interface WheelSegment {
  id: number;
  value: number;
  color: string;
  degrees: number; // Starting degree of this segment
}

// Create segments with their degree positions
const createWheelSegments = () => {
  const segments: WheelSegment[] = [];
  const segmentSize = 360 / 8; // 8 segments, 45 degrees each
  
  for (let i = 0; i < 8; i++) {
    segments.push({
      id: i + 1,
      value: i,
      color: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEEAD', '#D4A5A5', '#9FA8DA', '#FFD93D'
      ][i],
      degrees: i * segmentSize
    });
  }
  return segments;
};

const wheelSegments = createWheelSegments();

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 8); // 0-7
  };

  const calculateRotationForNumber = (number: number) => {
    const segmentSize = 360 / 8;
    const targetSegment = wheelSegments.find(seg => seg.value === number);
    if (!targetSegment) return 0;
    
    // Calculate how much we need to rotate to align the segment with pointer
    const targetRotation = 360 - targetSegment.degrees;
    return targetRotation;
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedNumber(null);

    // Generate the winning number first
    const winningNumber = generateRandomNumber();
    
    // Calculate rotation needed to land on this number
    const baseRotation = calculateRotationForNumber(winningNumber);
    const extraSpins = 5 * 360; // 5 full rotations
    const totalRotation = rotation + extraSpins + baseRotation;

    setRotation(totalRotation);

    setTimeout(() => {
      setSelectedNumber(winningNumber);
      setIsSpinning(false);
    }, 5000);
  };

  return (
    <div className="wheel-container">
      <div className="wheel-wrapper">
        <div 
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          {wheelSegments.map((segment) => (
            <div
              key={segment.id}
              className="wheel-segment"
              style={{
                transform: `rotate(${segment.degrees}deg)`,
                backgroundColor: segment.color,
              }}
            >
              <span className="segment-content">
                {segment.value}
              </span>
            </div>
          ))}
        </div>
        <div className="wheel-pointer-right" />
      </div>
      <div className="controls">
        <button 
          className="spin-button"
          onClick={handleSpin}
          disabled={isSpinning}
        >
          SPIN
        </button>
        {selectedNumber !== null && (
          <div className="winner">Selected Number: {selectedNumber}</div>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;