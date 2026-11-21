class Cinema:
    def __init__(self, id=None, name="", bundle_sizes=()):
        self.id = id
        self.name = name
        self.bundle_sizes = tuple(bundle_sizes)

    def validate(self):
        if not self.name.strip():
            raise ValueError("name is required")
        if not 1 <= len(self.bundle_sizes) <= 10:
            raise ValueError("cinema must have between 1 and 10 bundle sizes")
        if len(set(self.bundle_sizes)) != len(self.bundle_sizes):
            raise ValueError("bundle sizes must be distinct")
        if any(not 1 <= size <= 500 for size in self.bundle_sizes):
            raise ValueError("bundle sizes must be between 1 and 500")

    def booking_quote(self, group_size):
        if not 1 <= group_size <= 10_000:
            raise ValueError("group size must be between 1 and 10000")
        if not 1 <= len(self.bundle_sizes) <= 10:
            raise ValueError("cinema must have between 1 and 10 bundle sizes")
        if len(set(self.bundle_sizes)) != len(self.bundle_sizes):
            raise ValueError("bundle sizes must be distinct")
        if any(not 1 <= size <= 500 for size in self.bundle_sizes):
            raise ValueError("bundle sizes must be between 1 and 500")

        unreachable = group_size + 1
        bundle_sizes = sorted(set(self.bundle_sizes))
        dp = [unreachable] * (group_size + 1)
        previous = [None] * (group_size + 1)
        dp[0] = 0

        for seats in range(1, group_size + 1):
            for bundle in bundle_sizes:
                if bundle <= seats and dp[seats - bundle] != unreachable:
                    candidate = dp[seats - bundle] + 1
                    if candidate < dp[seats]:
                        dp[seats] = candidate
                        previous[seats] = bundle

        if dp[group_size] == unreachable:
            return None

        combination = {}
        seats = group_size
        while seats > 0:
            bundle = previous[seats]
            combination[bundle] = combination.get(bundle, 0) + 1
            seats -= bundle

        return {
            "total_bundles": dp[group_size],
            "combination": combination,
        }
