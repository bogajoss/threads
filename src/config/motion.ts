export const motionTokens = {
    transition: {
        softSpring: {
            type: "spring",
            stiffness: 100,
            damping: 20,
        },
        fastSpring: {
            type: "spring",
            stiffness: 400,
            damping: 30,
        },
        sheetSpring: {
            type: "spring",
            stiffness: 350,
            damping: 35,
            mass: 0.8,
        },
        bounceSpring: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
    layout: {
        morph: {
            layout: true,
            transition: {
                type: "spring",
                stiffness: 350,
                damping: 30,
            },
        }
    },
    gesture: {
        tap: { scale: 0.96 },
        hover: { scale: 1.02 },
    }
} as const;
