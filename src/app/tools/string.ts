export const shaStr = (input: string): string => {
  const saltStar = 'MarketMaker';
  const saltEnd = 'saltEndOS';
  const beforeStr = saltStar + input + saltEnd;
  let afterArr = [];
  for (let i = 0; i < beforeStr.length; i++) {
    afterArr.push(beforeStr.charCodeAt(i) + i);
  }
  let afterStr = afterArr.sort((a, b) => a - b).map(item => item.toString(16)).join('');
  while (afterStr.length < 64) {
    afterStr = '0' + afterStr;
  }
  let result = '0x';
  for (let i = 1; i <= afterStr.length; i++) {
    let next = '';
    if (i % 2) {
      next = afterStr[i];
    } else {
      next = afterStr[afterStr.length - i];
    }
    if (next > 'c') {
      next = next.toLocaleUpperCase();
    }
    result += next;
  }
  return result.slice(0, 66);
};
