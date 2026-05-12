

export class Duration {
    _totalSeconds;

    constructor(seconds = 0) {
        this._totalSeconds = Number(seconds) || 0;
    }

    static fromMinutesAndSeconds(minutes = 0, seconds = 0) {
        const totalSeconds = Number(minutes) * 60 + Number(seconds);
        return new Duration(totalSeconds);
    }

    plus = (other) => {
        const otherSeconds = other ? Number(other._totalSeconds) || 0 : 0;
        return new Duration(this._totalSeconds + otherSeconds);
    };

    minus = (other) => {
        const otherSeconds = other ? Number(other._totalSeconds) || 0 : 0;
        const result = this._totalSeconds - otherSeconds;
        return new Duration(result >= 0 ? result : 0);
    };

    toString = () => {
        const minutes = Math.floor(this._totalSeconds / 60);
        const seconds = this._totalSeconds % 60;
        return `${minutes}m ${seconds}s`;
    };
}
