## imageboard Project

An interactive imageboard in the style of Pinterest, this project demonstrates familiarity with PostGreSQL, Amazon S3, Vue.js provides for SPA (single page app) functionality, with the page dynamically updating it’s contents as they become available.

https://user-images.githubusercontent.com/83556443/135118957-daa8ab91-b78f-470a-8f8c-b10420880552.mp4

Users can upload photos to the imageboard with a title and description. Users can also click on the photos and leave a comment their username.

The server interacts with Amazon’s S3 service to host the image files that users have uploaded, before returning the new hyperlink that is automatically piped into Vue’s dynamically updated components. A database stores these references for later. Another database stores user comments.

### Technologies

*Vue.js
*Masonry layout
*Amazon Web Services S3
*bcrypt
*PostGreSQL
*Node.js
*express.js

