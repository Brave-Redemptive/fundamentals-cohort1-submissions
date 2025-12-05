import { describe, it, expect } from 'vitest';
import { formatDate, getPriorityColor, getStatusBadge } from './helpers';

describe('helpers', () => {
  it('formatDate returns friendly date string', () => {
    const out = formatDate('2025-12-05');
    expect(out).toContain('2025');
  });

  it('getPriorityColor returns correct hex for high', () => {
    expect(getPriorityColor('high')).toBe('#dc2626');
    expect(getPriorityColor('medium')).toBe('#f59e0b');
    expect(getPriorityColor('low')).toBe('#10b981');
  });

  it('getStatusBadge returns readable text', () => {
    expect(getStatusBadge('completed')).toMatch(/Completed|Completed/i);
    expect(getStatusBadge('in-progress')).toMatch(/In Progress|In Progress/i);
    expect(getStatusBadge('todo')).toMatch(/To Do|To Do/i);
  });
});
