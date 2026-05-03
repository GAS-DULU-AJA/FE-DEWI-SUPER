import { useQuery } from "@tanstack/react-query";
import { getPartnershipQueue, getPartnershipQueueStats } from "../api";
import { useMemo, useState } from "react";
import type { PartnershipQueueItem, QueueFilter } from "../types";

export function useApprovalsQueue() {
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [search, setSearch] = useState("");

  const statsQuery = useQuery({
    queryKey: ["partnership-queue-stats"],
    queryFn: getPartnershipQueueStats,
  });

  const queueQuery = useQuery({
    queryKey: ["partnership-queue"],
    queryFn: getPartnershipQueue,
  });

  const filtered = useMemo(() => {
    let items: PartnershipQueueItem[] = queueQuery.data ?? [];
    if (filter === "high_priority") {
      items = items.filter((i) => i.priority === "urgent" || i.priority === "high");
    } else if (filter === "pending_docs") {
      items = items.filter((i) => i.documentStatus === "pending");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.propertyName.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.requestNo.toLowerCase().includes(q),
      );
    }
    return items;
  }, [queueQuery.data, filter, search]);

  return {
    stats: statsQuery.data,
    items: filtered,
    totalCount: queueQuery.data?.length ?? 0,
    isLoading: queueQuery.isLoading || statsQuery.isLoading,
    filter,
    setFilter,
    search,
    setSearch,
  };
}
