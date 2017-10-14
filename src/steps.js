export const START = 'START';
export const COMPLETED = 'COMPLETED';
export const FAILED = 'FAILED';

export let steps = {
    [START]: 'START',
    [COMPLETED]: 'COMPLETED',
    [FAILED]: 'FAILED'
};

export const setupSteps = customSteps => steps = {steps, ...customSteps};
