import { useEffect, useRef, useState } from 'react';
import type { SynchronizationAlerts, SynchronizationQuery, SynchronizationRules } from '@sarthak/shared';
import { Panel } from '../executive/components';
import { evaluateSynchronizationRules } from './service';
import { AlertTable } from './AlertTable';

export function EscalationPreview({ rules, query }: { rules: SynchronizationRules; query: SynchronizationQuery }) {
  const [draft, setDraft] = useState(rules);
  const [preview, setPreview] = useState<SynchronizationAlerts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  function change(next: SynchronizationRules) { controller.current?.abort(); setLoading(false); setDraft(next); setPreview(null); setError(null); }
  async function evaluate(page = 1) {
    controller.current?.abort();
    const request = new AbortController(); controller.current = request;
    setLoading(true); setError(null); setPreview(null);
    try {
      const result = await evaluateSynchronizationRules({ ...query, page }, draft, request.signal);
      if (!request.signal.aborted) setPreview(result);
    } catch (failure) { if (!request.signal.aborted) setError(failure instanceof Error ? failure.message : 'The escalation preview could not be loaded.'); }
    finally { if (!request.signal.aborted) setLoading(false); }
  }
  return <Panel title="Escalation rules" subtitle="Edit this request-local preview. Changes are not persisted and no notification delivery occurs."><form onSubmit={(event) => { event.preventDefault(); void evaluate(); }}><label className="sync-inline-status"><input type="checkbox" aria-label="Enable escalation preview" checked={draft.enabled} onChange={(event) => change({ ...draft, enabled: event.target.checked })} /> Enable recipient recommendations</label><div className="sync-rule-fields">{draft.thresholds.map((threshold, index) => <label key={threshold.role}>{threshold.role} after hours<input aria-label={`${threshold.role} after hours`} type="number" min={0} max={720} step="any" disabled={index === 0} value={threshold.after_hours} onChange={(event) => change({ ...draft, thresholds: draft.thresholds.map((item, position) => position === index ? { ...item, after_hours: event.target.valueAsNumber } : item) })} /></label>)}</div>
    <details className="chart-details"><summary>Adjust alert severities</summary><div className="sync-rule-fields">{(Object.keys(draft.severity) as (keyof SynchronizationRules['severity'])[]).map((cause) => <label key={cause}>{cause.replaceAll('_', ' ')}<select aria-label={`${cause} severity`} value={draft.severity[cause]} onChange={(event) => change({ ...draft, severity: { ...draft.severity, [cause]: event.target.value as SynchronizationRules['severity'][typeof cause] } })}><option value="information">Information</option><option value="warning">Warning</option><option value="critical">Critical</option></select></label>)}</div></details>
    <div className="sync-preview-actions"><button className="primary-button" type="submit" disabled={loading}>{loading ? 'Evaluating…' : 'Preview escalation'}</button><button className="text-button" type="button" onClick={() => change(rules)}>Reset escalation rules</button><span className="sync-inline-status">CM → JDM → SDM → Super Admin; increasing observation-age thresholds.</span></div></form>
    {loading && <p role="status" className="chart-note">Evaluating escalation preview…</p>}{error && <p className="sync-rule-error" role="alert">{error}</p>}{preview && <div className="sync-preview-result"><p className="chart-note"><strong>Request-local preview results</strong> · {preview.matching_total} primary alerts evaluated with your draft rules.</p><AlertTable alerts={preview} query={query} preview onPage={(page) => { void evaluate(page); }} /></div>}
  </Panel>;
}
