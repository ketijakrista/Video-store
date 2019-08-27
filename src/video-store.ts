//ts-node src/index.ts

export class Video {
    user: string;
    name: string;
    ratings: number[];
    _isRented: boolean;
    timesRented: number;

    constructor(name: string, rating: number) {
        this.name = name;
        this._isRented = false;
        this.user = "";
        this.ratings = [];
        this.ratings.push(rating)
        
        this.timesRented = 0;
    }

    get print() {
        return `${this.name} (Rating: ${Math.ceil(this.averageRating())}, Liked by: ${this.likes()}) -${(this.isRented) ? ` RENTED OUT` : ` AVAILABLE`}`;
    }

    rent(user: string) {
        this.user = user;
        this.timesRented++;
    }
    get isRented() {
        return this.user !== "";
    }

    return(rating: number) {
        this.user = "";
        this.ratings.push(rating);
    }
    averageRating() {
        let sum = this.ratings.reduce((acc, current) => acc + current)
        return sum / this.ratings.length;
    }
    likes() {
        const ratingCount = this.ratings.length-1;
        const likes = [];
        for (let i=1; i<this.ratings.length;i++) {
            if(this.ratings[i]>5) {
                likes.push(this.ratings[i])
            }    
        }
        if(this.ratings.length <= 1) {
            return 'NONE'
        }else 
        return `${Math.ceil((likes.length / ratingCount) * 100)}%`
    }
}

export class VideoStore {
    movies: Video[];
    constructor() {
        this.movies = [];
    }
    addMovie(movie: string, rating: number) {
        this.movies.push(new Video(movie, rating));
    }
    get printContent() {
        return this.movies.map(movie => movie.print).join('\n');
    }
    get asChoices() {
        return this.movies
            .filter(movie => movie.isRented === false)
            .map(movie => ({ name: `${movie.name} (Rating: ${movie.averageRating()})  `, value: movie }));
    }
    rentMovies(movies: Video[], user: string) {
        for (const movie of movies) {
            movie.rent(user);
        }
    }
    returnMovies(movie: Video, rating: number) {
        movie.return(rating);
    }

    rentedMovies(user: string) {
        return this.movies
            .filter(movie => movie.user === user)
            .map(movie => ({ name: movie.name, value: movie }))
    }
}