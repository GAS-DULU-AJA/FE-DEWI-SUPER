import { useQuery } from "@tanstack/react-query";
import { getPartnershipDetail } from "../api";

export function useApprovalDetail(id: string) {
  return useQuery({
    queryKey: ["partnership-detail", id],
    queryFn: () => getPartnershipDetail(id),
    enabled: !!id,
  });
}
