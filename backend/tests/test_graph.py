from backend.movie.movie import Movie


def test_movie_entity():
    movie = Movie(
        id=1,
        title="Iron Man",
        release_year=2008,
        runtime_minutes=126,
        watched=False,
        prerequisites=(2, 3),
    )
    assert movie.title == "Iron Man"
    assert movie.prerequisites == (2, 3)


def build(edges):
    return Movie.build_graph(edges)


# Iron Man=1, First Avenger=2, Avengers=3, Civil War=4,
# Ragnarok=5, Infinity War=6, Endgame=7, Doomsday=8
MCU = [(3, 1), (3, 2), (4, 3), (6, 4), (6, 5), (7, 6), (8, 7)]


def assert_valid_order(g, order):
    """Every movie must come after all of its own prerequisites."""
    position = {movie: i for i, movie in enumerate(order)}
    for movie in order:
        for prereq in g.prerequisite_ids(movie):
            assert position[prereq] < position[movie]


def test_cycle_detection():
    g = build(MCU)
    assert g.would_create_cycle(1, [7]) is True    # Endgame -> Iron Man
    assert g.would_create_cycle(1, [1]) is True    # self-dependency
    assert g.would_create_cycle(5, [2]) is False
    assert g.would_create_cycle(1, [2]) is False


def test_rewatch_order_doomsday():
    g = build(MCU)
    order = g.get_rewatch_order(8)
    assert sorted(order) == [1, 2, 3, 4, 5, 6, 7]   # all 7, each once
    assert_valid_order(g, order)


def test_rewatch_order_civil_war():
    g = build(MCU)
    order = g.get_rewatch_order(4)
    assert sorted(order) == [1, 2, 3]
    assert order[-1] == 3                           # The Avengers comes last


def test_rewatch_order_no_prerequisites():
    assert build(MCU).get_rewatch_order(5) == []


def test_diamond_has_no_duplicates():
    # D needs B and C, both need A: A must appear once
    g = build([(4, 2), (4, 3), (2, 1), (3, 1)])
    order = g.get_rewatch_order(4)
    assert sorted(order) == [1, 2, 3]
    assert_valid_order(g, order)


def test_indirect_cycle():
    # A(1) needs B(2), B needs C(3); making C need A closes the loop
    g = build([(1, 2), (2, 3)])
    assert g.would_create_cycle(3, [1]) is True