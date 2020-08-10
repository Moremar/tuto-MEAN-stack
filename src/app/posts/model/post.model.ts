// Post representation in the Angular app
export class Post {
    constructor(
        public id: string,
        public userId: string,
        public username: string,
        public title: string,
        public content: string,
        public imagePath: string
    ) {}
}
