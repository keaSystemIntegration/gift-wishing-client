export default async function (context) {
    return `Hello ${context.bindings.name}!`;
};