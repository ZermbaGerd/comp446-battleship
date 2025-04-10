

///////////////// GLOBALS /////////////////
var mainShipMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];


const debugShipMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 4, 4, 4, 4, 0,
    0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 2, 0, 3, 0,
    0, 0, 0, 0, 0, 0, 2, 0, 3, 0,
    0, 0, 0, 0, 0, 0, 2, 0, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    5, 5, 5, 5, 5, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]

var socket = io();
var lobby = window.location.pathname;
var id;
const assetLoc = "static/assets/";

///////////////// Joining logic /////////////////

socket.emit("join", Number(lobby[1]));

socket.on("join", (success, usersConnected) => {
    if(success === 1) {
        // you have joined the room, start to check for whether the other person is in, then place ships, then run game
        console.log("heard back from join with success: " + success + "\n ID = " + usersConnected);
        id = usersConnected;
        alert("You successfully joined the room");

    }
    else {
        console.log("heard back from join with success: " + success);
        alert("The room is already full.");
        // send to an error / index page. do not actually play/send messages
    }
})


/*
    This function takes the values from our HTML element shipMap (called "selfMap" right now), parses them into an array, and then returns that array.
    We will use it when the player clicks the ready button after placing their ships. For now, we don't use this, we just pass in dummy/debug arrays to
    sendInitialShips instead.
*/
function parseIntoShipMap(){
    // checks our array of tileContent elements and uses them to make a ship map
    // return a 100-long array representing our ship map
}

/*
    Send our initial ship map to the server, and override our current main ship map in this file with whatever that map is
*/
function sendInitialShipMap(newShipMap){
    // https://socket.io/docs/v4/emitting-events/
    console.log("ran initial function")
    // TODO make this work
 
    // form our new ship map from the placed ships currently on screen
    // parseIntoShipMap()
    // update our global shipMap var in lobby.js
    // mainShipMap = newShipMap;
    // send our new shipMap to python so it can associate it with the right id
    socket.emit("send_initial_maps", JSON.stringify([id, debugShipMap]));
}


// Lobby is full; send the maps
socket.on("fullLobby", () => {
    sendInitialShipMap()

    console.log("main ship map was this, right before we called selfMap version of rerender")
    console.log(mainShipMap)
    rerender(debugShipMap, "selfMap")
});

// Re-render is called when a player makes a move; it gives them the map of where their enemy
// has attacked (jsonHitMap) and (will) call(s) a Player method that re-renders their boards.
socket.on("rerender", (jsonHitMap) =>{

    // actual function
    const unpackedMap = JSON.parse(jsonHitMap);
    // console.log(unpackedMap);

    // rerender our guess map (where we've guessed) with new information
    rerender(unpackedMap, "opponentMap");
    
    // rerender our ship map (were our opponent has guessed + where our ships are) with new information
    // TODO: figure this out
});


/*
    Creates a tile element, defaulting to having an empty space
*/
function createTile() {
    let tile = document.createElement("div");
    tile.className = "tile";

    let tileContent = document.createElement("img");
    tileContent.className = "tileContent";
    tileContent.src="static/assets/empty.svg";
    tileContent.width="100";
    tileContent.alt="empty";

    tile.appendChild(tileContent);
    return tile;
}

/*
    Rerenders a particular element based on the given JSON. 
*/
function rerender(arrayMap, mapElement) {

    console.log("given map element was " + mapElement)
    let tileList = document.getElementById(mapElement).children;
    
    console.log("array map was")
    console.log(arrayMap)

    for (let i = 0; i < 100; i++) {
        let tileContent = tileList[i].firstChild;

        switch(arrayMap[i]) {
            case 0:
                tileContent.src = assetLoc + "empty.svg";
                tileContent.alt = "empty"
                break;
            case 1:
                tileContent.src = assetLoc + "2long.svg";
                tileContent.alt = "2 long ship piece"
                break;
            case 2:
                tileContent.src = assetLoc + "3long.svg";
                tileContent.alt = "3 long ship piece"
                break;
            case 3:
                tileContent.src = assetLoc + "3long.svg";
                tileContent.alt = "3 long ship piece"
                break;
            case 4:
                tileContent.src = assetLoc + "4long.svg";
                tileContent.alt = "4 long ship piece"
                break;
            case 5:
                tileContent.src = assetLoc + "5long.svg";
                tileContent.alt = "5 long ship piece"
                break;
            case 97:
                tileContent.src = assetLoc + "miss.svg";
                tileContent.alt = "miss"
                break;
            case 98:
                tileContent.src = assetLoc + "hit.svg";
                tileContent.alt = "hit"
                break;
            case 99:
                tileContent.src = assetLoc + "destroyed.svg";
                tileContent.alt = "destroyed tile"
                break;
            default:
                tileContent.src = assetLoc + "error.svg";
                tileContent.alt = "error";
        }
    }
}


// generate selfMap
for(let i = 0; i < 100; i++) {
    let tile = createTile();
    tile.classList.add("inactive");
    document.getElementById("selfMap").appendChild(tile);
}

// generate opponentMap
for(let i = 0; i < 100; i++) {
    let tile = createTile();
    tile.addEventListener("click", () => {
        // TODO: check whether its your turn to guess
        tile.classList.add("inactive");

        // emit a guess request with id & slot
        // the callback to this request is a new map which we rerender onto opponentMap
        socket.emit("guess", id, i, (newMap) => {
            rerender(newMap, "opponentMap");
        });
        // send a guess to the server
            // the server will check the guess against the opponent's ship map, and then send a rerender for opponentMap
    })
    document.getElementById("opponentMap").appendChild(tile);
}
