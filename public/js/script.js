(function () {
    new Vue({
        el: "#main",
        data: {
            name: "Scallion",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },
        mounted: function () {
            axios
                .get("/imageboard")
                .then((results) => {
                    console.log("results.data: ", results.data);
                    console.log("this INSIDE of axios: ", this);
                    console.log("this.images:", this.images);
                    console.log("this.title:", this.title);
                    this.images = results.data;
                })
                .catch((err) => console.log("err in /imageboard: ", err));
        },

        // v-model works only with the value of the form.

        methods: {
            uploadImage: function () {
                console.log("this.title:", this.title);
                var title = this.title;
                var description = this.description;
                var username = this.username;
                var file = this.file;
                console.log("this", this);

                // files are going to be sent as chunks

                var formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("username", username);
                formData.append("file", file);
                axios.post("/upload", formData).then((results) => {
                    this.images.unshift({
                        url: results.data.url,
                        username: results.data.username,
                        title: results.data.title,
                        description: results.data.description,
                    });
                });
            },
            userFileSelection: function (event) {
                this.file = event.target.files[0];
            },
        },
    });
})();
