import {auth} from './index.js';
import {onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {getDatabase, 
        onChildAdded,
        onChildRemoved,
        onDisconnect,
        onValue,
        ref, 
        remove, 
        set,
        update
      } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

const database = getDatabase(); //getting out RealTime Database

const mapData = {
    minX: 1,
    maxX: 14,
    minY: 4,
    maxY: 12,
    blockedSpaces: {
      "7x4": true,
      "1x11": true,
      "12x10": true,
      "4x7": true,
      "5x7": true,
      "6x7": true,
      "8x6": true,
      "9x6": true,
      "10x6": true,
      "7x9": true,
      "8x9": true,
      "9x9": true,
    },
  };
  
  // Options for Player Colors... these are in the same order as our sprite sheet
  const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];
  
  //Misc Helpers
  function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  function getKeyString(x, y) {
    return `${x}x${y}`;
  }
  
  function createName() {
    const prefix = randomFromArray([
      "COOL",
      "SUPER",
      "HIP",
      "SMUG",
      "WILD",
      "SHINY",
      "HOLO",
      "RARE",
      "LUCKY",
      "OG",
      "ROBO",
      "SWEET",
      "ASH'S",
      "DARK",
      "SOFT",
      "BUFF",
      "DOPE",
    ]);
    const animal = randomFromArray([
      "BUDEW",
      "MEW",
      "EEVEE",
      "ENTEI",
      "DITTO",
      "PICHU",
      "ONIX",
      "SEEL",
      "HO-OH",
      "CELEBI",
      "CHARMANDER",
      "CYNDAQUIL",
      "LUGIA",
      "GENGAR",
      "TOGEPI",
    ]);
    return `${prefix} ${animal}`;
  }
  
  function isSolid(x,y) {
  
    const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
    return (
      blockedNextSpace ||
      x >= mapData.maxX ||
      x < mapData.minX ||
      y >= mapData.maxY ||
      y < mapData.minY
    )
  }
  
  function getRandomSafeSpot() {
    //We don't look things up by key here, so just return an x/y
    return randomFromArray([
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 6 },
      { x: 2, y: 8 },
      { x: 2, y: 9 },
      { x: 4, y: 8 },
      { x: 5, y: 5 },
      { x: 5, y: 8 },
      { x: 5, y: 10 },
      { x: 5, y: 11 },
      { x: 11, y: 7 },
      { x: 12, y: 7 },
      { x: 13, y: 7 },
      { x: 13, y: 6 },
      { x: 13, y: 8 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
      { x: 10, y: 8 },
      { x: 8, y: 8 },
      { x: 11, y: 4 },
    ]);
  }
  
  
  (function () {
  
    let playerId;
    let playerRef;
    let players = {};
    let playerElements = {};
    let coins = {};
    let coinElements = {};
  
    const gameContainer = document.querySelector(".game-container");
    const playerNameInput = document.querySelector("#player-name");
    const playerColorButton = document.querySelector("#player-color");
  
  
    function placeCoin() {
      const { x, y } = getRandomSafeSpot();
      const coinRef = ref(database,`coins/${getKeyString(x, y)}`);
      set(coinRef, {
        x,
        y,
      })
  
      const coinTimeouts = [2000, 3000, 4000, 5000];
      setTimeout(() => {
        placeCoin();
      }, randomFromArray(coinTimeouts));
    }
  
    function attemptGrabCoin(x, y) {
      const key = getKeyString(x, y);
      if (coins[key]) {
        // Remove this key from data, then uptick Player's coin count
        remove(ref(database,`coins/${key}`));
        update(playerRef, {
          coins: players[playerId].coins + 1,
        });
      }
    }
  
  
    function handleArrowPress(xChange=0, yChange=0) {
      const newX = players[playerId].x + xChange;
      const newY = players[playerId].y + yChange;
      if (!isSolid(newX, newY)) {
        //move to the next space
        players[playerId].x = newX;
        players[playerId].y = newY;
        if (xChange === 1) {
          players[playerId].direction = "right";
        }
        if (xChange === -1) {
          players[playerId].direction = "left";
        }
        set(playerRef,
          players[playerId]
        );
        attemptGrabCoin(newX, newY);
      }
    }
  
    function initGame() {
  
      new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1))
      new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1))
      new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0))
      new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0))
  
      const allPlayersRef = ref(database,`players`);
      const allCoinsRef = ref(database,`coins`);
  
      onValue(allPlayersRef, (snapshot) => {
        //Fires whenever a change occurs
        players = snapshot.val() || {};
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          let el = playerElements[key];
          // Now update the DOM
          el.querySelector(".Character_name").innerText = characterState.name;
          el.querySelector(".Character_coins").innerText = characterState.coins;
          el.setAttribute("data-color", characterState.color);
          el.setAttribute("data-direction", characterState.direction);
          const left = 16 * characterState.x + "px";
          const top = 16 * characterState.y - 4 + "px";
          el.style.transform = `translate3d(${left}, ${top}, 0)`;
        })
      });


      onChildAdded(allPlayersRef, (snapshot) => {
        //Fires whenever a new node is added the tree
        const addedPlayer = snapshot.val();
        const characterElement = document.createElement("div");
        characterElement.classList.add("Character", "grid-cell");
        if (addedPlayer.id === playerId) {
          characterElement.classList.add("you");
        }
        characterElement.innerHTML = (`
          <div class="Character_shadow grid-cell"></div>
          <div class="Character_sprite grid-cell"></div>
          <div class="Character_name-container">
            <span class="Character_name"></span>
            <span class="Character_coins">0</span>
          </div>
          <div class="Character_you-arrow"></div>
        `);
        playerElements[addedPlayer.id] = characterElement;
  
        //Fill in some initial state
        characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
        characterElement.querySelector(".Character_coins").innerText = addedPlayer.coins;
        characterElement.setAttribute("data-color", addedPlayer.color);
        characterElement.setAttribute("data-direction", addedPlayer.direction);
        const left = 16 * addedPlayer.x + "px";
        const top = 16 * addedPlayer.y - 4 + "px";
        characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
        gameContainer.appendChild(characterElement);
      });
      
  
      //Remove character DOM element after they leave
      onChildRemoved(allPlayersRef, (snapshot) => {
        const removedKey = snapshot.val().id;
        gameContainer.removeChild(playerElements[removedKey]);
        delete playerElements[removedKey];
      });
      
  
      //New - not in the video!
      //This block will remove coins from local state when Firebase `coins` value updates
      onValue(allCoinsRef, (snapshot) => {
        coins = snapshot.val() || {};
      });
      

      onChildAdded(allCoinsRef, (snapshot) => {
        const coin = snapshot.val();
        const key = getKeyString(coin.x, coin.y);
        coins[key] = true;
  
        // Create the DOM Element
        const coinElement = document.createElement("div");
        coinElement.classList.add("Coin", "grid-cell");
        coinElement.innerHTML = `
          <div class="Coin_shadow grid-cell"></div>
          <div class="Coin_sprite grid-cell"></div>
        `;
  
        // Position the Element
        const left = 16 * coin.x + "px";
        const top = 16 * coin.y - 4 + "px";
        coinElement.style.transform = `translate3d(${left}, ${top}, 0)`;
  
        // Keep a reference for removal later and add to DOM
        coinElements[key] = coinElement;
        gameContainer.appendChild(coinElement);
      });
 

      onChildRemoved(allCoinsRef, (snapshot) => {
        const {x,y} = snapshot.val();
        const keyToRemove = getKeyString(x,y);
        gameContainer.removeChild( coinElements[keyToRemove] );
        delete coinElements[keyToRemove];
      });
     
  
  
      //Updates player name with text input
      playerNameInput.addEventListener("change", (e) => {
        const newName = e.target.value || createName();
        playerNameInput.value = newName;
        update(playerRef, {
          name: newName
        });
        
      })
  
      //Update player color on button click
      playerColorButton.addEventListener("click", () => {
        const mySkinIndex = playerColors.indexOf(players[playerId].color);
        const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
        update(playerRef, {
          color: nextColor
        });
        
      })
  
      //Place my first coin
      placeCoin();
  
    }
  
    onAuthStateChanged(auth, user => {
      console.log(user)
      if (user) {
        //You're logged in!
        playerId = user.uid;
        playerRef = ref(database, `players/${playerId}`);
  
        const name = createName();
        playerNameInput.value = name;
  
        const {x, y} = getRandomSafeSpot();

        set(playerRef, {
          id: playerId,
          name,
          direction: "right",
          color: randomFromArray(playerColors),
          x,
          y,
          coins: 0,
        })

        //remove me from Firebase when I diconnect
        onDisconnect(playerRef).remove().catch((error) => console.log(error));
  
        //Begin the game now that we are signed in
        initGame();
      } else {
        //You're logged out. this should be impssible
        window.location.href="index.html"; //just to be safe we will redirect you
      }
    })
  
  })();
  