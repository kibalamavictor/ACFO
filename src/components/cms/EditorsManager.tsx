"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsPublicUser, CmsUserRole } from "@/lib/cms/types";

export default function EditorsManager({
  users,
  currentUserId,
}: {
  users: CmsPublicUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<CmsUserRole>("editor");
  const [busy, setBusy] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  const addEditor = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved("");

    try {
      const response = await fetch("/api/cms/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Could not add this editor.");
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("editor");
      setSaved("Editor added. They can sign in with their email and password.");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not add this editor.",
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Remove this person’s access to the CMS?")) {
      return;
    }

    setBusy(id);
    setError("");
    setSaved("");

    try {
      const response = await fetch(`/api/cms/users/${id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Could not remove this editor.");
      }
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not remove this editor.",
      );
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="cmsRepeater">
      {error ? <p className="cmsBanner cmsBannerError">{error}</p> : null}
      {saved ? <p className="cmsBanner cmsBannerOk">{saved}</p> : null}

      {users.length === 0 ? (
        <p className="cmsEmpty">No editors yet.</p>
      ) : (
        <div className="cmsTableWrap">
          <table className="cmsTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role === "admin" ? "Administrator" : "Editor"}</td>
                  <td className="cmsRowActions">
                    {user.id === currentUserId ? (
                      <span>You</span>
                    ) : (
                      <button
                        type="button"
                        disabled={busy === user.id}
                        onClick={() => void remove(user.id)}
                      >
                        {busy === user.id ? "Removing…" : "Remove"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form className="cmsForm" onSubmit={(event) => void addEditor(event)}>
        <div className="cmsSubcardHead">
          <h3>Add an editor</h3>
        </div>
        <div className="cmsField">
          <small>
            Editors can update pages, news, team, programmes, and settings.
            Administrators can also add or remove other people here.
          </small>
        </div>

        <div className="cmsGrid2">
          <label className="cmsField">
            <span>Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </label>
          <label className="cmsField">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
        </div>

        <div className="cmsGrid2">
          <label className="cmsField">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <label className="cmsField">
            <span>Role</span>
            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value === "admin" ? "admin" : "editor")
              }
            >
              <option value="editor">Editor</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
        </div>

        <div className="cmsActions">
          <button className="cmsBtnLime" type="submit" disabled={saving}>
            {saving ? "Adding…" : "Add editor"}
          </button>
        </div>
      </form>
    </div>
  );
}
