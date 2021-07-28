(function () {

    Vue.component("comments-component", {
        template: "#comments-component-template",
        props: [],
        data: function () {
            return {
                popupImageData: null,
            };
        },
        methods: {
            test: function () {
                console.log("I am clicked");
            },
        },
        
    });

    Vue.component("popup-image-component", {
        template: "#popup-image-component-template",
        props: ["imageId"],
        data: function () {
            return {
                popupImageData: null,
            };
        },
        mounted: function () {
            // console.log("my first component mounted", this);
            console.log("this.imageId", this.imageId);
            axios
                .get("/imageboard")
                .then((results) => {
                    // console.log("this.images:", this.images);

                    const filtered = results.data.filter(
                        (obj) => obj.id == this.imageId
                    );
                    this.popupImageData = filtered[0];

                    console.log(" this.popupImageDat", results.data);
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
            seeMore: function () {
                console.log("I clicked the more button");
            },
        },
    });
})();
