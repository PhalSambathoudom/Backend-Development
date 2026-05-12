
import fs from "fs";
import { Duration } from "../model/Duration.js";
import { RaceResult } from "../model/RaceResult.js";

/**
 * This class handle the race results management system.
 */
export class RaceResultsService {
  /**
   * The list of race results.
   * @type {Array<RaceResult>}
   * @private
   */
  _raceResults = [];

  get raceResults() {
    return this._raceResults;
  }

  /**
   * Adds a new race result to the race list.
   * @param {RaceResult} result - The prace result.
   */
  addRaceResult(result) {
    if (result instanceof RaceResult) {
      this._raceResults.push(result);
    }
  }

  /**
   * Saves the race results list to a JSON file.
   * @param {string} filePath - The path to the file where data should be saved.
   */
  saveToFile(filePath) {
    const json = JSON.stringify(this._raceResults, null, 2);
    fs.writeFileSync(filePath, json, "utf8");
  }

  /**
   * Loads the race results list from a JSON file.
   * @param {string} filePath - The path to the file to load data from.
   * @returns {boolean} True if loading was successful, false otherwise.
   */
  loadFromFile(filePath) {
    try {
      const text = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(text);
      this._raceResults = data.map((item) => {
        const participantId = item.participantId || item.participant_id || "";
        const sport = item.sport || "";
        const timeValue = item.time?._totalSeconds ?? item.time ?? 0;
        return new RaceResult(participantId, sport, new Duration(timeValue));
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Retrieves the race time for a given participant and sport.
   * @param {string} participantId - Participant ID.
   * @param {string} sport - Sport name.
   * @returns {Duration|null} Duration if found, else null.
   */
  getTimeForParticipant(participantId, sport) {
    const result = this._raceResults.find(
      (item) => item.participantId === participantId && item.sport === sport
    );
    return result ? result.time : null;
  }

  /**
   * Computes the total time for a given participant by summing their race times.
   * @param {string} participantId - The ID of the participant.
   * @returns {Duration|null} The total Duration object if found, otherwise null.
   */
  getTotalTimeForParticipant(participantId) {
    const results = this._raceResults.filter(
      (item) => item.participantId === participantId
    );

    if (results.length === 0) {
      return new Duration(0);
    }

    return results.reduce(
      (total, item) => total.plus(item.time),
      new Duration(0)
    );
  }
}
