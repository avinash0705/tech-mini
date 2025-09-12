export function millisecondsToTime(ms, offset = 0) {
    const roundedSeconds = Math.round(ms / 1000 + offset);

    const hours = Math.floor(roundedSeconds / 3600);
    const divirsForMinutes = roundedSeconds % 3600;
    const minutes = Math.floor(divirsForMinutes / 60);
    const sec = Math.ceil(divirsForMinutes % 60);

    return {
        hh: hours.toString(),
        mm: minutes < 10 ? `0${minutes}` : minutes.toString(),
        ss: sec < 10 ? `0${sec}` : sec.toString()
    };
}

export function timeToTimeString(
    max,
    seekHoverTime,
    offset = 0,
    minutesPrefix = '',
    secondsPrefix = ''
) {
    const times = millisecondsToTime(seekHoverTime, offset);

    if (max + offset < 60 * 1000) {
        return secondsPrefix + times.ss;
    }

    if (max + offset < 3600 * 1000) {
        return `${minutesPrefix + times.mm}:${times.ss}`;
    }

    return `${times.hh}:${times.mm}:${times.ss}`;
}

export function positionToMs(max, position, trackWidth) {
    const percent = (position * 100) / trackWidth;
    return Math.floor(percent * (max / 100));
}

export const isInRange = (time, start, end) => time >= start && time <= end;

export function getTimeScale(currentTime, startTime, endTime, isTimePassed) {
    const isActiveTime = isInRange(currentTime, startTime, endTime);
    const timeDiff = endTime - startTime;
    const timeDiffWithCurrent = currentTime - startTime;
    const currentScalePercent = isActiveTime ? timeDiffWithCurrent / timeDiff : 0;

    return isTimePassed ? 1 : currentScalePercent;
}

export function getPositionPercent(max, current) {
    const divider = max || -1; // prevent division by zero
    return (current * 100) / divider;
}

export const getEndTimeByIndex = (timeCodes, index, max) => {
    return index + 1 < timeCodes.length ? timeCodes[index + 1].fromMs : max;
};

export function getHoverTimePosition(
    seekHoverPosition,
    hoverTimeElement,
    trackWidth,
    limitTimeTooltipBySides
) {
    let position = 0;

    if (hoverTimeElement) {
        position = seekHoverPosition - hoverTimeElement.offsetWidth / 2;

        if (limitTimeTooltipBySides) {
            if (position < 0) {
                position = 0;
            } else if (position + hoverTimeElement.offsetWidth > trackWidth) {
                position = trackWidth - hoverTimeElement.offsetWidth;
            }
        }
    }

    return { transform: `translateX(${position}px)` };
}

export default {
    millisecondsToTime,
    getHoverTimePosition,
    getEndTimeByIndex,
    getPositionPercent,
    getTimeScale,
    isInRange,
    positionToMs,
    timeToTimeString
};
