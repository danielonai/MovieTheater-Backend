import { PrismaClient } from '@prisma/client'
import  bcrypt  from 'bcrypt';

// Create an instance of PrismaClient
const prisma = new PrismaClient();

async function seed() {
  try {
    // Seed Users
    const user1 = await prisma.user.create({
      data: {
        username: 'John Doe',
        email: 'theadmin@example.com',
        password: await bcrypt.hash('password', 10) ,
        role: 'ADMIN',
      },
    });
    const user2 = await prisma.user.create({
      data: {
        username: 'Israel Israeli',
        email: 'theuser@example.com',
        password: await bcrypt.hash('password', 10) ,
        role: 'USER',
      },
    });

    // Seed Movies
    const movie1 = await prisma.movie.create({
      data: {
        title: 'Inception',
        description: 'A mind-bending thriller about dreams within dreams.',
        duration: '148',
        cover: 'https://picsum.photos/200/300?random=1',
      },
    });
    const movie2 = await prisma.movie.create({
      data: {
        title: 'The Shawshank Redemption',
    description: 'A story of hope and friendship in the face of adversity.',
    duration: '142',
        cover: 'https://picsum.photos/200/300?random=2',
      },
    });
    const movie3 = await prisma.movie.create({
      data: {
        title: 'The Dark Knight',
        description: 'The caped crusader faces his greatest foe, the Joker.',
        duration: '152',
        cover: 'https://picsum.photos/200/300?random=3',
      },
    });
    const movie4 = await prisma.movie.create({
      data: {
        title: 'Forrest Gump',
        description: 'Life is like a box of chocolates for Forrest Gump.',
        duration: '142',
        cover: 'https://picsum.photos/200/300?random=4',
      },
    });

    // Seed Screenings
    const screening1 = await prisma.screening.create({
      data: {
        date: new Date('2024-01-31T18:00:00'),
        movieId: movie1.id,
      },
    });
    const screening2 = await prisma.screening.create({
      data: {
        date: new Date('2024-01-01T12:00:00'),
        movieId: movie1.id,
      },
    });
    const screening3 = await prisma.screening.create({
      data: {
        date: new Date('2024-01-04T18:00:00'),
        movieId: movie2.id,
      },
    });
    const screening4 = await prisma.screening.create({
      data: {
        date: new Date('2023-12-28T13:00:00'),
        movieId: movie3.id,
      },
    });
    const screening5 = await prisma.screening.create({
      data: {
        date: new Date('2024-01-02T18:00:00'),
        movieId: movie3.id,
      },
    });
    const screening6 = await prisma.screening.create({
      data: {
        date: new Date('2023-12-28T18:00:00'),
        movieId: movie3.id,
      },
    });
    const screening7 = await prisma.screening.create({
      data: {
        date: new Date('2023-12-22T17:00:00'),
        movieId: movie4.id,
      },
    });
    const screening8 = await prisma.screening.create({
      data: {
        date: new Date('2023-12-26T15:00:00'),
        movieId: movie4.id,
      },
    });
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close the PrismaClient connection
    await prisma.$disconnect();
  }
}

// Call the seed function
seed();
