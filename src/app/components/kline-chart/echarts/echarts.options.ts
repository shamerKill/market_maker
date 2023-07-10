import { EChartOption } from 'echarts';
// 导出echarts配置
// 导出k线配置
const themeGray = '#abb1cb';
const defaultThemeColor = '#7373f7';
const themeGreen = '#32b28f';
const themeRed = '#f65449';

// 折线数据类型
export type TypeKlineValue = {
  time: string; // 格式化时间
  maxPrice: string; // 最高价
  minPrice: string, // 最低价
  openPrice: string; // 开盘价
  closePrice: string; // 关盘价
  volume: string; // 成交量
  create_unix?: string; // 后台传入时间
  symbol?: string;
  kTime?: string; // 時間
};

// 日线获取
export function calculateMA(
  dayCount: number,
  inData: TypeKlineValue[],
  type: keyof TypeKlineValue = 'closePrice'
) {
  const result = [];
  for (let i = 0, len = inData.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
    } else {
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += parseFloat(inData[i - j][type] || '0');
      }
      let fixedLength = 10;
      if (sum / dayCount < 0) fixedLength = 12;
      result.push(parseFloat((sum / dayCount).toFixed(fixedLength)));
    }
  }
  return result;
}

/*
 * 计算EMA指数平滑移动平均线，用于MACD
 * @param {number} n 时间窗口
 * @param {array} data 输入数据
 * @param {string} field 计算字段配置
 */
const calcEMA = (n?: number, data?: any, field?: string) => {
  let i: number;
  let l: number;
  let ema: any[];
  const a = 2 / (n||0 + 1);
  if (field) {
    //二维数组
    ema = [data[0][field]];
    for (i = 1, l = data.length; i < l; i++) {
      ema.push(a * data[i][field] + (1 - a) * ema[i - 1]);
    }
  } else {
    //普通一维数组
    ema = [data[0]];
    for (i = 1, l = data.length; i < l; i++) {
      ema.push(a * data[i] + (1 - a) * ema[i - 1]);
    }
  }
  return ema;
};
/*
 * 计算DIF快线，用于MACD
 * @param {number} short 快速EMA时间窗口
 * @param {number} long 慢速EMA时间窗口
 * @param {array} data 输入数据
 * @param {string} field 计算字段配置
 */
const calcDIF = (short: any, long: any, data: any, field: any): number[] => {
  let i: number;
  let l: number;
  const dif = [];
  const emaShort = calcEMA(short, data, field);
  const emaLong = calcEMA(long, data, field);
  for (i = 0, l = data.length; i < l; i++) {
    dif.push(emaShort[i] - emaLong[i]);
  }
  return dif;
};
/*
 * 计算DEA慢线，用于MACD
 * @param {number} mid 对dif的时间窗口
 * @param {array} dif 输入数据
 */
const calcDEA = (mid: any, dif: any) => {
  return calcEMA(mid, dif);
};
/*
 * 计算MACD
 * @param {number} short 快速EMA时间窗口
 * @param {number} long 慢速EMA时间窗口
 * @param {number} mid dea时间窗口
 * @param {array} data 输入数据
 * @param {string} field 计算字段配置
 */
const calcMACD = (short: any, long: any, mid: any, data: any, field: any) => {
  if (data.length === 0) {
    return {
      dif: [],
      dea: [],
      macd: [],
    };
  }
  let i: number;
  let l: number;
  const result: any = {};
  const macd = [];
  const dif = calcDIF(short, long, data, field);
  const dea = calcDEA(mid, dif);
  for (i = 0, l = data.length; i < l; i++) {
    macd.push((dif[i] - dea[i]) * 2);
  }
  result.dif = dif.map((item) => item.toFixed(10));
  result.dea = dea.map((item) => item.toFixed(10));
  result.macd = macd.map((item) => item.toFixed(10));
  return result;
};

