// MarksheetScreen — the Data display slice's pattern: a real data table with
// sort, a search filter, and bulk row-actions, modelled on the One45 marksheet
// (admin/pages/marksOverview2.php) + the bulk-permission grid (groupTable.jsx:
// useSortBy + useRowSelect → onChange). Sort and selection are caller-managed (the
// real react-table v7 shape). Built only from canonical pieces, so the whole grid
// re-skins across all three systems with zero edits — Acuity's minimal app-table
// reality, the legacy _tables.scss skin, or the lowfi dashed sketch, from one
// component + token swap. A bulk "Release" is guarded by a confirm Modal, then the
// flow advances to a summary screen.

import { useMemo, useState } from "react";
import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { MARKS, type MarkRow } from "./data";

export function MarksheetScreen() {
  const { goTo, set } = usePrototypes();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "learner", dir: "asc" });
  const [selected, setSelected] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? MARKS.filter((m) => m.learner.toLowerCase().includes(q)) : MARKS.slice();
    return filtered.sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sort.key];
      const bv = (b as unknown as Record<string, unknown>)[sort.key];
      const cmp =
        typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [query, sort]);

  const onSort = (key: string) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const releasable = selected.filter((id) => MARKS.find((m) => m.id === id)?.status === "Draft");

  function release() {
    const names = releasable
      .map((id) => MARKS.find((m) => m.id === id)?.learner)
      .filter((n): n is string => Boolean(n));
    set("released", names);
    setConfirming(false);
    goTo("done");
  }

  return (
    <Canonical name="Card" title="Internal Medicine — OSCE marksheet">
      <p className="proto__text">
        {MARKS.length} learners. Search to filter, click a column to sort, select rows to release draft
        results to learners.
      </p>

      <Canonical
        name="SearchField"
        placeholder="Filter by learner"
        value={query}
        onChange={(e: { target: { value: string } }) => setQuery(e.target.value)}
      />

      <div className="proto__actions">
        <Canonical name="Button" disabled={releasable.length === 0} onClick={() => setConfirming(true)}>
          Release {releasable.length || ""} selected
        </Canonical>
      </div>

      <Canonical
        name="Table"
        rowKey={(r: MarkRow) => r.id}
        columns={[
          { key: "learner", header: "Learner", sortable: true },
          { key: "year", header: "Year" },
          { key: "score", header: "Score", align: "right", sortable: true },
          {
            key: "status",
            header: "Status",
            cell: (r: MarkRow) =>
              r.status === "Released" ? <Canonical name="Badge">Released</Canonical> : "Draft",
          },
        ]}
        rows={rows}
        sort={sort}
        onSort={onSort}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        empty="No learners match that filter."
      />

      <Canonical
        name="Modal"
        open={confirming}
        title="Release results?"
        icon="checkCircle"
        dismissible
        onClose={() => setConfirming(false)}
        footer={
          <>
            <Canonical name="Button" variant="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </Canonical>
            <Canonical name="Button" onClick={release}>
              Release {releasable.length}
            </Canonical>
          </>
        }
      >
        <p className="proto__text">
          Release {releasable.length} draft result{releasable.length === 1 ? "" : "s"} to learners? They will
          be able to see their scores immediately. Already-released results are unaffected.
        </p>
      </Canonical>
    </Canonical>
  );
}
