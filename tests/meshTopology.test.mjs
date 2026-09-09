import test from 'node:test';
import assert from 'node:assert/strict';
import { NODES, CONNECTIONS, getFloodWaves } from '../src/utils/meshTopology.ts';

for (const sender of NODES) {
  test(`node ${sender.id} reaches every other node once over valid links`, () => {
    const received = new Set([sender.id]);
    let frontier = new Set([sender.id]);
    for (const wave of getFloodWaves(sender.id)) {
      assert.equal(wave.edges.length, wave.receivers.length);
      for (const edge of wave.edges) {
        assert.ok(frontier.has(edge.from), 'only the preceding wave can relay');
        assert.ok(!received.has(edge.to), 'each node receives only once');
        assert.ok(CONNECTIONS[edge.index].includes(edge.from));
        assert.ok(CONNECTIONS[edge.index].includes(edge.to));
        received.add(edge.to);
      }
      assert.deepEqual(wave.receivers, wave.edges.map(edge => edge.to));
      frontier = new Set(wave.receivers);
    }
    assert.deepEqual([...received].sort(), NODES.map(node => node.id).sort());
  });
}
