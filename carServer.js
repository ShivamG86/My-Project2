let express = require("express");
let app = express();

app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

var port = process.env.PORT||2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));

let { carsData, carsMaster } = require("./carData.js");

app.get("/cars", function (req, res) {
    let { type, fuel, sort, minprice, maxprice } = req.query;
    let filteredCars = [...carsData];

    if (fuel) {
        filteredCars = filteredCars.filter((carData) => {
            return carsMaster.some(
                (masterData) =>
                    masterData.fuel === fuel && masterData.model === carData.model
            );
        });
    }

    if (type) {
        filteredCars = filteredCars.filter((carData) => {
            return carsMaster.some(
                (masterData) =>
                    masterData.type === type && masterData.model === carData.model
            );
        });
    }

    if (minprice && maxprice) {
        filteredCars = filteredCars.filter((carData) => {
            return (
                carData.price >= parseInt(minprice) &&
                carData.price <= parseInt(maxprice)
            );
        });
    }

    if (sort) {
        if (sort === "kms" || sort === "price" || sort === "year") {
            filteredCars.sort((a, b) => {
                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0;
            });
        } else {
            return res.status(400).send("Invalid sortBy parameter");
        }
    }

    res.send(filteredCars);
});


app.get("/cars/:id", function (req, res) {
    let id = req.params.id;
    let car = carsData.find((car) => car.id === id);
    if (car) res.send(car);
    else res.status(404).send("No car found");
});

app.post("/cars", function (req, res) {
    let body = req.body;
    carsData.push(body); 
    res.send(body); 
});


app.put("/cars/:id", function(req, res) {
    let id = req.params.id;
    let body = req.body;
    let index = carsData.findIndex((st) => st.id === id);
    console.log(index);
    if (index >= 0) {
        let updatedCar = { id: id, ...body }; 
        carsData[index] = updatedCar;
        res.send(updatedCar);
    } else {
        res.status(404).send("No Car Found");
    }
});

app.delete("/cars/:id", function(req, res) {
    let id = req.params.id;
    let index = carsData.findIndex((st) => st.id === id);
    console.log(index)
    if (index >= 0) {
        let deletedCar = carsData.splice(index, 1);
        res.send(deletedCar);
    } else {
        res.status(404).send("No Car Found");
    }
});
