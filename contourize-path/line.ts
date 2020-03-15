import { Point } from './point';

export class Line {
  constructor(public a: Point, public b: Point) { }
  
  get dx(): number {
    const { a, b } = this;
    return b.x - a.x;
  }
  
  get dy(): number {
    const { a , b } = this;
    return b.y - a.y;
  }
  
  get length() {
    const { a, b } = this;
    return a.distanceTo(b);
  }

  contour(width: number) {
    const { a, b, dx, dy, length } = this;
    const halfWidth = width / 2;
    const p0: Point = new Point(
      a.x - (halfWidth / length) * dy,
      a.y + (halfWidth / length) * dx
    );
    const p1: Point = new Point(
      b.x - (halfWidth / length) * dy,
      b.y + (halfWidth / length) * dx
    );
    const p2: Point = new Point(
      b.x + (halfWidth / length) * dy,
      b.y - (halfWidth / length) * dx
    );
    const p3: Point = new Point(
      a.x + (halfWidth / length) * dy,
      a.y - (halfWidth / length) * dx
    );
    return { p0, p1, p2, p3 };
  }  
}
