import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Spinner } from '@/components/ui';
import { useReplies } from '../hooks/useReplies';
import CommentCard from './CommentCard';

interface CommentRepliesProps {
  commentId: string;
  malId: number;
  replyCount: number;
}

export default function CommentReplies({ commentId, malId, replyCount }: CommentRepliesProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const { data: replies, isLoading } = useReplies(commentId, expanded);

  return (
    <div className="mt-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs font-medium text-violet-500 hover:text-violet-400 transition-colors cursor-pointer"
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? t.comments.hideReplies : `${t.comments.showReplies} (${replyCount})`}
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center py-2">
              <Spinner size={16} />
            </div>
          ) : (
            replies?.map((reply) => (
              <CommentCard key={reply._id} comment={reply} malId={malId} isReply />
            ))
          )}
        </div>
      )}
    </div>
  );
}
