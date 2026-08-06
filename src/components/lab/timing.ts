/**
 * The hero entrance.
 *
 * `DELAY` was 1.95s when a loading sequence played first and the hero had
 * to wait for it. That loader is gone, so the delay became two seconds of
 * a dead page followed by movement out of nowhere — which is most of why
 * the entrance read as random. It is now just long enough for the first
 * paint to settle.
 *
 * `STEP` is the gap between one unit of the sentence and the next. The
 * whole entrance is a single left-to-right pass in reading order — words,
 * then whatever interrupts them, in the order a person would say the
 * line. One idea, one direction, one chronology.
 */
export const HERO_ENTRANCE_DELAY_S = 0.2;
export const HERO_UNIT_STEP_S = 0.055;
