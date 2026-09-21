/* RoundMate route module.
   Parses and validates hash routes against known room/event ids.
   Never trusts URL content — whitelist validation only.
   Dual export: CommonJS (tests) + browser global RoundMateRoute. */
(function () {
  'use strict';

  var SCREENS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'];
  var EVENT_SCREENS = ['s2', 's3', 's4', 's5'];

  function invalid() {
    return { screen: 's1', roomId: null, eventId: null, from: null, filter: null, metric: null, invalid: true };
  }

  // resolveRoute(hash, roomIds, eventIds)
  // -> { screen, roomId, eventId, from, invalid }
  function resolveRoute(hash, roomIds, eventIds) {
    var raw = (hash || '#/s1').replace(/^#\/?/, '');
    var qIdx = raw.indexOf('?');
    var path = qIdx >= 0 ? raw.slice(0, qIdx) : raw;
    var params;
    try {
      params = new URLSearchParams(qIdx >= 0 ? raw.slice(qIdx + 1) : '');
    } catch (e) {
      return invalid();
    }
    if (SCREENS.indexOf(path) < 0) return invalid();

    var out = { screen: path, roomId: null, eventId: null, from: null, filter: null, metric: null, invalid: false };

    if (path === 's9') {
      var m = params.get('metric');
      if (['total', 'resolved', 'mean', 'open'].indexOf(m) < 0) return invalid();
      out.metric = m;
      var f9 = params.get('from');
      if (f9 === 'summary' || f9 === 'me') out.from = f9;
      // unknown from values are dropped, never echoed back into the DOM
    }

    if (path === 's7') {
      var room = params.get('room');
      if (!room || roomIds.indexOf(room) < 0) return invalid();
      out.roomId = room;
    }

    if (path === 's6') {
      var f = params.get('filter');
      if (f === 'open' || f === 'resolved') out.filter = f;
      // unknown filter values are dropped, never echoed back into the DOM
    }

    if (EVENT_SCREENS.indexOf(path) >= 0) {
      var ev = params.get('event');
      if (!ev || eventIds.indexOf(ev) < 0) return invalid();
      out.eventId = ev;
      var from = params.get('from');
      if (from === 'overview') {
        out.from = from;
      } else if (from && from.indexOf('room:') === 0) {
        var rid = from.slice(5);
        if (roomIds.indexOf(rid) >= 0) out.from = from;
      }
      // unknown from values are dropped, never echoed back into the DOM
    }

    return out;
  }

  var api = { resolveRoute: resolveRoute };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else globalThis.RoundMateRoute = api;
})();
