def booking_quote(bundle_sizes, group_size):
    INF = float("inf")

    dp = [INF] * (group_size + 1)
    previous = [None] * (group_size + 1)

    dp[0] = 0

    for seats in range(1, group_size + 1):
        for bundle in bundle_sizes:

            if bundle <= seats and dp[seats - bundle] != INF:

                candidate = dp[seats - bundle] + 1

                if candidate < dp[seats]:
                    dp[seats] = candidate
                    previous[seats] = bundle

    # No exact combination exists
    if dp[group_size] == INF:
        return None

    # Reconstruct the combination
    combination = {}

    seats = group_size

    while seats > 0:
        bundle = previous[seats]

        combination[bundle] = combination.get(bundle, 0) + 1

        seats -= bundle

    return {
        "total_bundles": dp[group_size],
        "combination": combination
    }