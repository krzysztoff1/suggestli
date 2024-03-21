import type { RouterOutput } from "~/server/api/root";
import { ChevronUp, ChevronsUp, Dot } from "lucide-react";
import { useSession } from "next-auth/react";
import { memo } from "react";
import { cn, getRelativeTimeString, throttle, truncate } from "~/lib/utils";
import { api } from "~/trpc/react";

interface SuggestionProps {
  readonly suggestion: RouterOutput["suggestions"]["get"][number];
  readonly boardId: number;
  readonly isPreview: boolean;
}

export const Suggestion = memo(
  ({ suggestion, boardId, isPreview }: SuggestionProps) => {
    const session = useSession();
    const upVoteHandler = api.suggestions.toggleUpVote.useMutation();

    const handleUpVote = throttle(async () => {
      if (session.status !== "authenticated" || isPreview) {
        return;
      }

      const wrapperSelector = `#suggestion-${suggestion.id}`;
      const icon = document.querySelector(`${wrapperSelector} .upvote-icon`);
      const counter = document.querySelector(
        `${wrapperSelector} .upvote-counter`,
      );

      if (icon && counter) {
        if (suggestion.isUpVoted) {
          icon.classList.remove("text-primary");
          counter.textContent = `${(Number(counter.textContent) ?? 0) - 1}`;
        } else {
          icon.classList.add("text-primary");
          counter.textContent = `${(Number(counter.textContent) ?? 0) + 1}`;
        }
      }

      suggestion.isUpVoted = !suggestion.isUpVoted;

      await upVoteHandler.mutateAsync({
        suggestionId: suggestion.id,
        boardId,
      });
    }, 100);

    return (
      <li
        id={`suggestion-${suggestion.id}`}
        className={cn(
          "flex bg-card sm:border-x sm:border-t sm:border-border",
          "sm:first:rounded-t-lg",
          "sm:last:rounded-b-lg sm:last:border-b",
        )}
      >
        <div className="p-2">
          <button
            onClick={handleUpVote}
            className={cn(
              "flex translate-y-2 flex-col items-center justify-center gap-1 rounded-lg p-2",
              { "hover:bg-primary/5": session.status === "authenticated" },
            )}
          >
            {suggestion.isUpVoted ? (
              <ChevronsUp
                size={18}
                className={cn("upvote-icon text-primary transition-transform", {
                  "hover:scale-105": session.status === "authenticated",
                })}
              />
            ) : (
              <ChevronUp
                size={18}
                className={cn("upvote-icon transition-transform", {
                  "hover:scale-105": session.status === "authenticated",
                })}
              />
            )}
            <span className="upvote-counter block text-sm">
              {suggestion.upVotes}
            </span>
          </button>
        </div>
        <div className="flex w-full flex-col pb-4 pr-4 pt-4">
          <strong className="mb-1 block text-lg text-primary">
            {suggestion.title}
          </strong>
          <p className="block text-base">{truncate(suggestion.content)}</p>
          <div className="mt-2 flex items-center justify-start">
            <span className="block text-sm text-foreground/70">
              {suggestion.user?.name ?? "Anonymous"}
            </span>
            <Dot size={18} className="text-foreground/70" />
            <time className="block text-sm text-foreground/70">
              {getRelativeTimeString(suggestion.createdAt, "en-US")}
            </time>
          </div>
        </div>
      </li>
    );
  },
);

Suggestion.displayName = "Suggestion";
