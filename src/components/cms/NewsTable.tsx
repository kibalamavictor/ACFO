"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CmsNewsStory } from "@/lib/cms/types";

export default function NewsTable({ stories }: { stories: CmsNewsStory[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string>("");

  const remove = async (slug: string) => {
    if (!window.confirm("Delete this story from the website?")) {
      return;
    }
    setBusy(slug);
    await fetch(`/api/cms/news/${slug}`, { method: "DELETE" });
    router.refresh();
    setBusy("");
  };

  const toggle = async (story: CmsNewsStory) => {
    setBusy(story.slug);
    await fetch(`/api/cms/news/${story.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...story, published: !story.published }),
    });
    router.refresh();
    setBusy("");
  };

  if (stories.length === 0) {
    return <p className="cmsEmpty">No stories yet. Add the first update.</p>;
  }

  return (
    <div className="cmsTableWrap">
      <table className="cmsTable">
        <thead>
          <tr>
            <th>Story</th>
            <th>Category</th>
            <th>Date</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {stories.map((story) => (
            <tr key={story.slug}>
              <td>
                <div className="cmsRowMedia">
                  <img src={story.photo} alt="" />
                  <div>
                    <strong>{story.title}</strong>
                    <p>{story.excerpt}</p>
                  </div>
                </div>
              </td>
              <td>
                <span className="cmsChip">{story.chip}</span>
              </td>
              <td>{story.date}</td>
              <td>
                <button
                  className={story.published ? "cmsStatusOn" : "cmsStatusOff"}
                  type="button"
                  disabled={busy === story.slug}
                  onClick={() => void toggle(story)}
                >
                  {story.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="cmsRowActions">
                <Link href={`/admin/news/${story.slug}`}>Edit</Link>
                <button
                  type="button"
                  disabled={busy === story.slug}
                  onClick={() => void remove(story.slug)}
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
