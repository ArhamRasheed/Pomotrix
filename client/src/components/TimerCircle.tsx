interface TimerCircleProps {
  timeLeft: number;
  isBreak: boolean;
  progress: number;
}

export default function TimerCircle({ timeLeft, isBreak, progress }: TimerCircleProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 100;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="relative">
      <svg className="transform -rotate-90 w-64 h-64">
        <circle 
          cx="128" 
          cy="128" 
          r="100" 
          stroke="rgba(0, 255, 65, 0.2)" 
          strokeWidth="8" 
          fill="none"
        />
        <circle 
          cx="128" 
          cy="128" 
          r="100" 
          stroke={isBreak ? "#00d4ff" : "#00ff41"}
          strokeWidth="8" 
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-in-out pulse-glow"
          style={{
            filter: `drop-shadow(0 0 10px ${isBreak ? '#00d4ff' : '#00ff41'})`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl font-bold neon-text">
            {formatTime(timeLeft)}
          </div>
          <div className={`text-lg mt-2 ${isBreak ? 'text-cyan-400' : 'text-green-400'}`}>
            {isBreak ? 'BREAK MODE' : 'FOCUS MODE'}
          </div>
        </div>
      </div>
    </div>
  );
}
