function calculatePoints(totalTime, timeTaken, streak) {
    const basePoints = 1000
    const streakBonus = 0.08

    const timeRatio = timeTaken / totalTime
    const adjustmentFactor = 1 - timeRatio / 2
    let points = basePoints * adjustmentFactor

    if (streak > 0) {
        points += points * streakBonus * streak
    }

    points = Math.round(points)

    return points
}
export default calculatePoints
