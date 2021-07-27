(function () {
    // register vue component
    
    Vue.component("popup-image-component", {
        template: "#popup-image-component-template",
        props: ["imageId"],
        data: function () {
            return {
                popupImageData : null
            };
        },
        mounted: function () {
            // console.log("my first component mounted", this);
            console.log("this.imageId", this.imageId);
            axios
                .get("/imageboard")
                .then((results) => {
                    // console.log("this.images:", this.images);
                    this.popupImageData = results.data;
                    console.log(" results.data in popupImagedata", results.data);
                    console.log("this.popupImageData", this.popupImageData);
                })
                .catch((err) => console.log("err in component axios: ", err));
        },

        // function for click
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
            name: "Scallion",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            imageSelected: null,
        },
        mounted: function () {
            axios
                .get("/imageboard")
                .then((results) => {
                    // console.log("this.images:", this.images);
                    this.images = results.data;
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
        },
    });
})();
