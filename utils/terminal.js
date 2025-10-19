function clearLine(dir) {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => resolve());
    });
}

function moveCursor(dx, dy) {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => resolve());
    })
}

module.exports = {clearLine, moveCursor};