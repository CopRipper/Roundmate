/* RoundMate demo state module.
   Simulated data only — no real sensors, model, notifications or permissions.
   All timestamps are fixed demo-clock times, not device measurements.
   Dual export: CommonJS (tests) + browser global RoundMateState. */
(function () {
  'use strict';

  var SCHEMA_VERSION = 1;
  var TZ = '+08:00'; // fixed demo clock offset; not a facility location claim
  var DEMO_CLOCK = {
    night: '2026-09-18T02:47:00' + TZ,
    day:   '2026-09-18T10:31:00' + TZ
  };

  var WINGS = {
    east: ['301', '302', '303', '305', '306', '307', '308', '309', '310', '311', '312', '313'],
    west: ['401', '402', '403', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417']
  };

  // ---- residents: bilingual display data, the page picks the language ----
  var RESIDENTS = {
    '301': { name: { en: 'Margaret Thompson', cn: '玛格丽特·汤普森' }, age: 84, chips: { en: ["Mid-stage Alzheimer's", 'Fall risk'], cn: ['中期阿尔茨海默', '跌倒风险'] } },
    '302': { name: { en: 'Robert Williams', cn: '罗伯特·威廉姆斯' }, age: 79, chips: { en: ['Type 2 diabetes', 'Stable gait'], cn: ['2 型糖尿病', '步态稳定'] } },
    '303': { name: { en: 'Dorothy Miller', cn: '多萝西·米勒' }, age: 88, chips: { en: ['Late-stage dementia', 'Bed-exit watch'], cn: ['晚期认知症', '离床关注'] } },
    '305': { name: { en: 'James Johnson', cn: '詹姆斯·约翰逊' }, age: 82, chips: { en: ['Post-hip surgery', 'Uses walker'], cn: ['髋关节术后', '使用助行器'] } },
    '306': { name: { en: 'Helen Davis', cn: '海伦·戴维斯' }, age: 86, chips: { en: ['Hypertension', 'Stable'], cn: ['高血压', '稳定'] } },
    '307': { name: { en: 'Ruth Anderson', cn: '露丝·安德森' }, age: 85, chips: { en: ['Mid-stage dementia', 'Fall ×1 in 7 days', 'On anticoagulant'], cn: ['中期认知症', '7 天内跌倒 ×1', '服用抗凝药'] } },
    '308': { name: { en: 'Frank Brown', cn: '弗兰克·布朗' }, age: 81, chips: { en: ["Parkinson's", 'Tremor'], cn: ['帕金森', '震颤'] } },
    '309': { name: { en: 'Evelyn Wilson', cn: '艾芙琳·威尔逊' }, age: 90, chips: { en: ['Late-stage dementia', 'Full assist'], cn: ['晚期认知症', '全护理'] } },
    '310': { name: { en: 'Walter Harris', cn: '沃尔特·哈里斯' }, age: 83, chips: { en: ['CHF', 'Nighttime O₂'], cn: ['心衰', '夜间吸氧'] } },
    '311': { name: { en: 'Doris Clark', cn: '多丽丝·克拉克' }, age: 87, chips: { en: ['Mild cognitive impairment'], cn: ['轻度认知障碍'] } },
    '312': { name: { en: 'Harold Lewis', cn: '哈罗德·刘易斯' }, age: 78, chips: { en: ['Post-stroke', 'Left-side weakness'], cn: ['中风后', '左侧无力'] } },
    '313': { name: { en: 'Betty Walker', cn: '贝蒂·沃克' }, age: 84, chips: { en: ['Arthritis', 'Stable'], cn: ['关节炎', '稳定'] } },
    '401': { name: { en: 'George Hall', cn: '乔治·霍尔' }, age: 85, chips: { en: ['Memory care', 'Wander risk'], cn: ['记忆照护', '游走风险'] } },
    '402': { name: { en: 'Mildred Young', cn: '米尔德丽德·扬' }, age: 89, chips: { en: ['Osteoporosis', 'Fall risk'], cn: ['骨质疏松', '跌倒风险'] } },
    '403': { name: { en: 'Arthur King', cn: '亚瑟·金' }, age: 80, chips: { en: ['COPD', 'Nighttime O₂'], cn: ['慢阻肺', '夜间吸氧'] } },
    '405': { name: { en: 'Florence Wright', cn: '弗洛伦丝·赖特' }, age: 86, chips: { en: ['Early dementia', 'Stable'], cn: ['早期认知症', '稳定'] } },
    '406': { name: { en: 'Clarence Scott', cn: '克拉伦斯·斯科特' }, age: 82, chips: { en: ['Diabetes', 'Neuropathy'], cn: ['糖尿病', '神经病变'] } },
    '407': { name: { en: 'Ida Green', cn: '艾达·格林' }, age: 91, chips: { en: ['Late-stage dementia', 'Full assist'], cn: ['晚期认知症', '全护理'] } },
    '408': { name: { en: 'Norman Baker', cn: '诺曼·贝克' }, age: 79, chips: { en: ['Stable', 'Independent'], cn: ['稳定', '可自理'] } },
    '409': { name: { en: 'Gladys Adams', cn: '格拉迪斯·亚当斯' }, age: 84, chips: { en: ['Heart failure', 'Daily weight check'], cn: ['心力衰竭', '每日测体重'] } },
    '410': { name: { en: 'Roy Nelson', cn: '罗伊·尼尔森' }, age: 83, chips: { en: ['Restless sleep', 'Low-priority watch'], cn: ['睡眠不安稳', '低优先级关注'] } },
    '411': { name: { en: 'Hazel Carter', cn: '黑兹尔·卡特' }, age: 87, chips: { en: ['Mid-stage dementia', 'Sundowning'], cn: ['中期认知症', '日落综合征'] } },
    '412': { name: { en: 'Stanley Murphy', cn: '斯坦利·墨菲' }, age: 81, chips: { en: ['Post-knee replacement'], cn: ['膝关节置换术后'] } },
    '413': { name: { en: 'Mae Rivera', cn: '梅·里维拉' }, age: 85, chips: { en: ['Anxiety', 'Night reassurance checks'], cn: ['焦虑', '夜间安抚巡查'] } },
    '414': { name: { en: 'Chester Foster', cn: '切斯特·福斯特' }, age: 88, chips: { en: ['Memory care', 'Wander risk'], cn: ['记忆照护', '游走风险'] } },
    '415': { name: { en: 'Edith Brooks', cn: '伊迪丝·布鲁克斯' }, age: 82, chips: { en: ['Stable', 'Bathroom routine ~23:30'], cn: ['稳定', '约 23:30 规律起夜'] } },
    '416': { name: { en: 'Vera Powell', cn: '薇拉·鲍威尔' }, age: 86, chips: { en: ['Osteoarthritis', 'Stable'], cn: ['骨关节炎', '稳定'] } },
    '417': { name: { en: 'Earl Simmons', cn: '厄尔·西蒙斯' }, age: 84, chips: { en: ['Early dementia', 'Stable'], cn: ['早期认知症', '稳定'] } }
  };

  // ---- helpers ----
  function parse(s) { return new Date(s).getTime(); }
  function iso(ms) { return new Date(ms + 8 * 3600 * 1000).toISOString().slice(0, 19) + TZ; }
  function nextAt(state) { return iso(parse(state.clock) + 60000); }

  function sensor(id, connection, quality, lastSeenAt, limitation) {
    var s = {
      id: id, connection: connection, quality: quality,
      lastSeenAt: lastSeenAt, source: 'simulated-sensor'
    };
    if (limitation) s.limitation = limitation;
    return s;
  }

  function seedSensors(roomId, shift, clock) {
    var seen = iso(parse(clock) - 30000);
    if (roomId === '310') {
      var last = shift === 'night' ? '2026-09-17T23:14:00' + TZ : '2026-09-18T09:47:00' + TZ;
      return [sensor('bed', 'offline', 'unknown', last), sensor('pir', 'offline', 'unknown', last), sensor('ir', 'offline', 'unknown', last)];
    }
    if (roomId === '307') {
      return [sensor('bed', 'online', 'usable', seen), sensor('pir', 'online', 'usable', seen),
              sensor('ir', 'online', 'limited', seen, 'possible-blind-spot')];
    }
    return [sensor('bed', 'online', 'usable', seen), sensor('pir', 'online', 'usable', seen), sensor('ir', 'online', 'usable', seen)];
  }

  function seedNotes(roomId, shift) {
    if (roomId === '303' && shift === 'night') {
      return [{
        text: { en: 'Assisted back to bed after the 01:12 alert — settled since', cn: '01:12 告警后已协助回床——之后平稳' },
        author: 'caregiver-demo', at: '2026-09-18T01:20:00' + TZ, source: 'simulated-human-note'
      }];
    }
    if (roomId === '303' && shift === 'day') {
      return [{
        text: { en: 'Redirected from the exit door twice this morning — settled now', cn: '今晨两次走向门口，已劝回——目前平稳' },
        author: 'caregiver-demo', at: '2026-09-18T10:05:00' + TZ, source: 'simulated-human-note'
      }];
    }
    return [];
  }

  // watch reasons shown on S1/S7, from simulated sensor summaries
  var WATCH = {
    night: {
      '303': { en: '3 bed-exits tonight (her usual: 1) · last return 01:48', cn: '今晚离床 3 次（平常 1 次）· 上次回床 01:48' },
      '411': { en: 'Sundowning restlessness · 2 bed-exits · currently in bed', cn: '日落综合征躁动 · 离床 2 次 · 目前在床' }
    },
    day: {
      '303': { en: 'Wandered toward the exit door twice this morning', cn: '今晨两次走向门口' },
      '411': { en: 'Agitated during lunch · settled after one-on-one time', cn: '午餐时躁动 · 一对一陪伴后平稳' }
    }
  };

  function histEntry(id, type, actor, at, note, refId) {
    var h = { id: id, type: type, actor: actor, at: at, note: note || '' };
    if (refId) h.refId = refId;
    return h;
  }

  function resolvedEvent(id, roomId, shift, occurredAt, hist, observation) {
    return {
      id: id, roomId: roomId, shift: shift, occurredAt: occurredAt,
      status: 'resolved', observation: observation, support: null, history: hist
    };
  }

  function seedEvents(shift) {
    var events = {};
    if (shift === 'night') {
      events['night-415'] = resolvedEvent('night-415', '415', 'night', '2026-09-17T23:40:00' + TZ, [
        histEntry('n415-t', 'TRIGGER', 'system', '2026-09-17T23:39:50' + TZ, { en: 'Bed-exit triggered, then no movement', cn: '离床感应触发，随后无移动信号' }),
        histEntry('n415-a', 'ALERT', 'ai', '2026-09-17T23:40:00' + TZ, { en: 'Low-priority alert issued (simulated inference)', cn: '发布低级告警（模拟推断）' }),
        histEntry('n415-1', 'ACK', 'caregiver-demo', '2026-09-17T23:42:00' + TZ),
        histEntry('n415-2', 'ARRIVE', 'caregiver-demo', '2026-09-17T23:44:00' + TZ),
        histEntry('n415-3', 'OBSERVE', 'caregiver-demo', '2026-09-17T23:45:00' + TZ, { en: 'Resident up for the bathroom', cn: '老人起夜' }),
        histEntry('n415-4', 'COMPLETE', 'caregiver-demo', '2026-09-17T23:46:00' + TZ, { en: 'Assisted back to bed; settled', cn: '已协助回床，平稳' })
      ], { en: 'Resident up for the bathroom', cn: '老人起夜' });
      events['night-303'] = resolvedEvent('night-303', '303', 'night', '2026-09-18T01:12:00' + TZ, [
        histEntry('n303-t', 'TRIGGER', 'system', '2026-09-18T01:10:40' + TZ, { en: 'Bed-exit triggered, then no movement', cn: '离床感应触发，随后无移动信号' }),
        histEntry('n303-a', 'ALERT', 'ai', '2026-09-18T01:12:00' + TZ, { en: 'Medium-priority alert issued (simulated inference)', cn: '发布中级告警（模拟推断）' }),
        histEntry('n303-1', 'ACK', 'caregiver-demo', '2026-09-18T01:14:00' + TZ),
        histEntry('n303-2', 'ARRIVE', 'caregiver-demo', '2026-09-18T01:16:00' + TZ),
        histEntry('n303-3', 'OBSERVE', 'caregiver-demo', '2026-09-18T01:17:00' + TZ, { en: 'Found sitting by the bed, uninjured', cn: '发现坐在床边，无外伤' }),
        histEntry('n303-4', 'COMPLETE', 'caregiver-demo', '2026-09-18T01:20:00' + TZ, { en: 'Assisted back to bed', cn: '已协助回床' })
      ], { en: 'Found sitting by the bed, uninjured', cn: '发现坐在床边，无外伤' });
      events['night-307'] = {
        id: 'night-307', roomId: '307', shift: 'night',
        occurredAt: '2026-09-18T02:47:00' + TZ,
        status: 'new', observation: null, support: null,
        history: [
          histEntry('n307-t', 'TRIGGER', 'system', '2026-09-18T02:45:38' + TZ, { en: 'Bed-exit triggered, then no movement for 90 s', cn: '离床感应触发，90 秒无移动信号' }),
          histEntry('n307-a', 'ALERT', 'ai', '2026-09-18T02:47:00' + TZ, { en: 'Medium-priority alert: possible fall (simulated inference)', cn: '中级告警：疑似跌倒（模拟推断）' })
        ]
      };
    } else {
      events['day-415'] = resolvedEvent('day-415', '415', 'day', '2026-09-18T08:15:00' + TZ, [
        histEntry('d415-t', 'TRIGGER', 'system', '2026-09-18T08:13:50' + TZ, { en: 'Unusual stillness during morning wash', cn: '晨间洗漱中检测到异常静止' }),
        histEntry('d415-a', 'ALERT', 'ai', '2026-09-18T08:15:00' + TZ, { en: 'Low-priority alert issued (simulated inference)', cn: '发布低级告警（模拟推断）' }),
        histEntry('d415-1', 'ACK', 'caregiver-demo', '2026-09-18T08:16:00' + TZ),
        histEntry('d415-2', 'ARRIVE', 'caregiver-demo', '2026-09-18T08:18:00' + TZ),
        histEntry('d415-3', 'OBSERVE', 'caregiver-demo', '2026-09-18T08:19:00' + TZ, { en: 'False alarm during morning wash', cn: '晨间洗漱误报' }),
        histEntry('d415-4', 'COMPLETE', 'caregiver-demo', '2026-09-18T08:20:00' + TZ, { en: 'No action needed; resident fine', cn: '无需处置，老人安好' })
      ], { en: 'False alarm during morning wash', cn: '晨间洗漱误报' });
      events['day-303'] = resolvedEvent('day-303', '303', 'day', '2026-09-18T09:22:00' + TZ, [
        histEntry('d303-t', 'TRIGGER', 'system', '2026-09-18T09:20:40' + TZ, { en: 'Unusual stillness in the common area', cn: '公共区检测到异常静止' }),
        histEntry('d303-a', 'ALERT', 'ai', '2026-09-18T09:22:00' + TZ, { en: 'Medium-priority alert issued (simulated inference)', cn: '发布中级告警（模拟推断）' }),
        histEntry('d303-1', 'ACK', 'caregiver-demo', '2026-09-18T09:24:00' + TZ),
        histEntry('d303-2', 'ARRIVE', 'caregiver-demo', '2026-09-18T09:26:00' + TZ),
        histEntry('d303-3', 'OBSERVE', 'caregiver-demo', '2026-09-18T09:27:00' + TZ, { en: 'Dozing in a wheelchair, uninjured', cn: '在轮椅上打盹，无外伤' }),
        histEntry('d303-4', 'COMPLETE', 'caregiver-demo', '2026-09-18T09:30:00' + TZ, { en: 'Assisted to a chair', cn: '已协助入座' })
      ], { en: 'Dozing in a wheelchair, uninjured', cn: '在轮椅上打盹，无外伤' });
      events['day-307'] = {
        id: 'day-307', roomId: '307', shift: 'day',
        occurredAt: '2026-09-18T10:31:00' + TZ,
        status: 'new', observation: null, support: null,
        history: [
          histEntry('d307-t', 'TRIGGER', 'system', '2026-09-18T10:29:12' + TZ, { en: 'Unusual stillness during morning activity', cn: '晨间活动中检测到异常静止' }),
          histEntry('d307-a', 'ALERT', 'ai', '2026-09-18T10:31:00' + TZ, { en: 'Medium-priority alert: possible fall (simulated inference)', cn: '中级告警：疑似跌倒（模拟推断）' })
        ]
      };
    }
    return events;
  }

  function createDemoState(shift) {
    if (shift !== 'night' && shift !== 'day') throw new Error('unknown shift: ' + shift);
    var clock = DEMO_CLOCK[shift];
    var rooms = {};
    Object.keys(RESIDENTS).forEach(function (id) {
      rooms[id] = {
        id: id,
        name: RESIDENTS[id].name,
        age: RESIDENTS[id].age,
        unit: { en: 'Memory Care Unit', cn: '记忆照护区' },
        chips: RESIDENTS[id].chips,
        wing: WINGS.east.indexOf(id) >= 0 ? 'east' : 'west',
        watch: (WATCH[shift] && WATCH[shift][id]) || null,
        sensors: seedSensors(id, shift, clock),
        notes: seedNotes(id, shift)
      };
    });
    return {
      schemaVersion: SCHEMA_VERSION,
      shift: shift,
      clock: clock,
      rooms: rooms,
      events: seedEvents(shift)
    };
  }

  var TRANSITIONS = {
    ACK: { from: ['new'], to: 'acknowledged' },
    ARRIVE: { from: ['acknowledged'], to: 'on_site' },
    OBSERVE: { from: ['on_site', 'in_care'], to: null },
    REQUEST_SUPPORT: { from: ['acknowledged', 'on_site', 'in_care'], to: 'awaiting_support' },
    ACCEPT_SUPPORT: { from: ['awaiting_support'], to: 'in_care' },
    COMPLETE: { from: ['on_site', 'in_care'], to: 'resolved' },
    AMEND: { from: ['new', 'acknowledged', 'on_site', 'awaiting_support', 'in_care', 'resolved'], to: null }
  };

  function applyAction(state, eventId, action) {
    if (!state || state.schemaVersion !== SCHEMA_VERSION || !state.events) {
      throw new Error('invalid state');
    }
    var ev = state.events[eventId];
    if (!ev) throw new Error('unknown event: ' + eventId);
    if (!action || !action.id || !action.type || !action.at) throw new Error('invalid action');
    var tr = TRANSITIONS[action.type];
    if (!tr) throw new Error('unknown action type: ' + action.type);
    // idempotent: replaying an already-recorded action returns state unchanged
    if (ev.history.some(function (h) { return h.id === action.id; })) return state;
    // demo clock is monotonic within an event
    var last = ev.history[ev.history.length - 1];
    if (last && parse(action.at) < parse(last.at)) {
      throw new Error('action time before last record');
    }
    if (tr.from.indexOf(ev.status) < 0) {
      throw new Error('action ' + action.type + ' not allowed in status ' + ev.status);
    }
    if (action.type === 'OBSERVE' && (!action.note || !String(action.note).trim())) {
      throw new Error('OBSERVE requires a note');
    }
    if (action.type === 'COMPLETE') {
      if (!ev.observation) throw new Error('COMPLETE requires an on-site observation');
      if (!action.note || !String(action.note).trim()) throw new Error('COMPLETE requires a completion note');
    }
    if (action.type === 'AMEND') {
      if (!action.refId || !ev.history.some(function (h) { return h.id === action.refId; })) {
        throw new Error('AMEND requires an existing refId');
      }
      if (!action.note || !String(action.note).trim()) throw new Error('AMEND requires a note');
    }

    var nev = Object.assign({}, ev);
    nev.history = ev.history.concat([
      histEntry(action.id, action.type, action.actor || 'caregiver-demo', action.at, action.note, action.refId)
    ]);
    if (tr.to) nev.status = tr.to;
    if (action.type === 'OBSERVE') nev.observation = action.note;
    if (action.type === 'REQUEST_SUPPORT') {
      nev.support = { requestedAt: action.at, acceptedAt: null, acceptedBy: null };
    }
    if (action.type === 'ACCEPT_SUPPORT') {
      nev.support = Object.assign({}, ev.support, {
        acceptedAt: action.at, acceptedBy: action.actor || 'nurse-demo'
      });
    }
    var nevents = Object.assign({}, state.events);
    nevents[eventId] = nev;
    return {
      schemaVersion: state.schemaVersion,
      shift: state.shift,
      clock: action.at,
      rooms: state.rooms,
      events: nevents
    };
  }

  function summarize(state) {
    if (!state || !state.events) throw new Error('invalid state');
    var evs = Object.keys(state.events).map(function (k) { return state.events[k]; });
    var resolved = evs.filter(function (e) { return e.status === 'resolved'; }).length;
    var samples = [];
    evs.forEach(function (e) {
      var ack = null;
      for (var i = 0; i < e.history.length; i++) {
        if (e.history[i].type === 'ACK') { ack = e.history[i]; break; }
      }
      if (!ack) return;
      var d = (parse(ack.at) - parse(e.occurredAt)) / 1000;
      if (d < 0) throw new Error('negative response time for event ' + e.id);
      samples.push(d);
    });
    return {
      total: evs.length,
      open: evs.length - resolved,
      resolved: resolved,
      meanResponseSeconds: samples.length
        ? samples.reduce(function (a, b) { return a + b; }, 0) / samples.length
        : null
    };
  }

  var api = { createDemoState: createDemoState, applyAction: applyAction, summarize: summarize, nextAt: nextAt };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else globalThis.RoundMateState = api;
})();
