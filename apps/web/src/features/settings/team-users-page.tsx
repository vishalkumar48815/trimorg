import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/shell/page-container';
import { deleteTeamMember, fetchTeamMembers, updateTeamMemberRole } from './settings.api';
import { AddTeamMemberModal } from './add-team-member-modal';
import type { TeamMember } from './settings.types';

export function TeamUsersPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: members, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['settings', 'team'],
    queryFn: fetchTeamMembers,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'ADMIN' | 'STAFF' }) =>
      updateTeamMemberRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'team'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'team'] });
    },
  });

  const handleRoleChange = (member: TeamMember, newRole: 'ADMIN' | 'STAFF') => {
    if (member.role === newRole || member.role === 'OWNER') return;
    roleMutation.mutate({ id: member.id, role: newRole });
  };

  const handleDelete = (member: TeamMember) => {
    if (member.role === 'OWNER') return;
    if (window.confirm(`Are you sure you want to remove ${member.fullName} from the organization?`)) {
      deleteMutation.mutate(member.id);
    }
  };

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Team & Staff Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage organization members, assign roles, and control access permissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching || isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setModalOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Team Roster Card */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Organization Roster
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {members?.length || 0} active team members
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading roster...</div>
            ) : !members?.length ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No team members found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                      <th className="py-3 px-3">Member</th>
                      <th className="py-3 px-3">Contact</th>
                      <th className="py-3 px-3 text-center">Role</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3">Joined Date</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                              {member.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{member.fullName}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-xs text-muted-foreground">
                          {member.mobile || '-'}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {member.role === 'OWNER' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                              <Shield className="h-3 w-3" /> Owner
                            </span>
                          ) : member.role === 'ADMIN' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                              <Shield className="h-3 w-3" /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                              <Users className="h-3 w-3" /> Staff
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-xs text-muted-foreground">
                          {new Date(member.createdAt).toLocaleDateString('en-IN', {
                            dateStyle: 'medium',
                          })}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          {member.role === 'OWNER' ? (
                            <span className="text-xs text-muted-foreground italic pr-2">
                              Primary Owner
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Role Selector */}
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  handleRoleChange(member, e.target.value as 'ADMIN' | 'STAFF')
                                }
                                disabled={roleMutation.isPending}
                                className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground focus:ring-1 focus:ring-primary"
                              >
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                              </select>

                              {/* Delete Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(member)}
                                disabled={deleteMutation.isPending}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-danger"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddTeamMemberModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PageContainer>
  );
}
