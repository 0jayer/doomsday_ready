from backend.cinema.cinema import Cinema


def test_brief_cases():
    assert Cinema(bundle_sizes=(1, 3, 4)).booking_quote(6) == {
        "total_bundles": 2,
        "combination": {3: 2},
    }
    assert Cinema(bundle_sizes=(2, 5)).booking_quote(11) == {
        "total_bundles": 4,
        "combination": {5: 1, 2: 3},
    }
    assert Cinema(bundle_sizes=(6, 9, 20)).booking_quote(44) == {
        "total_bundles": 4,
        "combination": {20: 1, 9: 2, 6: 1},
    }
    assert Cinema(bundle_sizes=(4, 6)).booking_quote(7) is None


def test_greedy_would_fail():
    # greedy takes 20 + 20 and gets stuck on 4
    assert Cinema(bundle_sizes=(6, 9, 20)).booking_quote(44)["total_bundles"] == 4


def test_single_bundle_and_smallest_group():
    assert Cinema(bundle_sizes=(7, 3)).booking_quote(7) == {
        "total_bundles": 1,
        "combination": {7: 1},
    }
    assert Cinema(bundle_sizes=(1,)).booking_quote(1) == {
        "total_bundles": 1,
        "combination": {1: 1},
    }


def test_tie_goes_to_smallest_bundle_regardless_of_input_order():
    expected = {"total_bundles": 2, "combination": {2: 1, 5: 1}}
    assert Cinema(bundle_sizes=(2, 3, 4, 5)).booking_quote(7) == expected
    assert Cinema(bundle_sizes=(5, 4, 3, 2)).booking_quote(7) == expected


def test_largest_input_is_fast():
    result = Cinema(bundle_sizes=(7, 13, 500)).booking_quote(10000)
    assert result is not None