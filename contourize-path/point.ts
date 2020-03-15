export class Point {
  
  constructor(public x: number, public y: number) { }
  
  toArray() {
    return [this.x, this.y];
  }
  
  distanceTo(p: Point) {
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }
}
