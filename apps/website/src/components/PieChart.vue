<script setup lang="ts" generic="T">
import type { Chart, ChartOptions, LegendItem, PieMetaExtensions, TooltipItem } from "chart.js";
import { countBy, get } from "lodash-es";
import type { Context } from "chartjs-plugin-datalabels";

const props = defineProps<{ value: T[]; field: string }>();
const documentStyle = getComputedStyle(document.body);
const palette = ["red", "blue", "green", "yellow", "purple", "orange", "indigo", "cyan"];
const backgroundColor = palette.map((value) => documentStyle.getPropertyValue(`--${value}-400`));

const pieData = computed(() => {
  const counts = countBy(props.value, (value) => get(value, props.field));
  if (counts["undefined"]) {
    counts["未指派"] = counts["undefined"];
    delete counts["undefined"];
  }
  // 手動加空白 padding e.g. Ｏ A 聯隊戰主帳
  return {
    labels: Object.keys(counts).map((value) => `  ${value}`),
    datasets: [{ data: Object.values(counts), backgroundColor }]
  };
});

function calcPercentage(value: number, chart: Chart) {
  const meta = chart.getDatasetMeta(0) as PieMetaExtensions;
  return (value * 100) / meta.total;
}

const chartOption: ChartOptions = {
  plugins: {
    datalabels: {
      formatter(value, ctx: Context) {
        const percentage = calcPercentage(value, ctx.chart);
        return percentage > 10 ? `${value} 個, ${percentage.toFixed(1)}%` : "";
      },
      color: "#fff"
    },
    tooltip: {
      callbacks: {
        footer(tooltipItems: TooltipItem<"pie">[]) {
          return `${calcPercentage(tooltipItems[0].raw as number, tooltipItems[0].chart).toFixed(1)}%`;
        }
      }
    },
    legend: {
      display: true,
      position: "right",
      labels: {
        usePointStyle: true,
        padding: 30,
        color: "#FFFFFF",
        sort(a: LegendItem, b: LegendItem) {
          return a.text.localeCompare(b.text);
        }
      }
    }
  }
};
</script>

<template>
  <Chart :data="pieData" type="pie" style="width: 400px; height: 400px" :options="chartOption" />
</template>

<style scoped></style>
