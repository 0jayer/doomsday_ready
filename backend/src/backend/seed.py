from backend.database.database import Database
from backend.movie.movie_repositories import MovieRepository

# (title, year, runtime, prerequisite titles). Links follow the brief's sample data.
MOVIES = [
    ("Iron Man", 2008, 126, []),
    ("Captain America: The First Avenger", 2011, 124, []),
    ("The Avengers", 2012, 143, ["Iron Man", "Captain America: The First Avenger"]),
    ("Captain America: Civil War", 2016, 147, ["The Avengers"]),
    ("Thor: Ragnarok", 2017, 130, []),
    ("Avengers: Infinity War", 2018, 149, ["Captain America: Civil War", "Thor: Ragnarok"]),
    ("Avengers: Endgame", 2019, 181, ["Avengers: Infinity War"]),
    ("Avengers: Doomsday", 2026, 150, ["Avengers: Endgame"]),  # runtime is a placeholder
]


def main():
    db = Database()
    with db.connect() as conn:
        repo = MovieRepository(conn)
        if repo.list_all():
            print("Movies already exist, skipping seed.")
            return
        ids = {}
        for title, year, runtime, prereq_titles in MOVIES:
            movie = repo.create(title, year, runtime, [ids[t] for t in prereq_titles])
            ids[title] = movie.id
        print(f"Seeded {len(ids)} movies.")


if __name__ == "__main__":
    main()