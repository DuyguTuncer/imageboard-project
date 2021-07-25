(function () {
    new Vue({
        el: "#main",
        data: {
            name: "Scallion",
            images: [],
        }, // data ends here
        mounted: function () {
            console.log("my vue instance has mounted");
            console.log("this OUTSIDE of axios: ", this);
            axios
                .get("/imageboard")
                .then((results) => {
                    console.log("response from /images: ", results.data);
                    console.log("this INSIDE of axios: ", this);
                    console.log("this.images:", this.images);
                    this.images = results.data;
                })
                .catch((err) => console.log("err in /imageboard: ", err));
        },
    });
})();
