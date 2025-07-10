import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SessionNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  sessionType: 'focus' | 'break';
}

export default function SessionNameDialog({ isOpen, onClose, onSubmit, sessionType }: SessionNameDialogProps) {
  const [sessionName, setSessionName] = useState('');

  const handleSubmit = () => {
    onSubmit(sessionName.trim());
    setSessionName('');
    onClose();
  };

  const handleClose = () => {
    setSessionName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-morphism neon-border bg-black/90 border-green-400/50">
        <DialogHeader>
          <DialogTitle className="text-green-400 font-mono tracking-wider">
            NAME YOUR {sessionType.toUpperCase()} SESSION
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sessionName" className="text-cyan-400 font-mono text-sm">
              Session Name (optional)
            </Label>
            <Input
              id="sessionName"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder={`Enter ${sessionType} session name...`}
              className="mt-2 bg-gray-900/50 border-green-400/30 text-white placeholder-gray-500 font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="cyber-button"
          >
            SKIP
          </Button>
          <Button 
            onClick={handleSubmit}
            className="cyber-button"
          >
            SAVE SESSION
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}