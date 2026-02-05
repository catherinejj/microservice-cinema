/*⚠️ Point ultra important avant : NestJS ne sait pas injecter une interface TypeScript (elle disparaît à l’exécution).
Donc pour que le controller marche en runtime, il faut des tokens d’injection (provide: "ICinemaRepository" + @Inject("ICinemaRepository")).*/

export const REPO_TOKENS = {
  Cinema: Symbol("ICinemaRepository"),
  Room: Symbol("IRoomRepository"),
  Seat: Symbol("ISeatRepository"),
  Screening: Symbol("IScreeningRepository"),
  Movie: Symbol("IMovieRepository"),
} as const;