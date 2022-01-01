let goToGameBtn;
let gs;

const animals = [
    {
        footPrint: [
            ["X", "X"],
            ["X", "X"]
        ],
        chance: 1,
        tileName: "P",
        name: "Pig",
        maxTiles: 4
    },
    {
        footPrint: [
            ["X", "X", "X","X"]
        ],
        chance: 0.5,
        tileName: "Sh",
        name: "Sheep",
        maxTiles: 4
    },
    {
        footPrint: [
            ["X"],
            ["X"]
        ],
        chance: 0.1,
        tileName: "Uni",
        name: "Unicorn",
        maxTiles: 2
    },
    {
        footPrint: [
            ["X"],
            ["","X"],
            ["","","X"],
            ["","","","X"]
        ],
        chance: 0.5,
        tileName: "Fi",
        name: "Fish",
        maxTiles: 4
    }
]

let screen = "safari";

function setup() 
{
	createCanvas(400, 600);
    goToGameBtn = new Button(width/2-100, 400, 200, 50, "GO", [255,255,255,0,0,0], () => screen = "safari")
    gs = new GameScreen();
}

function draw()
{
    background(0);
    textAlign(CENTER, CENTER)
    switch(screen) {
        case "zoo":
            goToGameBtn.show();
            break;
        case "safari":
            gs.show();
            break;
    }
}

function mouseClicked() {
    switch(screen) {
        case "zoo":
            if (goToGameBtn.checkClicked()) goToGameBtn.click();
            break;
        case "safari":
            gs.checkClicked();
            break;
    }

}

class GameScreen {
    constructor() {
        this.tiles = [];
        this.clicks = 10;
        this.map = this.generateMap();
        for (let i = 0; i<16; i++) {
            this.tiles.push(new Tile(
                ((i*80)%320)+40, 
                (Math.floor(i/4)*80)+200, 
                i,
                () => {},
                this.map[Math.floor(i/4)][i%4]!==""
                ? {...animals[this.map[Math.floor(i/4)][i%4]]}
                :false
            ));
        } 
        this.animalsAdded = [];
        this.homeBtn = new Button(width/2, 500, 150, 75, "Home", [255,255,0,0,0,0], () => screen = "zoo");
    }

    generateMap() {
        let map = [
            ["","","",""],
            ["","","",""],
            ["","","",""],
            ["","","",""],
        ]
        let animalCopy = [...animals];
        animalCopy.map((animal, idx) => {
            if (animal) {
                let randNum = Math.random();
                console.log(randNum);
                if (randNum <= animal.chance) {
                    let placeableLocations = [];
                    for (let y = 0; y<map.length; y++) {
                        for (let x = 0; x<map.length; x++) {
                            if (this.tryPlace(map, x, y, animal.footPrint)) {
                                placeableLocations.push([x,y]);
                            }
                        }
                    }
                    if (placeableLocations.length > 0) {
                        let randLocation = Math.floor(Math.random()*placeableLocations.length);
                        this.place(map, placeableLocations[randLocation][0], placeableLocations[randLocation][1], animal.footPrint, idx);
                        animalCopy.splice(idx, 1, undefined);
                    }
                }
            }
        })
        console.log(map);
        return map;
    }
    

    tryPlace(map, oX, oY, footPrint) {
        for (let y = 0; y<footPrint.length; y++) {
            for (let x = 0; x<footPrint[y].length; x++) {
                if (oY+y >= 4 || oX+x >= 4) return false;
                if (map[oY+y][oX+x] !== "" && footPrint[y][x] !== "") return false;
            }
        }
        return true;
    }

    place(map, oX, oY, footPrint, toPlace) {
        for (let y = 0; y<footPrint.length; y++) {
            for (let x = 0; x<footPrint[y].length; x++) {
                map[oY+y][oX+x] = toPlace;
            }
        }
    }

    show() {
        if (this.clicks > 0) {
            fill(255);
            textSize(40)
            text(`Clicks Left: ${this.clicks}`, width/2, 150)
            this.tiles.map((tile) => {
                tile.show();
            })
        }
        else {
            fill(255);
            textSize(50);
            text("Safari Finished", width/2, 100)
            if (this.animalsAdded.length > 0) {
                let oY = (height/2)-(20*this.animalsAdded.length)
                textSize(40);
                text("Animals Added:", width/2, oY);
                textSize(30);
                this.animalsAdded.map((animal, idx) => {
                    text(animal.name, width/2, oY+((idx+1)*40));
                })
            }
            else {
                textSize(30);
                text("No Animals Captured :(", width/2, height/2-20);
                text("Better Luck Next Time", width/2, height/2+40)
            }
            this.homeBtn.show();
        }
    }

    checkClicked() {
        if (this.clicks > 0) {
            this.tiles.map((tile) => {
                if (tile.checkClicked()) {
                    if (tile.click()) {
                        this.clicks --;
                        if (this.clicks <= 0) {
                            this.gameOver();
                        }
                    }
                }
            })
        }
        else {
            if (this.homeBtn.checkClicked()) this.homeBtn.click();
        }
    }

    gameOver() {
        let animalTemp = {};
        this.tiles.map((tile) => {
            if (tile.animal && tile.revealed) {
                if (animalTemp[tile.animal.name] === undefined) {
                    animalTemp[tile.animal.name] = {
                        amount: 1,
                        animal: tile.animal
                    }
                } 
                else {
                    animalTemp[tile.animal.name].amount ++;
                }
            }
        })
        for (let animal in animalTemp) {
            console.log(animal);
            console.log(animalTemp[animal])
            if (animalTemp[animal].amount === animalTemp[animal].animal.maxTiles) {
                this.animalsAdded.push({...animalTemp[animal].animal});
            }
        }
    }
}