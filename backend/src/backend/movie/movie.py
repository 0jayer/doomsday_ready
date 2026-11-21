from collections import defaultdict


class Movie:
    def __init__(
        self,
        id=None,
        title="",
        release_year=0,
        runtime_minutes=0,
        watched=False,
        prerequisites=(),
    ):
        self.id = id
        self.title = title
        self.release_year = release_year
        self.runtime_minutes = runtime_minutes
        self.watched = watched
        self.prerequisites = tuple(prerequisites)
        self._prerequisite_graph = defaultdict(list)

    @classmethod
    def build_graph(cls, edges):
        movie = cls()
        for movie_id, prerequisite_id in edges:
            movie.add_prerequisite(movie_id, prerequisite_id)
        return movie

    def add_prerequisite(self, movie_id, prerequisite_id):
        self._prerequisite_graph[movie_id].append(prerequisite_id)

    def prerequisite_ids(self, movie_id):
        return tuple(self._prerequisite_graph[movie_id])

    def can_reach(self, start, goal, visited):
        stack = [start]
        while stack:
            movie_id = stack.pop()
            if movie_id == goal:
                return True
            if movie_id in visited:
                continue
            visited.add(movie_id)
            stack.extend(self._prerequisite_graph[movie_id])
        return False

    def would_create_cycle(self, movie_id, new_prerequisites):
        visited = set()
        for prerequisite_id in new_prerequisites:
            if self.can_reach(prerequisite_id, movie_id, visited):
                return True
        return False

    def get_rewatch_order(self, target):
        visited = {target}
        order = []
        stack = [(target, iter(self._prerequisite_graph[target]))]
        while stack:
            movie_id, prerequisites = stack[-1]
            for prerequisite_id in prerequisites:
                if prerequisite_id not in visited:
                    visited.add(prerequisite_id)
                    stack.append(
                        (
                            prerequisite_id,
                            iter(self._prerequisite_graph[prerequisite_id]),
                        )
                    )
                    break
            else:
                stack.pop()
                if movie_id != target:
                    order.append(movie_id)
        return order

    def validate(self):
        if not self.title.strip():
            raise ValueError("title is required")
        if not 1 <= self.runtime_minutes <= 300:
            raise ValueError("runtime minutes must be between 1 and 300")
