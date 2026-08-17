"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getProgrammeHref } from "@/lib/cms/public";
import type { CmsProgramme } from "@/lib/cms/types";

export default function ProgrammeTable({
  programmes,
}: {
  programmes: CmsProgramme[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");

  const remove = async (id: string) => {
    if (!window.confirm("Remove this programme from the website?")) {
      return;
    }
    setBusy(id);
    await fetch(`/api/cms/programmes/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy("");
  };

  const toggle = async (programme: CmsProgramme) => {
    setBusy(programme.id);
    await fetch(`/api/cms/programmes/${programme.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...programme, published: !programme.published }),
    });
    router.refresh();
    setBusy("");
  };

  if (programmes.length === 0) {
    return <p className="cmsEmpty">No programmes yet. Add the first programme.</p>;
  }

  return (
    <div className="cmsTableWrap">
      <table className="cmsTable">
        <thead>
          <tr>
            <th>Programme</th>
            <th>Category</th>
            <th>Reach</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {programmes.map((programme) => (
            <tr key={programme.id}>
              <td>
                <div className="cmsRowMedia">
                  <img src={programme.photo} alt="" />
                  <div>
                    <strong>{programme.title}</strong>
                    <p>{programme.excerpt || programme.body}</p>
                  </div>
                </div>
              </td>
              <td>
                <span className="cmsChip">{programme.category}</span>
              </td>
              <td>{programme.reach.toLocaleString()}</td>
              <td>
                <button
                  className={programme.published ? "cmsStatusOn" : "cmsStatusOff"}
                  type="button"
                  disabled={busy === programme.id}
                  onClick={() => void toggle(programme)}
                >
                  {programme.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="cmsRowActions">
                <Link href={getProgrammeHref(programme.id)} target="_blank">
                  View
                </Link>
                <Link href={`/admin/programmes/${programme.id}`}>Edit</Link>
                <button
                  type="button"
                  disabled={busy === programme.id}
                  onClick={() => void remove(programme.id)}
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
