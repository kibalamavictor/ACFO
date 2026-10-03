import Link from "next/link";
import AdminShell from "@/components/cms/AdminShell";
import { PAGE_DEFS } from "@/lib/cms/pages";
import { getCurrentUser } from "@/lib/cms/session";
import { getSiteContent } from "@/lib/cms/store";
import { getUsers } from "@/lib/cms/users";

const DONUT_COLORS = ["#006838", "#02b702", "#179123", "#a8dca8"];

function ArrowIcon() {
  return (
    <svg
      className="cmsDashArrow"
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function Donut({
  segments,
  size = 190,
  stroke = 22,
  children,
}: {
  segments: { value: number; color: string }[];
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const gap = segments.filter((s) => s.value > 0).length > 1 ? 2.5 : 0;
  let start = 0;

  return (
    <div className="cmsDonut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#eef4ee"
          strokeWidth={stroke * (100 / size)}
        />
        {segments.map((segment, index) => {
          const share = (segment.value / total) * 100;
          const offset = start;
          start += share;
          if (share <= 0) return null;
          const visible = Math.max(share - gap, 0.5);
          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={segment.color}
              strokeWidth={stroke * (100 / size)}
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${visible} ${100 - visible}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
            />
          );
        })}
      </svg>
      <div className="cmsDonutCenter">{children}</div>
    </div>
  );
}

function Gauge({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <svg className="cmsGaugeSvg" viewBox="0 0 200 110" role="img" aria-label={`${clamped}% published`}>
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="#e3ede3"
        strokeWidth="26"
        strokeLinecap="round"
      />
      {clamped > 0 ? (
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#006838"
          strokeWidth="26"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${clamped} 100`}
        />
      ) : null}
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const content = getSiteContent();
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";
  const users = isAdmin ? getUsers() : [];

  const published = content.news.filter((story) => story.published);
  const drafts = content.news.length - published.length;
  const publishedPct = content.news.length
    ? Math.round((published.length / content.news.length) * 100)
    : 0;

  const liveProgrammes = content.programmes.filter((p) => p.published).length;

  const totalItems =
    content.news.length +
    content.programmes.length +
    content.team.length +
    PAGE_DEFS.length;

  const mix = [
    { label: "News stories", value: content.news.length, href: "/admin/news" },
    { label: "Programmes", value: content.programmes.length, href: "/admin/programmes" },
    { label: "Team members", value: content.team.length, href: "/admin/team" },
    { label: "Pages", value: PAGE_DEFS.length, href: "/admin/pages" },
  ];

  const categories = [...content.news.reduce((map, story) => {
    const chip = story.chip || "Uncategorised";
    map.set(chip, (map.get(chip) ?? 0) + 1);
    return map;
  }, new Map<string, number>())]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCategory = categories[0]?.[1] ?? 1;

  const recent = [...content.news]
    .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))
    .slice(0, 5);

  const reach = [...content.programmes]
    .filter((p) => p.target > 0)
    .sort((a, b) => b.reach / b.target - a.reach / a.target)
    .slice(0, 5);

  return (
    <AdminShell title="Dashboard">
      <div className="cmsDash">
        <section className="cmsPanel cmsDashOverview">
          <div className="cmsPanelHead">
            <div>
              <h2>Content Overview</h2>
              <p>A high-level snapshot of your website content</p>
            </div>
          </div>

          <Donut
            segments={mix.map((item, index) => ({
              value: item.value,
              color: DONUT_COLORS[index % DONUT_COLORS.length],
            }))}
          >
            <strong>{totalItems}</strong>
            <span>content items</span>
          </Donut>

          <ul className="cmsDashLegend">
            {mix.map((item, index) => (
              <li key={item.label}>
                <Link href={item.href}>
                  <i style={{ background: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Link className="cmsPanel cmsDashStat" href="/admin/news">
          <div className="cmsDashStatHead">
            <span>News stories</span>
            <ArrowIcon />
          </div>
          <strong>{content.news.length}</strong>
          <p className="cmsDashUp">{published.length} published</p>
        </Link>

        <Link className="cmsPanel cmsDashStat" href="/admin/programmes">
          <div className="cmsDashStatHead">
            <span>Programmes</span>
            <ArrowIcon />
          </div>
          <strong>{content.programmes.length}</strong>
          <p className="cmsDashUp">{liveProgrammes} live on site</p>
        </Link>

        <Link className="cmsPanel cmsDashStat" href="/admin/team">
          <div className="cmsDashStatHead">
            <span>Team members</span>
            <ArrowIcon />
          </div>
          <strong>{content.team.length}</strong>
          <p>Across all categories</p>
        </Link>

        {isAdmin ? (
          <Link className="cmsPanel cmsDashStat" href="/admin/editors">
            <div className="cmsDashStatHead">
              <span>Editors</span>
              <ArrowIcon />
            </div>
            <strong>{users.length}</strong>
            <p>People who can manage the CMS</p>
          </Link>
        ) : (
          <Link className="cmsPanel cmsDashStat" href="/admin/settings">
            <div className="cmsDashStatHead">
              <span>Contact email</span>
              <ArrowIcon />
            </div>
            <strong className="cmsDashSmallValue">{content.settings.email}</strong>
            <p>Shown across the website</p>
          </Link>
        )}

        <section className="cmsPanel cmsDashBarsPanel">
          <div className="cmsPanelHead">
            <div>
              <h2>News by category</h2>
              <p>Where your stories are focused</p>
            </div>
            <Link href="/admin/news" className="cmsDashCorner" aria-label="Manage news">
              <ArrowIcon />
            </Link>
          </div>

          <ul className="cmsDashBars">
            {categories.map(([chip, count]) => (
              <li key={chip}>
                <div className="cmsDashBarMeta">
                  <span>{chip}</span>
                  <strong>{count}</strong>
                </div>
                <div className="cmsDashBarTrack">
                  <i style={{ width: `${Math.round((count / maxCategory) * 100)}%` }} />
                </div>
              </li>
            ))}
            {categories.length === 0 ? <li className="cmsDashEmpty">No stories yet</li> : null}
          </ul>
        </section>

        <section className="cmsPanel cmsDashGauge">
          <div className="cmsPanelHead">
            <div>
              <h2>Publication status</h2>
              <p>Share of news stories live on the site</p>
            </div>
          </div>

          <div className="cmsGaugeWrap">
            <Gauge percent={publishedPct} />
            <div className="cmsGaugeValue">{publishedPct}%</div>
          </div>

          <div className="cmsGaugeStats">
            <div>
              <strong>{published.length}</strong>
              <span>Published</span>
            </div>
            <div>
              <strong>{drafts}</strong>
              <span>Drafts</span>
            </div>
          </div>
        </section>

        <section className="cmsPanel cmsDashTablePanel">
          <div className="cmsPanelHead">
            <div>
              <h2>Recent news</h2>
              <p>Latest stories by date</p>
            </div>
            <Link href="/admin/news" className="cmsDashCorner" aria-label="Manage news">
              <ArrowIcon />
            </Link>
          </div>

          <div className="cmsDashTableWrap">
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
                {recent.map((story) => (
                  <tr key={story.slug}>
                    <td>
                      <div className="cmsRowMedia">
                        <img src={story.photo} alt={story.photoAlt} loading="lazy" />
                        <div>
                          <strong>{story.title}</strong>
                          <p>{story.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cmsChip">{story.chip}</span>
                    </td>
                    <td className="cmsDashDate">{story.date}</td>
                    <td>
                      <span className={story.published ? "cmsStatusOn" : "cmsStatusOff"}>
                        {story.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="cmsRowActions">
                      <Link href={`/admin/news/${story.slug}`}>Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="cmsPanel cmsDashReach">
          <div className="cmsPanelHead">
            <div>
              <h2>Programme reach</h2>
              <p>Progress toward each target</p>
            </div>
          </div>

          <ul className="cmsDashBars">
            {reach.map((programme) => {
              const pct = Math.min(100, Math.round((programme.reach / programme.target) * 100));
              return (
                <li key={programme.id}>
                  <div className="cmsDashBarMeta">
                    <span>{programme.title}</span>
                    <strong>{pct}%</strong>
                  </div>
                  <div className="cmsDashBarTrack">
                    <i style={{ width: `${pct}%` }} />
                  </div>
                  <small>
                    {programme.reach.toLocaleString()} of {programme.target.toLocaleString()}{" "}
                    {programme.targetLabel}
                  </small>
                </li>
              );
            })}
            {reach.length === 0 ? <li className="cmsDashEmpty">No programme targets yet</li> : null}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