export const getOptionSerise = (
  inputData: TypeKlineValue[],
): EChartOption['series'] => {
  const macdInput = inputData.map((item) => ({
    open: parseFloat(item.openPrice),
    close: parseFloat(item.closePrice),
    low: parseFloat(item.minPrice),
    high: parseFloat(item.maxPrice),
  }));
  return [
    // k线
    {
      data: inputData.map((item) => [
        item.openPrice,
        item.closePrice,
        item.minPrice,
        item.maxPrice,
      ]),
      markLine: {
        silent: true,
        symbolSize: 0,
        animation: false,
        label: {
          position: 'insideEndTop',
          // @ts-ignore
          distance: [-50, 0],
        },
        lineStyle: { color: defaultThemeColor },
        // @ts-ignore
        data: [{ yAxis: inputData.length ? parseFloat(inputData[inputData.length - 1].closePrice) : 0 }],
      },
    },
    // ma5日线
    {
      data: calculateMA(5, inputData),
    },
    // ma10日线
    {
      data: calculateMA(10, inputData),
    },
    // ma15日线
    {
      data: calculateMA(15, inputData),
    },
    // 量能
    {
      data: inputData.map((item, index) => [
        index,
        item.volume,
        Number(item.volume) - Number(inputData[index - 1]?.volume) > 0 ? 1 : -1,
      ]),
    },
    // 量能MA5日线
    {
      data: calculateMA(5, inputData, 'volume'),
    },
    // 量能MA10日线
    {
      data: calculateMA(10, inputData, 'volume'),
    },
    // MACD列
    {
      data: (() => {
        const { macd } = calcMACD(12, 26, 9, macdInput, 'close');
        return macd.map((item: number, index: number) => ({
          value: [index, item, Number(item) > 0 ? 1 : -1],
        }));
      })(),
    },
    // DIF线
    {
      data: calcMACD(12, 26, 9, macdInput, 'close').dif,
    },
    // DEA线
    {
      data: calcMACD(12, 26, 9, macdInput, 'close').dea,
    },
  ];
};

export const getOptionTitle = (
  input: EChartOption['series']
): EChartOption['title'] => {
  if (input === undefined) return [];
  return [
    {
      text: `{a|MA5:${
        input[1].data?.[input[1].data?.length - 1] || ''
      }}  {b|MA10:${
        input[2].data?.[input[2].data?.length - 1] || ''
      }}  {c|MA20:${input[3].data?.[input[3].data?.length - 1] || ''}}`,
      textStyle: {
        rich: {
          a: { color: '#ddc680' },
          b: { color: '#61d2c0' },
          c: { color: '#ca93fb' },
        },
      },
    },
    {
      text: `{o|VOL:${
        input[4].data?.[input[4].data?.length - 1] || ''
      }}  {a|MA5:${
        input[5].data?.[input[5].data?.length - 1] || ''
      }}  {b|MA10:${input[6].data?.[input[6].data?.length - 1] || ''}}`,
      textStyle: {
        rich: {
          a: { color: '#ddc680' },
          b: { color: '#61d2c0' },
          o: { color: themeGray },
        },
      },
      top: '65%',
    },
    {
      text: `{o|MACD[12,26,9]}  {o|MACD:${
        (input[7].data?.[input[7].data?.length - 1] as any)?.value?.[1] || ''
      }} {a|DIF:${input[8].data?.[input[8].data?.length - 1] || ''}}  {b|DEA:${
        input[9].data?.[input[9].data?.length - 1] || ''
      }}`,
      textStyle: {
        rich: {
          a: { color: '#ddc680' },
          b: { color: '#61d2c0' },
          o: { color: themeGray },
        },
      },
      top: '80%',
    },
  ];
};

