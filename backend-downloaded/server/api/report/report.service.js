const common = require('../../util/common');
const constant = require('../../util/constant');
const sensoralarmDAL = require('./report.helper');



exports.getAlarmReport = async (req, res) => {
  try {
    let from_date = req.query.from_date;
    let to_date = req.query.to_date;
    const alarm_report_data = await sensoralarmDAL.getAllAlarmReports({
      criteria: {
        from_date: from_date,
        to_date: to_date
      }
    });
    const values = { key: "alarm_report", data: alarm_report_data };
    console.info("getAlarmReport", res);
    return common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error(constant.requestMessages.FAILED_TO_RETRIEVE_SENSOR_ALARM_DATA.message, error);
    return res.status(500).json({
      success: false,
      message: constant.requestMessages.FAILED_TO_RETRIEVE_SENSOR_ALARM_DATA,
    });
  }
}

exports.getAlarmTrends = async (req, res) => {
  try {
    const { date, timeframe } = req.query; // "2024-10-01", "monthly", "yearly", or "weekly"

    if (!date || !timeframe) {
      return res.status(400).json({
        success: false,
        message: constant.requestMessages.DATE_AND_TIMEFRAME_ARE_REQUIRED,
      });
    }

    const inpu_date = new Date(date);

    // Start and end dates based on the `timeframe` parameter
    let start_date, end_date;
    if (timeframe === "monthly") {
      start_date = new Date(inpu_date.getFullYear(), 0, 1);
      end_date = new Date(inpu_date.getFullYear(), 11, 31);
    } else if (timeframe === "yearly") {
      start_date = new Date(inpu_date.getFullYear() -5, 0, 1);
      end_date = new Date(inpu_date.getFullYear(), 11, 31);
    } else if (timeframe === "weekly") {
      const day_of_week = inpu_date.getDay(); // Sunday is 0, Saturday is 6
      start_date = new Date(inpu_date);
      start_date.setDate(inpu_date.getDate() - day_of_week); // Start of the week
      end_date = new Date(start_date);
      end_date.setDate(start_date.getDate() + 6); // End of the week
    } else {
      return res.status(400).json({
        success: false,
        message: constant.requestMessages.INVALID_TIMEFRAME_VALUE,
      });
    }

    // Fetching alarm data from the database
    const alarm_data = await sensoralarmDAL.getAllAlarmReports({
      criteria: {
        from_date: start_date,
        to_date: end_date
      }

    });

    // category id 0 is normal, 36, 37, 38 are warning, 1, 2, 3 are alarm
    const total_normal = alarm_data
      .filter(item => item.category_id === 0)
      .reduce((sum, item) => sum + Number(item.total_count || 0), 0);

    const total_warning = alarm_data
      .filter(item => [36, 37, 38].includes(item.category_id))
      .reduce((sum, item) => sum + Number(item.total_count || 0), 0);

    const total_alarm = alarm_data
      .filter(item => ![0, 36, 37, 38].includes(item.category_id))
      .reduce((sum, item) => sum + Number(item.total_count || 0), 0);

    const graph_data = [];

    if (timeframe === "monthly") {
      
      for (let month = 0; month < 12; month++) {
        const month_start = new Date(start_date.getFullYear(), month, 1);
        const month_end = new Date(month_start);
        month_end.setMonth(month_start.getMonth() + 1);

        const monthly_data = alarm_data.filter(
          item => new Date(item.createdAt) >= month_start && new Date(item.createdAt) < month_end
        );

        const total_normal = monthly_data
        .filter(item => item.category_id === 0)
        .reduce((sum, item) => sum + Number(item.total_count || 0), 0);

        const total_warning = monthly_data.filter(item => [36, 37, 38].includes(item.category_id))
        .reduce((sum, item) => sum + Number(item.total_count || 0), 0);

        const total_alarm = monthly_data
        .filter(item => ![0, 36, 37, 38].includes(item.category_id))
        .reduce((sum, item) => sum + Number(item.total_count || 0), 0);

        graph_data.push({
          name: constant.monthNames[month],
          alarm: total_alarm,
          warning: total_warning,
          normal: total_normal,
        });
      }

    } else if (timeframe === "yearly") {
      const current_year = start_date.getFullYear();
      const years_to_consider = 5; // Number of years to go back
      for (let year = current_year; year > current_year - years_to_consider; year--) {
        const year_start = new Date(year, 0, 1);
        const year_end = new Date(year + 1, 0, 1);

        const yearly_data = alarm_data.filter(
          item => {
            const item_date = new Date(item.createdAt);
            return item_date >= year_start && item_date < year_end;
          }
        );

        const total_normal = yearly_data
        .filter(item => item.category_id === 0)
        .reduce((sum, item) => sum + Number(item.total_count || 0), 0);
        const total_warning = yearly_data.filter(item => [36, 37, 38].includes(item.category_id))
        .reduce((sum, item) => sum + Number(item.total_count || 0), 0);
        const total_alarm = yearly_data.filter(item => ![0, 36, 37, 38].includes(item.category_id))
        .reduce((sum, item) => sum + Number(item.total_count || 0), 0);

        graph_data.push({
          name: year,
          alarm: total_alarm,
          warning: total_warning,
          normal: total_normal,
        });
      }
    } else if (timeframe === "weekly") {
      
      for (let day = 0; day <= 6; day++) {
        const day_start = new Date(start_date);
        day_start.setDate(start_date.getDate() + day);

        const daily_data = alarm_data.filter(
          item => areSameDay(new Date(item.createdAt), day_start)
        );

        const total_normal = daily_data.filter(item => item.category_id === 0)
        .reduce((sum, item) => sum + Number(item.total_count || 0), 0);
        const total_warning = daily_data.filter(item => [36, 37, 38].includes(item.category_id))
        .reduce((sum, item) => sum + Number(item.total_count || 0), 0);
        const total_alarm = daily_data.filter(item => ![0, 36, 37, 38].includes(item.category_id))
        .reduce((sum, item) => sum + Number(item.total_count || 0), 0);

        graph_data.push({
          name: constant.daysOfWeek[day_start.getDay()],
          alarm: total_alarm,
          warning: total_warning,
          normal: total_normal,
        });
      }
    }

    const values = {
      key: "data",  
      data: {
        timeframe: timeframe.charAt(0).toUpperCase() + timeframe.slice(1),
        totals: {
          alarm: total_alarm,
          warning: total_warning,
          normal: total_normal,
        },
        graph_data: graph_data,
      }
    };
    console.info("values", values);
  
    return common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error(constant.requestMessages.FAILED_TO_FETCH_ALARM_OVERVIEW_DATA, error);
    return res.status(500).json({
      success: false,
      message: constant.requestMessages.FAILED_TO_FETCH_ALARM_OVERVIEW_DATA,
    });
  }
};

// Helper function to compare if two dates fall on the same day
const areSameDay = (date1, date2) => {
  return date1.toISOString().split("T")[0] === date2.toISOString().split("T")[0];
};
 

