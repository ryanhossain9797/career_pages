/**
 * Generates a consistent visual variant class based on a numeric index.
 * Uses simple modulo arithmetic for predictable, evenly distributed styling.
 */
export function getCardVariant(index: number): string {
    const classes = [];

    // Orange Accent: Every 7th or 10th card
    if (index % 7 === 0 || index % 10 === 0) {
        classes.push('accent-orange');
    }

    // Dot Pattern: Every 5th card (roughly similar freq to orange)
    // Avoid overlap preference if desired, but CSS handles it via stacking usually.
    if (index % 5 === 0) {
        classes.push('pattern-dot');
    }
    // Grid Pattern: Rare (every 23rd card)
    else if (index % 23 === 0) {
        classes.push('pattern-grid');
    }

    return classes.join(' ');
}
