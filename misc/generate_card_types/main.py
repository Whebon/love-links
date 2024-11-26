bronzeLinks = [
#    2  3  4  5  6  7  8  9  10 M
    [0, 2, 2, 2, 2, 2, 2, 0, 0, 0 ], # 2
    [1, 0, 2, 2, 2, 2, 0, 0, 0, 0 ], # 3
    [1, 0, 0, 2, 2, 0, 0, 0, 0, 0 ], # 4
    [1, 1, 2, 0, 0, 0, 0, 0, 0, 0 ], # 5
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], # 6
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2 ], # 7
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], # 8
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], # 9
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], # 10
]

silverLinks = [
#    2  3  4  5  6  7  8  9  10 M
    [0, 0, 0, 0, 0, 0, 0, 2, 2, 0 ], # 2
    [0, 0, 0, 0, 0, 0, 2, 2, 2, 0 ], # 3
    [0, 0, 0, 0, 0, 2, 2, 2, 0, 0 ], # 4
    [0, 0, 0, 0, 2, 0, 2, 0, 0, 0 ], # 5
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ], # 6
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ], # 7
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], # 8
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 2 ], # 9
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 2 ], # 10
]

goldLinks = [
#    2  3  4  5  6  7  8  9  10 M
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], # 2
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], # 3
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 0 ], # 4
    [0, 0, 0, 0, 0, 1, 0, 2, 2, 1 ], # 5
    [0, 0, 0, 0, 0, 0, 1, 0, 2, 0 ], # 6
    [0, 0, 0, 0, 0, 0, 2, 1, 2, 0 ], # 7
    [0, 0, 0, 0, 1, 0, 0, 1, 2, 0 ], # 8
    [0, 0, 0, 0, 1, 0, 2, 0, 2, 0 ], # 9
    [0, 0, 1, 0, 0, 1, 1, 1, 0, 0 ], # 10
]

MASTER = "MASTER" #6*8*5
linkId = 1
output = "self::$CARD_TYPES = [\n"


def getBonus(key, lock):
    if key == 10 and lock == 7:
        return "DIAMOND"
    if key == 7 and lock == 2:
        return "DIAMOND"
    if key == 7 and lock != MASTER:
        return "EMERALD"
    return "NOBONUS"


for (metal, links) in [("BRONZE", bronzeLinks), ("SILVER", silverLinks), ("GOLD", goldLinks)]:
    for (key, nbrs) in zip([2, 3, 4, 5, 6, 7, 8, 9, 10], links):
        for (lock, nbr) in zip([2, 3, 4, 5, 6, 7, 8, 9, 10, MASTER], nbrs):
            for _ in range(nbr):
                output += (f"    {linkId} => [\n"
                           f"        \"key\" => {key},\n"
                           f"        \"lock\" => {lock},\n"
                           f"        \"metal\" => {metal},\n"
                           f"        \"bonus\" => {getBonus(key, lock)}\n"
                           f"    ],\n")
                linkId += 1
output += "];"
print(output)
