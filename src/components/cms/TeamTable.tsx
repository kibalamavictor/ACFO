"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { teamCategories } from "@/data/team";
import type { CmsTeamMember } from "@/lib/cms/types";

export default function TeamTable({ members }: { members: CmsTeamMember[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");

  const remove = async (id: string) => {
    if (!window.confirm("Remove this team member from the website?")) {
      return;
    }
    setBusy(id);
    await fetch(`/api/cms/team/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy("");
  };

  if (members.length === 0) {
    return <p className="cmsEmpty">No team members yet.</p>;
  }

  return (
    <div className="cmsTableWrap">
      <table className="cmsTable">
        <thead>
          <tr>
            <th>Member</th>
            <th>Role</th>
            <th>Category</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="cmsRowMedia">
                  <img src={member.photo} alt="" />
                  <div>
                    <strong>{member.name}</strong>
                    <p>{member.id}</p>
                  </div>
                </div>
              </td>
              <td>{member.title}</td>
              <td>
                {teamCategories.find((item) => item.id === member.category)?.label ??
                  member.category}
              </td>
              <td className="cmsRowActions">
                <Link href={`/admin/team/${member.id}`}>Edit</Link>
                <button
                  type="button"
                  disabled={busy === member.id}
                  onClick={() => void remove(member.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
