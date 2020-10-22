/**
 * 实现一个队列
 */
class Queue {
  constructor() {
    this.items = []
  }

  isEmpty() {
    return this.items.length === 0
  }

  enqueue(item) {
    this.items.push(item)
  }

  dequeue() {
    if(!this.isEmpty()) {
      this.items.shift();
    } else {
      console.log('This queue is empty.')
    }
  }

  front() {
    if(!this.isEmpty()) {
      return this.items[0]
    } else {
      console.log('This queue is empty.')
    }
  }

  clear() {
    this.items = [];
  }
}

module.exports = Queue;