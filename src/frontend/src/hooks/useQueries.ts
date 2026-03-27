import type { ExamResult } from "@/backend.d";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetUserResult(username: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ExamResult>({
    queryKey: ["userResult", username],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getExamResult(username);
    },
    enabled: !!actor && !isFetching && !!username,
    retry: 2,
  });
}

export function useGetAllResults() {
  const { actor, isFetching } = useActor();
  return useQuery<ExamResult[]>({
    queryKey: ["allResults"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResults();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitResult() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      username,
      email,
      score,
      totalQuestions,
    }: {
      username: string;
      email: string;
      score: bigint;
      totalQuestions: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitResult(username, email, score, totalQuestions);
    },
  });
}
