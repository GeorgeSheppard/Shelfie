import { useGetApiRecommendationsId } from "@/api/generated/hooks";

export const useRecommendations = (id?: string) => {
  return useGetApiRecommendationsId(id!, {
    query: {
      enabled: !!id,
      refetchInterval: ({ state }) =>
        state?.data?.recommendations ? false : 30 * 1000,
    },
  });
};
