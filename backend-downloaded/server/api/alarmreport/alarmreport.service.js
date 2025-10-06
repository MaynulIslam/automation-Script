const common = require('../../util/common');
const constant = require('../../util/constant');
const alarmReportDAL = require('./alarmreport.helper');

exports.getAlarmCategoryReport = async (req, res) => {
  try {

    const { start_date, end_date } = req.query;
    
    // Check if both dates are provided
    if (!start_date || !end_date) {
      return common.sendResponse(
        res,
        'Start date and end date are required',
        false,
        400
      );
    }

    const queryParams = {
      startDate: start_date,  // Convert from snake_case to camelCase if needed
      endDate: end_date       // Convert from snake_case to camelCase if needed
    };
    
    const alarm_report = await alarmReportDAL.getAlarmReportsWithCategories(queryParams);

    console.info('Successfully retrieved device types:', alarm_report);
    return common.sendResponse(res,
      constant.requestMessages.SUCCESSFULLY_RETRIEVED_ALARM_REPORT,
      alarm_report,
      200
    );

  } catch (error) {
    console.error('Error retrieving device types:', error);

    return common.sendResponse(res,
      constant.requestMessages.FAILED_TO_INSERT_DEVICE,
      false,
      500
    );
  }
};


exports.getAlarmSummaryByCategory = async (req, res) => {
  try {

    const { start_date, end_date } = req.query;
    
    // Check if both dates are provided
    if (!start_date || !end_date) {
      return common.sendResponse(
        res,
        'Start date and end date are required',
        false,
        400
      );
    }


    const alarm_report = await alarmReportDAL.getAlarmSummaryByCategory(start_date, end_date);

    // console.info('Successfully retrieved device types:', alarm_report);
    return common.sendResponse(res,
      {
        alarm_report,
        message: constant.requestMessages.SUCCESSFULLY_RETRIEVED_ALARM_REPORT,
      },
      true,
      200
    );

  } catch (error) {
    console.error('Error retrieving device types:', error);

    return common.sendResponse(res,
      constant.requestMessages.FAILED_TO_INSERT_DEVICE,
      false,
      500
    );
  }
};