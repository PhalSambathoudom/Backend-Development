import { Duration } from "./Duration.js";
/**
 * This class handles a single race time for a participant and sport.
 */
export class RaceResult {
     /**
      * @type {string}
      */
     participantId;

     /**
      * @type {string}
      */
     sport;

     /**
      * @type {Duration}
      */
     time;

     /**
      * @param {string} participantId - The participant identifier.
      * @param {string} sport - The sport type.
      * @param {Duration} time - The race time.
      */
     constructor(participantId = "", sport = "", time = new Duration(0)) {
          this.participantId = participantId;
          this.sport = sport;
          this.time = time instanceof Duration ? time : new Duration(time?._totalSeconds || 0);
     }
}
