import { mapActivities } from "../src/strava.js";
import assert from "node:assert/strict";

const raw = [
  { start_date_local: "2026-09-08T18:58:32Z", sport_type: "VirtualRide", name: "Day 8", moving_time: 5412, suffer_score: 50 },
  { start_date_local: "2026-09-02T08:08:20Z", type: "EBikeRide", name: "Commute", moving_time: 426 }, // no suffer_score -> dropped
  { start_date_local: "2026-09-01T20:01:36Z", sport_type: "VirtualRide", name: "Day 1", moving_time: 2715, suffer_score: 83 },
];

const out = mapActivities(raw);

assert.equal(out.length, 2, "activities without relative effort are dropped");
assert.deepEqual(out.map((a) => a.date), ["2026-09-01", "2026-09-08"], "sorted ascending by date");
assert.deepEqual(out[0], { date: "2026-09-01", sport: "VirtualRide", name: "Day 1", movingTimeSec: 2715, load: 83 });
assert.equal(out[1].load, 50, "load maps from suffer_score");

console.log("ok - mapActivities", out.length, "activities");
