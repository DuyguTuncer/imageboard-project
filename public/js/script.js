const vue = require("./vue");

// This is going to contain all of our vue code
console.log("script is linked");

(function() {
    new vue({
        // el is shirt for element
        // This is how we connect vue with our container #main html
        el : "#main",
        data : {
            name: "Scallion",
            seen: true,
            // if false, you don't see it
            // looping through
        
        }
    });

})();