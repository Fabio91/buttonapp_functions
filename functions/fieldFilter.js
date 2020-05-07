var isEqual = require('lodash.isequal');

const isEquivalent = (before, after) => {
    return before && typeof before.isEqual === 'function'
        ? before.isEqual(after)
        : isEqual(before, after);
};
const conditions = {
    CHANGED: (fieldBefore, fieldAfter) => fieldBefore !== undefined &&
        fieldAfter !== undefined &&
        !isEquivalent(fieldBefore, fieldAfter),
    ADDED: (fieldBefore, fieldAfter) => fieldBefore === undefined && fieldAfter,
    REMOVED: (fieldBefore, fieldAfter) => fieldBefore && fieldAfter === undefined,
};
exports.field = (fieldPath, operation, handler) => {
    return function (change, context) {
        const fieldBefore = change.before.get(fieldPath);
        const fieldAfter = change.after.get(fieldPath);
        return conditions[operation](fieldBefore, fieldAfter)
            ? handler(change, context)
            : Promise.resolve();
    };
};
//export default field;