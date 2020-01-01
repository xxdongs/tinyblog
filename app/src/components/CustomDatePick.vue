<template>
  <div>
    <a-range-picker :ranges="ranges" format="YYYY-MM-DD" @change="onChange" />
  </div>
</template>

<script>
import moment from "moment";
import eventBus from "@/common/eventBus";

export default {
  name: "CustomDatePick",
  data() {
    return {
      moment,
      ranges: {
        昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        今天: [moment(), moment()],
        本周: [moment().startOf("week"), moment().endOf("week")],
        上周: [
          moment()
            .startOf("week")
            .subtract(7, "days"),
          moment()
            .endOf("week")
            .subtract(7, "days")
        ],
        本月: [moment().startOf("month"), moment()],
        上月: [
          moment()
            .subtract(1, "months")
            .startOf("month"),
          moment()
            .subtract(1, "months")
            .endOf("month")
        ],
        今年: [moment().startOf("year"), moment()],
        去年: [
          moment()
            .subtract(1, "years")
            .startOf("year"),
          moment()
            .subtract(1, "years")
            .endOf("year")
        ]
      }
    };
  },
  methods: {
    onChange(dates, dateStrings) {
     eventBus.$emit("onDatePickChange", dateStrings);
    }
  }
};
</script>

<style scoped>
</style>