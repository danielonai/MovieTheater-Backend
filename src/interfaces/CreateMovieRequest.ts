export default interface CreateMovieRequest {
    title: string;
    description: string;
    duration: string;
    cover?: string;
    screenings: Screening[];

}

interface Screening {
    date: Date;
}
