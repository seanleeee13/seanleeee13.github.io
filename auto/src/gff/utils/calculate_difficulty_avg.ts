function cdavg(difficulty_votes: Record<string, number[]> | undefined) {
    if (!difficulty_votes) {
        return undefined;
    }
    let dv_diff = [];
    let dv_ft = [];
    let dv_ipp = [];
    for (const key of Object.keys(difficulty_votes)) {
        if (difficulty_votes[key].length !== 4) {
            continue;
        }
        if (!(0 <= difficulty_votes[key][0] && difficulty_votes[key][0] <= 1)) {
            continue;
        }
        if (
            !(
                (1 <= difficulty_votes[key][1] &&
                    difficulty_votes[key][1] <= 9 &&
                    difficulty_votes[key][0] === 0) ||
                (1 <= difficulty_votes[key][1] &&
                    difficulty_votes[key][1] <= 39 &&
                    difficulty_votes[key][0] === 1)
            )
        ) {
            if (difficulty_votes[key][3] === 1) {
                dv_ipp.push(difficulty_votes[key][3]);
            }
            continue;
        }
        if (!(0 <= difficulty_votes[key][2] && difficulty_votes[key][2] <= 4)) {
            continue;
        }
        if (!(0 <= difficulty_votes[key][3] && difficulty_votes[key][3] <= 1)) {
            continue;
        }
        if (difficulty_votes[key][0] === 1) {
            dv_diff.push(difficulty_votes[key][1] + 9);
        } else {
            dv_diff.push(difficulty_votes[key][1]);
        }
        dv_ft.push(difficulty_votes[key][2]);
        dv_ipp.push(difficulty_votes[key][3]);
    }
    if (dv_diff.length === 0) {
        return undefined;
    }
    let difficulty = Math.round((100 * dv_diff.reduce((a, b) => a + b, 0)) / dv_diff.length) / 100;
    let featured = Math.round((100 * dv_ft.reduce((a, b) => a + b, 0)) / dv_ft.length) / 100;
    let ipp = Math.round((100 * dv_ipp.reduce((a, b) => a + b, 0)) / dv_ipp.length) / 100;
    if (10 <= difficulty) {
        return [1, difficulty - 9, featured, ipp];
    } else {
        return [0, difficulty, featured, ipp];
    }
}

export { cdavg };