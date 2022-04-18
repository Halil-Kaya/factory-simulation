import Event from "./event";

export const parent = (i: number) => ((i + 1) >>> 1) - 1;
export const left = (i: number) => (i << 1) + 1;
export const right = (i: number) => (i + 1) << 1;

export default class PriorityQueue {
    heap = [];
    top = 0;
    comparator;
    constructor(comparator = (a: any, b: any) => a > b) {
        this.comparator = comparator;
    }
    size() {
        return this.heap.length;
    }
    isEmpty() {
        return this.size() == 0 ;
    }
    peek() : Event {
        return this.heap[this.top];
    }

    poll() : Event{
        const topElement = this.peek()
        this.heap.splice(this.top,1)
        return topElement
    }

    push(...values: any) {
        values.forEach((value: any) => {
            //@ts-ignore
            this.heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() : Event{
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this.top) {
            this._swap(this.top, bottom);
        }
        this.heap.pop();
        this._siftDown();
        return poppedValue;
    }

    _greater(i: any, j: any) {
        return this.comparator(this.heap[i], this.heap[j]);
    }
    _swap(i: any, j: any) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > this.top && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }
    _siftDown() {
        let node = this.top;
        while (
            (left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))
        ) {
            let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}