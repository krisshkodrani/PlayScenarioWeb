import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { feedbackService, FeedbackResponse, DetailLevel } from '@/services/feedbackService';

interface AIFeedbackProps {
  completionReason: string | null;
  status: string;
  objectives: Record<string, any>;
  instanceId?: string;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ completionReason, status, objectives, instanceId }) => {
  const [detail, setDetail] = useState<DetailLevel>('standard');
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!instanceId) return;
    load(detail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceId]);

  const load = async (level: DetailLevel) => {
    if (!instanceId) return;
    setLoading(true);
    setError(null);
    try {
      const force = level === 'deep';
      console.log('AIFeedback: fetching results', { instanceId, level, force });
      const res = await feedbackService.getResults(instanceId, level, force);
      console.log('AIFeedback: results response', { cached: res?.cached, detail_level: res?.detail_level });
      setData(res);
    } catch (e: any) {
      console.error('AIFeedback: failed to load results', { instanceId, level, error: e?.message });
      setError(e?.message || 'Failed to load AI feedback');
    } finally {
      setLoading(false);
    }
  };

  const summaryText = data?.feedback?.summary?.narrative || completionReason ||
    (status === 'won' ? 'Great job! You achieved the objectives.' : 'Scenario completed. Review your approach next time.');

  return (
    <Card className="bg-slate-800 border-slate-700 my-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          AI Analysis
        </CardTitle>
        {instanceId && (
          <div className="flex gap-2">
            {(['short','standard','deep'] as DetailLevel[]).map(l => (
              <Button key={l} size="sm" variant={detail === l ? 'default' : 'secondary'} onClick={() => { setDetail(l); load(l); }}>
                {l}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading && <div className="text-slate-400">Loading feedback…</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && (
          <>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-slate-300 leading-relaxed">{summaryText}</p>
            </div>

            {/* Key events */}
            {data?.feedback?.key_events?.length ? (
              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Key Moments</h4>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {data.feedback.key_events.slice(0, 3).map((e, i) => (
                    <li key={i}><span className="text-slate-400">Turn {e.turn}:</span> {e.title} — {e.consequence}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Relationships */}
            {data?.feedback?.relationships?.characters?.length ? (
              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Relationships</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.feedback.relationships.characters.map((c, i) => (
                    <div key={i} className="p-3 bg-slate-700 rounded">
                      <div className="text-white font-semibold">{c.name}</div>
                      <div className="text-xs text-slate-400">Trust Δ {((c.delta?.trust ?? 0) as number) >= 0 ? '+' : ''}{c.delta?.trust ?? 0}</div>
                      {c.reflection && <div className="text-slate-300 text-sm mt-1">{c.reflection}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Suggestions */}
            {data?.feedback?.suggestions?.next_attempt?.length ? (
              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">What to try next</h4>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {data.feedback.suggestions.next_attempt.map((s, i) => (
                    <li key={i}>{s.strategy}{s.when_to_use ? ` — ${s.when_to_use}` : ''}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Deep dive */}
            {detail === 'deep' && data?.feedback?.deep_dive?.analysis && (
              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Deep Dive</h4>
                <div className="text-slate-300 whitespace-pre-line">{data.feedback.deep_dive.analysis}</div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AIFeedback;
