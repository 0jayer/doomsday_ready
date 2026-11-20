from collections import defaultdict


class Graph:
    def __init__(self):
        self.graph = defaultdict(list)

    def add_edge(self, movie, prerequisite):
        self.graph[movie].append(prerequisite)

    def can_reach(self, start, goal, visited):
        stack = [start]
        while stack:
            movie = stack.pop()
            if movie == goal:
                return True
            if movie in visited:
                continue
            visited.add(movie)
            stack.extend(self.graph[movie])
        return False

    def would_create_cycle(self, movie_id, new_prereqs):
        # True if giving movie_id these prerequisites would create a cycle
        visited = set()
        for prereq in new_prereqs:
            if self.can_reach(prereq, movie_id, visited):
                return True
        return False

    def get_rewatch_order(self, target):
        visited = {target}
        order = []
        stack = [(target, iter(self.graph[target]))]   # (movie, its prerequisites still to explore)
        while stack:
            movie, prereqs = stack[-1]
            for prereq in prereqs:
                if prereq not in visited:
                    visited.add(prereq)
                    stack.append((prereq, iter(self.graph[prereq])))
                    break                              # go deeper first
            else:                                      # no prerequisites left to explore
                stack.pop()
                if movie != target:
                    order.append(movie)                # appended after its prerequisites
        return order
    