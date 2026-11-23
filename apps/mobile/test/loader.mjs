export function resolve(specifier, context, nextResolve) {
  if (specifier === 'react-native') {
    return {
      shortCircuit: true,
      url: new URL('./react-native-mock.mjs', import.meta.url).href,
    };
  }
  return nextResolve(specifier, context);
}
