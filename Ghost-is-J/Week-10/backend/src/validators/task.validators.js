export const validateTaskInput = (data) => {
    if (!data.title || typeof data.title !== 'string') {
        return {error: new Error('Description must be a string if provoided')};
    }

    return {error: null};
};