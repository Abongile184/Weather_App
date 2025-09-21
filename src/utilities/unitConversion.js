export function cToF(celsius) {
  return (celsius * 9/5 + 32).toFixed(1);
}

export function fToC(fahrenheit) {
  return ((fahrenheit - 32) * 5/9).toFixed(1);
}
