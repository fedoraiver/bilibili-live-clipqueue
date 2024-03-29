class ClipQueue {
  private capacity: number;
  private items: string[];

  constructor(capacity: number) {
    this.capacity = capacity;
    this.items = [];
  }

  enqueue(item: string) {
    if (!this.isFull()) {
      this.items.push(item);
      return true;
    } else {
      return false;
    }
  }

  dequeue() {
    if (!this.isEmpty()) {
      return this.items.shift();
    } else {
      return null;
    }
  }

  getFirst() {
    if (!this.isEmpty()) {
      return this.items[0];
    } else {
      return null;
    }
  }

  isEmpty() {
    return this.items.length === 0;
  }

  isFull() {
    return this.items.length === this.capacity;
  }

  setCapacity(newCapacity: number) {
    if (newCapacity < 0) throw new Error("Error: newCapacity must >= 0");
    this.capacity = newCapacity;
    while (this.items.length > newCapacity) {
      this.dequeue();
    }
  }

  getCapacity() {
    return this.capacity;
  }

  Num() {
    return this.items.length;
  }

  has(item: string) {
    return this.items.includes(item);
  }
}

export default ClipQueue;
