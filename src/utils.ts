declare global {
    interface Array<T> {
        each(callback: (value: T, index: number, array: T[]) => any): this;
        shuffle(): this;
        inspect(): string;
        stats(reducer: (item: T) => number): Statistic;
    }

    interface Statistic {
        max: number;
        min: number;
        average: number;
        spread: number;
    }
}

Array.prototype.each = function (callback) {
    this.forEach(callback);
    return this;
};

Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
}

Array.prototype.inspect = function () {
    return `[${this.map(w => w).join(', ')}]`;
}

Array.prototype.stats = function (reducer) {
    const reduced = this.map(reducer);
    const average = this.reduce((a, _, i) => a + reduced[i], 0) / this.length;
    const max = Math.max(...reduced);
    const min = Math.min(...reduced);
    const spread = (average - min) / max;
    return { max, min, average, spread };
}
