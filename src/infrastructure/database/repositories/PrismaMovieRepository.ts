import { Injectable } from "@nestjs/common";
import type { IMovieRepository } from "../../../domain/repositories";
import { Movie } from "../../../domain/entities/Movie";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class PrismaMovieRepository implements IMovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(movie: Movie): Promise<string> {
    // Prisma génère l'id (@default(cuid())) => on n'envoie PAS d'id
    const created = await this.prisma.movie.create({
      data: {
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        coverImage: movie.coverImage ?? null,
        category: movie.category,
        releaseDate: movie.releaseDate,
        rating: movie.rating,
      },
      select: { id: true },
    });

    return created.id;
  }

  async update(movie: Movie): Promise<void> {
    // update => ici l'id DOIT exister (il vient de Prisma quand on a lu l'entité)
    if (!movie.id) {
      throw new Error("PrismaMovieRepository.update: movie.id is required");
    }

    await this.prisma.movie.update({
      where: { id: movie.id },
      data: {
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        coverImage: movie.coverImage ?? null,
        category: movie.category,
        releaseDate: movie.releaseDate,
        rating: movie.rating,
      },
    });
  }

  async findById(id: string): Promise<Movie | null> {
    const row = await this.prisma.movie.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByTitleAndReleaseDate(
    title: string,
    releaseDate: Date
  ): Promise<Movie | null> {
    const row = await this.prisma.movie.findUnique({
      where: {
        title_releaseDate: {
          title,
          releaseDate,
        },
      },
    });

    return row ? this.toDomain(row) : null;
  }

  async list(): Promise<Movie[]> {
    const rows = await this.prisma.movie.findMany({
      orderBy: { releaseDate: "desc" },
    });
    return rows.map((r) => this.toDomain(r));
  }

  // ---------- Mapping ----------
  private toDomain(row: {
    id: string;
    title: string;
    description: string;
    duration: number;
    coverImage: string | null;
    category: string;
    releaseDate: Date;
    rating: number;
  }): Movie {
    // On utilise Movie.create() (id optionnel dans le domain)
    // Ici, on passe l'id parce qu'il vient de Prisma.
    return Movie.create({
      id: row.id,
      title: row.title,
      description: row.description,
      duration: row.duration,
      coverImage: row.coverImage,
      category: row.category,
      releaseDate: row.releaseDate,
      rating: row.rating,
      // screenings: [] // optionnel
    });
  }
}