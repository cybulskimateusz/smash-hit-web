declare type Position2D = {
    x: number;
    y: number;
};

declare type Size2D = {
    width: number;
    height: number;
};

declare type PolarCoordinates = [
    radius: number,
    angle: number,
]

declare type CartesianCoordinates = [
    x: number,
    y: number,
]

declare type Polygon = CartesianCoordinates[];