import express, { Request, Response } from "express";
import MessageResponse from "../interfaces/MessageResponse";
import { prisma } from "../db";
import UpdateMovieRequest from "../interfaces/UpdateMovieRequest";
import CreateMovieRequest from "../interfaces/CreateMovieRequest";
import { isAdmin } from "../middlewares";

const router = express.Router();

router.get<{}, MessageResponse>("/:id", async (req: Request, res: Response<MessageResponse>) => {
	try {
		const movieId = req.params.id;
		const movie = await prisma.movie.findUniqueOrThrow({
			where: {
				id: movieId,
			},
			include: {
				screenings: true,
			},
		});

		if (!movie) {
			return res.status(404).json({ message: "Movie not found" });
		}

		const messageResponse: MessageResponse = {
			movie: {
				...movie,
			},
		};

		res.json(messageResponse);
	} catch (error) {
		console.error("Error fetching movie:", error);
		res.status(500).json({ message: "Error fetching movie" });
	}
});

router.put<{ id: string }, MessageResponse>(
	"/:id",
	isAdmin,
	async (req: Request<{ id: string }, {}, UpdateMovieRequest>, res: Response<MessageResponse>) => {
		try {
			const movieId = req.params.id;
			const { title, description, duration, screenings } = req.body;
			var updatedMovie;
			if (screenings.length > 0) {
				updatedMovie = await prisma.movie.update({
					where: { id: movieId },
					data: {
						title,
						description,
						duration,
						screenings: {
							createMany: {
								data: screenings,
							},
						},
					},
				});
			} else {
				updatedMovie = await prisma.movie.update({
					where: { id: movieId },
					data: {
						title,
						description,
						duration,
					},
				});
			}

			const messageResponse: MessageResponse = {
				message: "Movie updated successfully",
				movie: updatedMovie,
			};

			res.json(messageResponse);
		} catch (error) {
			console.error("Error updating movie:", error);
			res.status(500).json({ message: "Error updating movie" });
		}
	}
);

router.delete<{ id: string }, MessageResponse>(
	"/:id",
	isAdmin,
	async (req: Request<{ id: string }, MessageResponse>, res: Response<MessageResponse>) => {
		try {
			const movieId = req.params.id;

			const deletedMovie = await prisma.movie.delete({
				where: { id: movieId },
			});

			if (!deletedMovie) {
				return res.status(404).json({ message: "Movie not found" });
			}

			const messageResponse: MessageResponse = {
				message: "Movie deleted successfully",
			};

			res.json(messageResponse);
		} catch (error) {
			console.error("Error deleting movie:", error);
			res.status(500).json({ message: "Error deleting movie" });
		}
	}
);

router.post<{}, MessageResponse>(
	"/create",
	isAdmin,
	async (req: Request<{}, {}, CreateMovieRequest>, res: Response<MessageResponse>) => {
		try {
			const { title, description, duration, screenings } = req.body;

			const createdMovie = await prisma.movie.create({
				data: {
					title,
					description,
					duration,
					cover: `https://picsum.photos/200/300?random=${Math.random() * 100}`,
					screenings: {
						createMany: {
							data: screenings,
						},
					},
				},
			});

			const messageResponse: MessageResponse = {
				message: "Movie created successfully",
				movie: createdMovie,
			};

			res.json(messageResponse);
		} catch (error) {
			console.error("Error creating task:", error);
			res.status(500).json({ message: "Error creating task" });
		}
	}
);

export default router;
