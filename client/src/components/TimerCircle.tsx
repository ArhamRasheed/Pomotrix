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
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full blur-2xl opacity-30" 
           style={{ 
             background: `radial-gradient(circle, ${isBreak ? '#00d4ff' : '#00ff41'}40 0%, transparent 70%)` 
           }}>
      </div>
      
      <svg className="transform -rotate-90 w-64 h-64 relative z-10">
        {/* Background circle */}
        <circle 
          cx="128" 
          cy="128" 
          r="100" 
          stroke="rgba(0, 255, 65, 0.1)" 
          strokeWidth="3" 
          fill="none"
        />
        {/* Secondary background circle */}
        <circle 
          cx="128" 
          cy="128" 
          r="95" 
          stroke="rgba(0, 255, 65, 0.05)" 
          strokeWidth="1" 
          fill="none"
        />
        {/* Progress circle */}
        <circle 
          cx="128" 
          cy="128" 
          r="100" 
          stroke={isBreak ? "#00d4ff" : "#00ff41"}
          strokeWidth="6" 
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-in-out"
          style={{
            filter: `drop-shadow(0 0 15px ${isBreak ? '#00d4ff' : '#00ff41'}) drop-shadow(0 0 30px ${isBreak ? '#00d4ff40' : '#00ff4140'})`
          }}
        />
        {/* Inner decorative circles */}
        <circle 
          cx="128" 
          cy="128" 
          r="85" 
          stroke={isBreak ? "rgba(0, 212, 255, 0.2)" : "rgba(0, 255, 65, 0.2)"} 
          strokeWidth="1" 
          fill="none"
          className="animate-pulse"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center">
          <div className="text-5xl font-bold font-mono tracking-wider" 
               style={{ 
                 color: isBreak ? '#00d4ff' : '#00ff41',
                 textShadow: `0 0 20px ${isBreak ? '#00d4ff' : '#00ff41'}, 0 0 40px ${isBreak ? '#00d4ff40' : '#00ff4140'}`
               }}>
            {formatTime(timeLeft)}
          </div>
          <div className={`text-sm mt-3 font-mono tracking-wider opacity-80 ${isBreak ? 'text-cyan-300' : 'text-green-300'}`}>
            {isBreak ? 'BREAK MODE' : 'FOCUS MODE'}
          </div>
          <div className="text-xs mt-1 opacity-60 text-gray-400 font-mono">
            {Math.round(progress * 100)}% COMPLETE
          </div>
        </div>
      </div>
    </div>
  );
}
