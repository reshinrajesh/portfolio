export interface Trip {
    id: string;
    place: string;
    coordinates: [number, number]; // [lat, long]
    date: string;
    description: string;
    tags: string[];
}

export const TRIPS: Trip[] = [
    {
        id: "1",
        place: "Mumbai, Maharashtra",
        coordinates: [19.0760, 72.8777],
        date: "2024",
        description: "The city of dreams. Explored the vibrant streets, Marine Drive, and the fast-paced life of Mumbai.",
        tags: ["City", "Culture", "Food"],
    },
];
