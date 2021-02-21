declare global {
    interface Array<T> {
        each(callback: (value: T, index: number, array: T[]) => any): this;
        shuffle(): this;
        inspect(): string;
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