export const kLineOptions = (inputData: TypeKlineValue[]): EChartOption => {
  const macdInput = inputData.map((item) => ({
    open: parseFloat(item.openPrice),
    close: parseFloat(item.closePrice),
    low: parseFloat(item.minPrice),
    high: parseFloat(item.maxPrice),
  }));
  return {
    animation: false,
    textStyle: {
      fontSize: 12,
      lineHeight: 18,
    },
    // 标题
    title: [
      {
        text: '{a|MA5:}  {b|MA10:}  {c|MA20:}',
        textStyle: {
          rich: {
            a: { color: '#ddc680' },
            b: { color: '#61d2c0' },
            c: { color: '#ca93fb' },
          },
        },
      },
      {
        text: '{o|VOL:}  {a|MA5:}  {b|MA10:}',
        textStyle: {
          rich: {
            a: { color: '#ddc680' },
            b: { color: '#61d2c0' },
            o: { color: themeGray },
          },
        },
        top: '65%',
      },
      {
        text: '{o|MACD[12,26,9]}  {o|MACD: {a|DIF:}  {b|DEA:}',
        textStyle: {
          rich: {
            a: { color: '#ddc680' },
            b: { color: '#61d2c0' },
            o: { color: themeGray },
          },
        },
        top: '80%',
      },
    ],
    grid: [
      {
        left: 0,
        top: '5%',
        right: '5%',
        height: '60%',
      },
      {
        left: 0,
        top: '70%',
        right: '5%',
        height: '10%',
      },
      {
        left: 0,
        top: '85%',
        right: '5%',
        height: '10%',
      },
    ],
    xAxis: [
      {
        type: 'category',
        gridIndex: 0,
        data: inputData.map((item) => item.time),
        splitLine: { show: true, lineStyle: { color: '#1e314a' } },
        axisLine: { lineStyle: { color: '#1e314a' } },
        axisTick: { show: true },
        axisLabel: { show: false },
        axisPointer: { label: { show: false } },
      },
      {
        type: 'category',
        gridIndex: 1,
        data: inputData.map((item) => item.time),
        splitLine: { show: true, lineStyle: { color: '#1e314a' } },
        axisLine: { lineStyle: { color: '#1e314a' } },
        axisTick: { show: true },
        axisLabel: { show: false },
        axisPointer: { label: { show: false } },
      },
      {
        type: 'category',
        gridIndex: 2,
        data: inputData.map((item) => item.time),
        splitLine: { show: true, lineStyle: { color: '#1e314a' } },
        axisLine: { lineStyle: { color: '#1e314a' } },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          color: '#8984b3',
        },
        axisPointer: { show: true },
      },
    ],
    yAxis: [
      {
        scale: true,
        gridIndex: 0,
        position: 'right',
        splitLine: { show: true, lineStyle: { color: '#1e314a' } },
        splitNumber: 5,
        axisLine: { lineStyle: { color: '#1e314a' } },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          margin: 1,
          color: '#8984b3',
          fontSize: 10,
          padding: [15, 0, 0, 0],
        },
      },
      {
        scale: true,
        gridIndex: 1,
        position: 'right',
        splitLine: { show: true, lineStyle: { color: '#1e314a' } },
        splitNumber: 3,
        axisLine: { lineStyle: { color: '#1e314a' } },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          margin: 1,
          color: '#8984b3',
          fontSize: 10,
          padding: [15, 0, 0, 0],
        },
      },
      {
        scale: true,
        gridIndex: 2,
        position: 'right',
        splitLine: { show: true, lineStyle: { color: '#1e314a' } },
        splitNumber: 3,
        axisLine: { lineStyle: { color: '#1e314a' } },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          margin: 1,
          color: '#8984b3',
          fontSize: 10,
          padding: [15, 0, 0, 0],
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1, 2],
        minValueSpan: 100,
        start: 100,
      },
    ],
    tooltip: {
      trigger: 'axis',
      triggerOn: 'mousemove|click',
      hideDelay: 3000,
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: defaultThemeColor,
          opacity: 0.5,
          type: 'dashed',
        },
        crossStyle: {
          color: defaultThemeColor,
          opacity: 0.5,
        },
      },
      position(point, _params, _dom, _rect, size) {
        const obj: { [key: string]: number } = { top: 0 };
        obj[
          ['left', 'right'][
            Number(parseFloat(point[0].toString()) < (size as { viewSize: number[] }).viewSize[0] / 2)
          ]
        ] = 5;
        return obj;
      },
      formatter(params) {
        let paramsData: EChartOption.Tooltip.Format[];
        if (Array.isArray(params)) {
          paramsData = params;
        } else {
          paramsData = [params];
        }
        let kLineData: any = [];
        for (let i = 0; i < paramsData.length; i++) {
          if (paramsData[i].seriesName === 'kLine') {
            kLineData = paramsData[i].value;
          }
        }
        let value = '';
        value += '<div style="color: #ccc; font-size: 10px;">';
        value += '开盘价: ' + kLineData[1] + '<br />';
        value += '关盘价: ' + kLineData[2] + '<br />';
        value += '最低价: ' + kLineData[3] + '<br />';
        value += '最高价: ' + kLineData[4] + '<br />';
        value += '时间: ' + paramsData[0].axisValue;
        value += '</div>';
        return value;
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all',
        },
      ],
    },
    visualMap: [
      {
        show: false,
        seriesIndex: 4,
        dimension: 2,
        pieces: [
          {
            value: 1,
            color: themeGreen,
          },
          {
            value: -1,
            color: themeRed,
          },
        ],
      },
      {
        show: false,
        seriesIndex: 7,
        dimension: 2,
        pieces: [
          {
            value: 1,
            color: themeGreen,
          },
          {
            value: -1,
            color: themeRed,
          },
        ],
      },
    ],
    series: [
      // k线
      {
        name: 'kLine',
        type: 'candlestick',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: inputData.map((item) => [
          item.openPrice,
          item.closePrice,
          item.minPrice,
          item.maxPrice,
        ]),
        itemStyle: {
          color: themeGreen,
          // @ts-ignore
          color0: themeRed,
          borderColor: themeGreen,
          borderColor0: themeRed,
        },
        markLine: {
          silent: true,
          symbolSize: 0,
          animation: false,
          label: {
            position: 'insideEndTop',
            // @ts-ignore
            distance: [-50, 0],
          },
          lineStyle: { color: defaultThemeColor },
          // @ts-ignore
          data: [{ yAxis: inputData.length ? parseFloat(inputData[inputData.length - 1].closePrice) : 0 }],
        },
        markPoint: {
          symbol: 'circle',
        },
      },
      // ma5日线
      {
        name: 'MA5',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: calculateMA(5, inputData),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: '#ddc680',
        },
      },
      // ma10日线
      {
        name: 'MA10',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: calculateMA(10, inputData),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: '#61d2c0',
        },
      },
      // ma15日线
      {
        name: 'MA15',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: calculateMA(15, inputData),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: '#ca93fb',
        },
      },
      // 量能
      {
        name: 'volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: inputData.map((item, index) => [
          index,
          item.volume,
          Number(item.volume) - Number(inputData[index - 1]?.volume) > 0
            ? 1
            : -1,
        ]),
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: '#ca93fb',
        },
      },
      // 量能MA5日线
      {
        name: 'volumeMA5',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: calculateMA(5, inputData, 'volume'),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: '#ddc680',
        },
      },
      // 量能MA10日线
      {
        name: 'volumeMA10',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: calculateMA(10, inputData, 'volume'),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: '#61d2c0',
        },
      },
      // MACD列
      {
        name: 'macd',
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: (() => {
          const { macd } = calcMACD(12, 26, 9, macdInput, 'close');
          return macd.map((item: number, index: number) => ({
            value: [index, item, Number(item) > 0 ? 1 : -1],
          }));
        })(),
        barWidth: 1,
      },
      // DIF线
      {
        name: 'DIF',
        type: 'line',
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: calcMACD(12, 26, 9, macdInput, 'close').dif,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: '#ddc680',
        },
      },
      // DEA线
      {
        name: 'DEA',
        type: 'line',
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: calcMACD(12, 26, 9, macdInput, 'close').dea,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: '#61d2c0',
        },
      },
    ],
  };
};
// 导出深度配置
export const depthOptions: EChartOption = {};
