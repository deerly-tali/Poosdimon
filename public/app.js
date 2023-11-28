import {auth} from './landing.js';
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
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
    minX: 4,
    maxX: 60,
    minY: 17,
    maxY: 43,
    blockedSpaces: {
      "5x24": true,
      "6x24": true,
      "7x24": true,
      "8x24": true,
      "9x24": true,
      "10x24": true,
      "11x24": true,
      "12x24": true,
      "13x24": true,
      "14x24": true,
      "15x24": true,
      "16x24": true,
      "16x23": true,
      "16x22": true,
      "16x21": true,
      "16x20": true,
      "16x19": true,
      "16x18": true,
      "16x17": true,
      "16x16": true,
      "16x15": true,
      "42x18": true,
      "42x19": true,
      "42x20": true,
      "42x21": true,
      "43x21": true,
      "44x21": true,
      "45x21": true,
      "46x21": true,
      "47x21": true,
      "47x22": true,
      "47x23": true,
      "48x23": true,
      "49x23": true,
      "50x23": true,
      "51x23": true,
      "52x23": true,
      "53x23": true,
      "54x23": true,
      "55x23": true,
      "56x23": true,
      "57x23": true,
      "58x23": true,
      "59x23": true,
      "60x23": true,
      "60x24": true,
      "60x25": true,
      "60x26": true,
      "60x27": true,
      "60x28": true,
      "60x29": true,
      "60x30": true,
      "60x31": true,
      "60x32": true,
      "61x32": true,
      "62x33": true,
      "62x34": true,
      "62x35": true,
      "62x36": true,
      "61x37": true,
      "60x37": true,
      "60x38": true,
      "60x39": true,
      "60x40": true,
      "60x41": true,
      "60x42": true,
      "60x43": true,
      "5x29": true,
      "6x29": true,
      "7x29": true,
      "8x29": true,
      "9x29": true,
      "10x29": true,
      "11x29": true,
      "12x29": true,
      "13x29": true,
      "14x29": true,
      "15x29": true,
      "16x29": true,
      "16x30": true,
      "16x31": true,
      "16x32": true,
      "16x33": true,
      "16x34": true,
      "16x35": true,
      "16x36": true,
      "16x37": true,
      "16x38": true,
      "16x39": true,
      "16x40": true,
      "16x41": true,
      "16x42": true,
      "16x43": true,
      "17x44": true,
      "18x44": true,
      "19x44": true,
      "20x44": true,
      "21x44": true,
      "22x44": true,
      "23x44": true,
      "24x44": true,
      "25x44": true,
      "26x44": true,
      "27x44": true,
      "28x44": true,
      "29x44": true,
      "30x44": true,
      "31x44": true,
      "32x44": true,
      "33x44": true,
      "34x44": true,
      "35x44": true,
      "36x44": true,
      "36x45": true,
      "36x46": true,
      "36x47": true,
      "36x48": true,
      "36x49": true,
      "40x44": true,
      "41x44": true,
      "42x44": true,
      "43x44": true,
      "44x44": true,
      "45x44": true,
      "46x44": true,
      "47x44": true,
      "48x44": true,
      "49x44": true,
      "50x44": true,
      "51x44": true,
      "52x44": true,
      "53x44": true,
      "54x44": true,
      "55x44": true,
      "56x44": true,
      "57x44": true,
      "58x44": true,
      "59x44": true,
      "40x45": true,
      "40x46": true,
      "40x47": true,
      "41x47": true,
      "42x47": true,
      "43x47": true,
      "44x47": true,
      "45x47": true,
      "46x47": true,
      "47x47": true,
      "48x47": true,
      "48x48": true,
      "48x49": true,      
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
      "HI",
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
      "CHARIZARD",
      "CYNDAQUIL",
      "LUGIA",
      "GENGAR",
      "TOGEPI",
      "SQUIRTLE",
      "ZEKROM",
      "DARKRAI",
      "SHAYMIN"
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
      { x: 17, y: 17 },
      { x: 27, y: 23 },
      { x: 39, y: 24 },
      { x: 47, y: 29 },
      { x: 58, y: 35 },
      { x: 55, y: 42 },
      { x: 27, y: 42 }, 
      { x: 17, y: 35 },
      { x: 37, y: 35 },
      { x: 52, y: 25 },
      { x: 33, y: 19 },
      { x: 17, y: 19 },
      { x: 6 , y: 29 },
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
    const character = document.querySelector(".Character");
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
        var camera_left = 16*20;
        var camera_top = 16*20;
        gameContainer.style.transform = `translate3d(${-newX*16+camera_left}px, ${-newY*16+camera_top}px, 0)`;
        //character.style.transform = `translate3d(${-newX*16+camera_left}px, ${-newY*16+camera_top}px, 0)`;
        attemptGrabCoin(newX, newY);
      }
    }

    window.handleArrowPress = handleArrowPress;
  
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
