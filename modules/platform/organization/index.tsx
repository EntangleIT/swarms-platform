'use client';

import React, { useMemo, useState } from 'react';
import { Cross, Plus, PlusCircle, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';

const roles = [
  { label: 'List Team roles', value: 'Team roles' },
  { label: 'Owner', value: 'owner' },
  { label: 'Manager', value: 'manager' },
  { label: 'Reader', value: 'reader' }
] as const;
const inviteRoles = roles.slice(1);
export const team = [
  { email: 'gilbertoaceville@gmail.com', role: 'owner' },
  { email: 'sammyfall@gmail.com', role: 'manager' },
  { email: 'tawnytray@gmail.com', role: 'reader' },
  { email: 'lebronguana@gmail.com', role: 'reader' },
  { email: 'diaznunez@gmail.com', role: 'owner' }
];
export default function Organization({ user }: { user: any }) {
  console.log({ user });
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [filterRole, setFilterRole] = useState<string>(roles[0]?.value);
  const [inviteRole, setInviteRole] = useState<string>(
    roles[roles.length - 1]?.value
  );
  const [invites, setInvites] = useState([{ role: 'reader' }]);
  const [userRole, setUserRole] = useState('Reader');

  const allUserRoles = useMemo(
    () =>
      roles
        .filter((role) => role.value !== 'Team roles')
        .map((role) => role.value),
    []
  );

  console.log({ allUserRoles });

  const isMoreInvites = invites.length > 1;
  const inviteButtonText = isMoreInvites ? 'Invite All' : 'Invite';

  function addMoreInvites() {
    setInvites((prevState) => [...prevState, { role: 'reader' }]);
  }

  function removeInvites(index: number) {
    setInvites((prevState) => {
      return prevState.filter((_, i) => i !== index);
    });
  }

  function changeUserRole(role: string) {
    setUserRole(role);
  }

  return (
    <section className="w-full">
      <h2 className="text-3xl font-extrabold sm:text-4xl">Organization</h2>

      <div className="mt-9">
        <div className="flex justify-between">
          <div>
            <h3 className="mb-2 text-xl">All Organizations</h3>
            <span className="text-sm text-muted-foreground">
              Aggregate of organizations involved in
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Input onChange={() => null} placeholder="Search orgs..." />

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-0.5" variant="secondary">
                  <Plus size={20} /> Create
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a new organization</DialogTitle>
                </DialogHeader>
                <form className="mt-2">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={organizationName}
                    className="my-2 w-full"
                    onChange={(value) => {
                      setOrganizationName(value);
                    }}
                  />
                  <DialogFooter className="mt-3 sm:justify-center">
                    <Button type="button" className="w-2/4">
                      Create
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border rounded-md px-4 py-8 text-card-foreground my-8 cursor-pointer hover:opacity-80"></div>
      </div>

      <div className="mt-16">
        <div className="flex justify-between">
          <div>
            <h3 className="mb-2 text-xl">Team</h3>
            <span className="text-muted-foreground text-sm">
              Manage team members and invitation
            </span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-0.5" variant="secondary">
                <Plus size={20} /> Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Invite members by email address</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex gap-2 items-center mt-3 w-full">
                  <p className="w-full">Email</p>
                  <p className="w-2/4">Role</p>
                </div>
                {invites.map((invite, index) => (
                  <div
                    key={`${invite.role}-${index}`}
                    className="flex items-center gap-2 w-full"
                  >
                    <div className="w-full">
                      <label htmlFor="email" className="text-right hidden">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        className="my-2 w-full"
                        placeholder="swarms@example.com"
                        onChange={(value) => {
                          setEmail(value);
                        }}
                      />
                    </div>
                    <div className="w-2/4">
                      <Select
                        onValueChange={(value) => {
                          setInviteRole(value);
                        }}
                        value={inviteRole}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={invite.role} />
                        </SelectTrigger>
                        <SelectContent>
                          {inviteRoles?.map((role) => (
                            <SelectItem key={role.label} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {isMoreInvites && (
                      <X
                        size={20}
                        className="text-primary cursor-pointer"
                        onClick={() => removeInvites(index)}
                      />
                    )}
                  </div>
                ))}
                <DialogFooter className="sm:justify-between mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={addMoreInvites}
                  >
                    <PlusCircle size={15} /> Add more
                  </Button>
                  <Button type="submit" className="w-1/3">
                    {inviteButtonText}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-3 mt-8 mb-4">
          <Input placeholder="Search..." />

          <Select
            onValueChange={(value) => {
              setFilterRole(value);
            }}
            value={filterRole}
          >
            <SelectTrigger className="xl:w-2/4">
              <SelectValue placeholder={filterRole} />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((role) => (
                <SelectItem key={role.label} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between border rounded-md px-4 py-8 text-card-foreground cursor-pointer hover:opacity-80">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 flex justify-center items-center bg-slate-500 text-white rounded-full uppercase">
              {team[0].email.charAt(0)}
            </span>
            <p>{team[0].email}</p>
          </div>
          <div className="relative">
            <div className="border w-28 py-1 text-center rounded-md capitalize">{userRole}</div>
            <ul className="absolute list-none border bg-secondary w-32 flex flex-col items-center rounded-md bottom-8 -right-14">
              {allUserRoles.map((role) => (
                <li
                  onClick={() => setUserRole(role)}
                  className="hover:text-secondary hover:bg-foreground capitalize w-full py-2 text-center"
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>
          <Button>Leave</Button>
        </div>
      </div>
    </section>
  );
}
