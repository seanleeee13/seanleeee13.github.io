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
        if (!(
            (1 <= difficulty_votes[key][1] && difficulty_votes[key][1] <= 9 && difficulty_votes[key][0] === 0)
            || (1 <= difficulty_votes[key][1] && difficulty_votes[key][1] <= 39 && difficulty_votes[key][0] === 1)
        )) {
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
    let difficulty = Math.round(dv_diff.reduce((a, b) => a + b, 0) / dv_diff.length);
    let featured = Math.round(dv_ft.reduce((a, b) => a + b, 0) / dv_ft.length);
    let ipp = Math.round(dv_ipp.reduce((a, b) => a + b, 0) / dv_ipp.length);
    if (10 <= difficulty) {
        return [1, difficulty - 9, featured, ipp];
    } else {
        return [0, difficulty, featured, ipp];
    }
}

function pdavg(difficulty: number[] | undefined) {
    if (!difficulty) {
        return "na";
    }
    if (difficulty.length !== 4) {
        return undefined;
    }
    let ft = difficulty[2] === 0 ? "nf" :
        difficulty[2] === 1 ? "ft" :
        difficulty[2] === 2 ? "ep" :
        difficulty[2] === 3 ? "ld" : "mt";
    if (difficulty[3] === 1) {
        return "ipp";
    } else if (difficulty[0] === 1) {
        if (difficulty[1] <= 5) {
            return `ed${difficulty[1]}${ft}`;
        } else if (difficulty[1] <= 10) {
            return `md${difficulty[1]}${ft}`;
        } else if (difficulty[1] <= 15) {
            return `hd${difficulty[1]}${ft}`;
        } else if (difficulty[1] <= 20) {
            return `id${difficulty[1]}${ft}`;
        } else {
            return `xd${difficulty[1]}${ft}`;
        }
    } else {
        if (difficulty[1] === 1) {
            return `a${difficulty[1]}${ft}`;
        } else if (difficulty[1] === 2) {
            return `e${difficulty[1]}${ft}`;
        } else if (difficulty[1] === 3) {
            return `n${difficulty[1]}${ft}`;
        } else if (difficulty[1] <= 5) {
            return `h${difficulty[1]}${ft}`;
        } else if (difficulty[1] <= 7) {
            return `d${difficulty[1]}${ft}`;
        } else {
            return `i${difficulty[1]}${ft}`;
        }
    }
}

export { cdavg, pdavg }