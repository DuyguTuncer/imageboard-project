(function () {
    Vue.component("comments-component", {
        template: "#comments-component-template",
        props: ["imageId"],
        data: function () {
            return {
                comments: [],
                commentusername: "",
                commenttext: "",
            };
        },

        mounted: function () {
            console.log(
                "component for comments is mounted heheheh",
                this.imageId
            );
            //
            let imageId = this.imageId;
            console.log("imageId", imageId);

            axios
                .get("/comments/" + imageId)
                .then((results) => {
                    this.comments = results.data;
                    // this.comments.push(results.data[0]);
                    console.log(" this.comments in vue : ", this.comments);
                })
                .catch((err) =>
                    console.log("err in comments component axios: ", err)
                );
        },

        methods: {
            submitComment: function () {
                console.log("Submit button clicked");
                axios
                    .post("/comment", {
                        commenttext: this.commenttext,
                        commentusername: this.commentusername,
                        imageId: this.imageId,
                    })

                    .then((results) => {
                        this.comments.push(results.data);
                        console.log("this.comments", this.comments);
                    })
                    .catch((err) => {
                        console.log("error in comments post in vue", err);
                    });
            },
        },
    });

    Vue.component("popup-image-component", {
        template: "#popup-image-component-template",
        props: ["imageId"],
        data: function () {
            return {
                popupImageData: {},
            };
        },
        mounted: function () {
            // console.log("my first component mounted", this);
            console.log("this.imageId", this.imageId);

            let imageId = this.imageId;
            axios
                .get("/imageboard/" + imageId)
                .then((results) => {
                    // console.log("this.images:", this.images);

                    const filtered = results.data.filter(
                        (obj) => obj.id == this.imageId
                    );
                    this.popupImageData = filtered[0];

                    console.log("filtered[0]", filtered[0]);
                    console.log(" this.popupImageData", results.data);
                })
                .catch((err) => console.log("err in component axios: ", err));
        },

        methods: {
            xClicked: function () {
                console.log("xClicked, emiter works");
                this.$emit("close");
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            name: "My Image Board",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            moreButton: true,
            imageSelected: null,
            //  imageSelected: location.hash.slice(1)
            // I changed here from null to hash for part 5
            // make it so when the user clicks, hash changes
        },
        mounted: function () {
            axios
                .get("/imageboard")
                .then((results) => {
                    // console.log("this.images:", this.images);
                    this.images = results.data;

                    // console.log(
                    //     "results.data in /imageboard axios:",
                    //     results.data
                    // );
                })
                .catch((err) => console.log("err in /imageboard: ", err));
        },

        methods: {
            uploadImage: function () {
                console.log("this.title:", this.title);
                var title = this.title;
                var description = this.description;
                var username = this.username;
                var file = this.file;
                console.log("this", this);

                var formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("username", username);
                formData.append("file", file);
                axios.post("/upload", formData).then((results) => {
                    this.images.unshift({
                        id: results.data.id,
                        url: results.data.url,
                        title: results.data.title,
                        description: results.data.description,
                        username: results.data.username,
                    });
                });
            },
            userFileSelection: function (event) {
                this.file = event.target.files[0];
            },

            // part 3
            selectImage: function (id) {
                console.log("id passed to selectedImage", id);
                this.imageSelected = id;
            },
            closeMe: function () {
                console.log("the component emited close");
                this.imageSelected = null;
            },

            // part 4
            seeMore: function () {
                console.log(
                    "I clicked the more button, this.images: ",
                    this.images
                );

                let getLastObjInArray = this.images[this.images.length - 1];
                let smallestId = getLastObjInArray.id;

                // console.log("getLastObjInArray", getLastObjInArray);
                // console.log("smallestId:", smallestId);

                axios
                    .get("/showmore/" + smallestId)
                    .then((results) => {
                        console.log("results.data:", results.data);
                        for (let i = 0; i < results.data.length; i++) {
                            this.images.push(results.data[i]);
                        }
                        if (results.data.length == 0) {
                            this.moreButton = false;
                        }
                    })
                    .catch((err) => console.log("err in /showmore: ", err));
            },
        },
    });
})();
