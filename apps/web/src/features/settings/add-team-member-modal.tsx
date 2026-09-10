import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, UserPlus, Shield, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTeamMember } from './settings.api';
import { showToast } from '@/lib/swal';

interface AddTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddTeamMemberModal({ open, onClose }: AddTeamMemberModalProps) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('STAFF');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'team'] });
      showToast('Team member added successfully', 'success');
      handleClose();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to add team member.';
      setErrorMsg(message);
    },
  });

  const handleClose = () => {
    setFullName('');
    setEmail('');
    setMobile('');
    setRole('STAFF');
    setPassword('');
    setErrorMsg(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    mutation.mutate({
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      role,
      password,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-[20px] border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Add Team Member</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/10 p-3 text-xs text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="member-name">
              Full Name *
            </label>
            <Input
              id="member-name"
              placeholder="e.g. Ramesh Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="member-email">
              Email Address *
            </label>
            <Input
              id="member-email"
              type="email"
              placeholder="e.g. ramesh@store.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="member-mobile">
              Mobile Number *
            </label>
            <Input
              id="member-mobile"
              type="tel"
              placeholder="e.g. 9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="member-role">
              Access Role *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('STAFF')}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                  role === 'STAFF'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                  <Shield className="h-3.5 w-3.5 text-blue-500" />
                  Staff
                </div>
                <span className="text-[11px] text-muted-foreground mt-1">
                  POS Billing & Customer Records
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                  role === 'ADMIN'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                  <Shield className="h-3.5 w-3.5 text-purple-500" />
                  Admin
                </div>
                <span className="text-[11px] text-muted-foreground mt-1">
                  Purchases, Inventory & Reports
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="member-pass">
              Initial Password *
            </label>
            <Input
              id="member-pass"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Adding...
                </>
              ) : (
                'Add Member'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
