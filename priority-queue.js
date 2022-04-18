"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.right = exports.left = exports.parent = void 0;
const parent = (i) => ((i + 1) >>> 1) - 1;
exports.parent = parent;
const left = (i) => (i << 1) + 1;
exports.left = left;
const right = (i) => (i + 1) << 1;
exports.right = right;
class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
        this.heap = [];
        this.top = 0;
        this.comparator = comparator;
    }
    size() {
        return this.heap.length;
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek() {
        return this.heap[this.top];
    }
    poll() {
        const topElement = this.peek();
        this.heap.splice(this.top, 1);
        return topElement;
    }
    push(...values) {
        values.forEach((value) => {
            //@ts-ignore
            this.heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this.top) {
            this._swap(this.top, bottom);
        }
        this.heap.pop();
        this._siftDown();
        return poppedValue;
    }
    _greater(i, j) {
        return this.comparator(this.heap[i], this.heap[j]);
    }
    _swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > this.top && this._greater(node, (0, exports.parent)(node))) {
            this._swap(node, (0, exports.parent)(node));
            node = (0, exports.parent)(node);
        }
    }
    _siftDown() {
        let node = this.top;
        while (((0, exports.left)(node) < this.size() && this._greater((0, exports.left)(node), node)) ||
            ((0, exports.right)(node) < this.size() && this._greater((0, exports.right)(node), node))) {
            let maxChild = ((0, exports.right)(node) < this.size() && this._greater((0, exports.right)(node), (0, exports.left)(node))) ? (0, exports.right)(node) : (0, exports.left)(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}
exports.default = PriorityQueue;
