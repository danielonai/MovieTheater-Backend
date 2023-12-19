export default interface UpdateMovieRequest {
    title?: string;
    description?: string;
    duration?: string;
    cover?: string;
    screenings: Screening[]|[];
    deletedScreenings?: deletedScreening[];
}

interface Screening {
    date: Date;
}
interface deletedScreening {
    id: string;
}