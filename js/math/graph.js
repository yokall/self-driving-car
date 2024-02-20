class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    addPoint(point) {
        this.points.push(point);
    }

    containsPoint(point) {
        return this.points.find((p) => p.equals(point));
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;
    }

    addSegment(segment) {
        this.segments.push(segment);
    }

    containsSegment(segment) {
        return this.segments.find((s) => s.equals(segment));
    }

    tryAddSegment(segment) {
        if (!segment.p1.equals(segment.p2) && !this.containsSegment(segment)) {
            this.addSegment(segment);
            return true;
        }
        return false;
    }

    removeSegment(segment) {
        this.segments.splice(this.segments.indexOf(segment), 1);
    }

    removePoint(point) {
        const segments = this.getSegmentsWithPoint(point);

        for (const segment of segments) {
            this.removeSegment(segment);
        }

        this.points.splice(this.points.indexOf(point), 1);
    }

    getSegmentsWithPoint(point) {
        const segmentsToRemove = [];
        for (const segment of this.segments) {
            if (segment.includes(point)) {
                segmentsToRemove.push(segment);
            }
        }

        return segmentsToRemove;
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    draw(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }
}