import React from "react";
import { 
  Trash2, 
  ExternalLink,
  MessageSquare,
  User as UserIcon,
  Loader2,
  AlertCircle,
  Activity
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/Button";
import { useAdmin } from "@/hooks/useAdmin";
import { formatTimeAgo } from "@/lib/utils";

const ContentModeration: React.FC = () => {
  const { posts, actions } = useAdmin();

  if (posts.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
      </div>
    );
  }

  const data = posts.data || [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-8 rounded-full bg-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Security</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl text-foreground">Content <span className="text-muted-foreground/40">Moderation.</span></h1>
        <p className="text-sm font-bold text-muted-foreground">Neutralize policy violations and maintain community standards.</p>
      </div>

      <div className="grid gap-6">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border/50 p-20 text-center bg-card">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-6">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black">All quiet here</h3>
            <p className="text-muted-foreground mt-2 max-w-xs">No pending content requires immediate review.</p>
          </div>
        ) : (
          data.map((post: any) => {
            if (!post) return null;
            return (
              <div key={post.id} className="group relative rounded-[2.5rem] border border-border/50 bg-card p-6 transition-all hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/5 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                  {/* Author HUD */}
                  <div className="flex shrink-0 items-center gap-4 lg:flex-col lg:items-center lg:w-32">
                    <Avatar className="h-16 w-16 rounded-[1.5rem] ring-4 ring-secondary/50 shadow-lg lg:h-20 lg:w-20">
                      <AvatarImage src={post.user?.avatar} className="object-cover" />
                      <AvatarFallback className="bg-violet-500/10 text-violet-600 font-black text-xl">{post.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="lg:text-center min-w-0">
                      <p className="truncate text-sm font-black text-foreground">{post.user?.name}</p>
                      <p className="truncate text-[10px] font-bold text-muted-foreground">@{post.user?.handle}</p>
                    </div>
                  </div>

                  {/* Content Hub */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        Live Post • {formatTimeAgo(post.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl bg-card border border-border/50 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
                          onClick={() => {
                            if(confirm("Expunge this content permanently?")) {
                              actions.deletePost(post.id);
                            }
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-xl bg-card border border-border/50 transition-all active:scale-95">
                          <a href={`/p/${post.id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-secondary/20 p-6 border border-transparent transition-colors group-hover:border-border/50">
                      <p className="text-base font-bold leading-relaxed text-foreground select-all">{post.content}</p>
                    </div>

                    {post.media && post.media.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {post.media.map((m: any, idx: number) => (
                          <div key={idx} className="aspect-square overflow-hidden rounded-[1.25rem] bg-secondary ring-1 ring-border/50">
                            {m.type === 'image' ? (
                              <img src={m.url} alt="Media" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <AlertCircle className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{post.stats?.comments || 0} Discussions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">IDENTITY: {post.user_id?.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContentModeration;