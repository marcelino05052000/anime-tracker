import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useForumReplies } from '../hooks/useForumReplies';
import { Spinner } from '@/components/ui';
import ForumCommentCard from './ForumCommentCard';

interface ForumCommentRepliesProps {
  postId: string;
  commentId: string;
  replyCount: number;
}

export default function ForumCommentReplies({ postId, commentId, replyCount }: ForumCommentRepliesProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const { data: replies, isLoading } = useForumReplies(postId, expanded ? commentId : '');

  return (
    <div className="mt-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-400 transition-colors cursor-pointer"
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? t.forum.comments.hideReplies : t.forum.comments.showReplies} ({replyCount} {t.forum.comments.replies})
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Spinner size={16} />
            </div>
          ) : (
            replies?.map((reply) => (
              <ForumCommentCard
                key={reply._id}
                comment={reply}
                postId={postId}
                isReply
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
