const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const cars = generateCars(100);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.3);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(0), -600, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(1), -1000, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(0), -850, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(2), -800, 30, 50, "DUMMY", 1.5),
];

animate();

function saveBrain() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discardBrain() {
    localStorage.removeItem("bestBrain");
}

function generateCars(n) {
    const cars = [];
    for (let i = 1; i <= n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    cars.forEach(car => {
        car.update(road.borders, traffic);
    });
    bestCar = cars.find(car =>
        car.y == Math.min(
            ...cars.map(c => c.y)
        )
    );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }

    carCtx.globalAlpha = 0.2;
    cars.forEach(car => {
        car.draw(carCtx);
    });
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}